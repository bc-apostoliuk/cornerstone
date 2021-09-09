import { getAllProducts } from "../../getAllProducts";

export const mergeArrays = (...arrays) => {
    let jointArray = []

    arrays.forEach(array => {
        jointArray = [...jointArray, ...array]
    })

    const uniqueArray = jointArray.reduce((newArray, item) =>{
        if (newArray.includes(item)) {
            return newArray;
        } else {
            return [...newArray, item];
        }
    }, []);
    return uniqueArray;
};

export const populateProductsWithStockLevel = (token) => {
    const preferredLocationId = Number(window.localStorage.getItem('preferredLocationId'));
    // const preferredLocationId = '';
    const $productsStockLevelBlock = $('.card #stock-level-by-location');
    const isPreferredLocationSelected = !!preferredLocationId;

    return getAllProducts(preferredLocationId, token).then(({ data : { site: { products }, inventory }}) => {
        const preferredlocationData = inventory.locations.edges.find(({ node: { entityId } }) => entityId === preferredLocationId);

        const getProductInventory = (productId) => products.edges.find(({ node: { entityId } }) => entityId === productId);

        $.each($productsStockLevelBlock, (_, value) => {
            const $stockLevelBlock = $(value);
            const $deliveryStockLevelBlock = $stockLevelBlock.find('#delivery-stock');
            const $infoStockLevelBlock = $stockLevelBlock.find('#stock-info');
            const $stockLevelDelivery = $stockLevelBlock.find('#delivery-stock-level');
            const $stockLevelPickup = $stockLevelBlock.find('#pickup-stock-level');
            const productId = Number($stockLevelBlock.attr('data-id'));
            const productInventory = getProductInventory(productId);
            const aggregatedStockLevel = productInventory?.node.inventory?.aggregated.availableToSell || 0;
            const aggregatedByVariants = productInventory.node.variants.edges.reduce((accum, { node: { entityId: variantId, inventory } }) => {
                const preferredLocationData = inventory?.byLocation.edges.find(({ node: { locationEntityId } }) => {
                    return locationEntityId === preferredLocationId;
                });
                const defaultLocationData = inventory?.byLocation.edges.find(({ node: { locationEntityId } }) => {
                    return locationEntityId === 1;
                });
                const availableAtOthersStores = inventory?.byLocation.edges.filter(({ node: { locationEntityId, availableToSell } }) => {
                    return (locationEntityId !== 1) && (availableToSell > 0)
                }).map(({ node: { locationEntityId } }) => locationEntityId);

                return preferredLocationData || defaultLocationData
                    ?  {
                            ...accum,
                            preferred: accum.preferred + (preferredLocationData?.node.availableToSell || 0),
                            default: accum.default + (defaultLocationData?.node.availableToSell || 0),
                            others: mergeArrays(accum.others, availableAtOthersStores),
                        }
                    : accum;
            }, { preferred: 0, default: 0, others: [] });
            const isOnlyForPickUp = aggregatedByVariants.preferred && !aggregatedByVariants.default;
            const generalStockLevel = isPreferredLocationSelected
                ? aggregatedByVariants.preferred : aggregatedStockLevel;
            const inStockMsg = `${generalStockLevel} in stock${isPreferredLocationSelected ? ` at <a>${preferredlocationData?.node.address.address1}</a>` : ''}`;
            const outOfStockMsg = `out of stock${isPreferredLocationSelected ? ` at <a>${preferredlocationData?.node.address.address1}</a>` : ''}`;

            if (isOnlyForPickUp) {
                $deliveryStockLevelBlock.hide();
                $infoStockLevelBlock.text('! Pickup in store only');

            }

            if (!isPreferredLocationSelected) {
                $stockLevelPickup.html(aggregatedByVariants.others.length > 0 ? `<a>available in ${aggregatedByVariants.others.length} stores</a>` : 'out of stock');
                $stockLevelPickup.addClass(aggregatedByVariants.others.length > 0 ? 'stock-level-by-location--success' : 'stock-level-by-location--error');
            } else {
                $stockLevelPickup.html(generalStockLevel > 0 ? inStockMsg : outOfStockMsg);
                $stockLevelPickup.addClass(generalStockLevel > 0 ? 'stock-level-by-location--success' : 'stock-level-by-location--error');
            }

            $stockLevelDelivery.text(aggregatedByVariants.default > 0 ? `${aggregatedByVariants.default} in stock` : 'out of stock');
            $stockLevelDelivery.addClass(aggregatedByVariants.default > 0 ? 'stock-level-by-location--success' : 'stock-level-by-location--error');

        });

        const $deliveryStockSection = $('#delivery-stock');
        const $pickupStockSection = $('#pickup-stock');
        const $pickupStockInfoSection = $('#pickup-stock-info');

        const productId = $('[name="product_id"]').val();
        const productInventory = getProductInventory(Number(productId));

        if (productInventory) {
            // @todo: avoid replication of code
            const { preferred: pickup, default: delivery, others, stockByLocationsId } = productInventory.node.variants.edges.reduce((accum, { node: { entityId: variantId, inventory } }) => {
                const preferredLocationData = inventory?.byLocation.edges.find(({ node: { locationEntityId } }) => {
                    return locationEntityId === preferredLocationId;
                });
                const defaultLocationData = inventory?.byLocation.edges.find(({ node: { locationEntityId } }) => {
                    return locationEntityId === 1;
                });
                const availableAtOthersStores = inventory?.byLocation.edges.filter(({ node: { locationEntityId, availableToSell } }) => {
                    return (locationEntityId !== 1) && (availableToSell > 0)
                }).reduce((accum, { node: { locationEntityId, availableToSell } }) => ({ ...accum, [locationEntityId]: availableToSell }), {});

                return preferredLocationData || defaultLocationData
                    ?  {
                            ...accum,
                            preferred: accum.preferred + (preferredLocationData?.node.availableToSell || 0),
                            default: accum.default + (defaultLocationData?.node.availableToSell || 0),
                            others: mergeArrays(accum.others, Object.keys(availableAtOthersStores)),
                            stockByLocationsId: Object.keys(availableAtOthersStores).reduce((acc, id) => ({ ...acc, [id]: availableAtOthersStores[id] + (accum.stockByLocationsId[id] || 0) }), {})
                        }
                    : accum;
            }, { preferred: 0, default: 0, others: [], stockByLocationsId: {} });

            const isInStockDelivery = delivery > 0;

            $deliveryStockSection.html(isInStockDelivery ? `${delivery} in stock` : 'Out of stock');

            if (isPreferredLocationSelected) {
                const isInStockPickup = pickup > 0;

                $pickupStockSection.html(isInStockPickup ? `${pickup} in stock` : 'Out of stock');
                $pickupStockInfoSection.html(` at ${preferredlocationData.node.address.address1} ${isInStockPickup ? '' : ', available at other stores.'}`);
    
            } else {
                $pickupStockInfoSection.html(`Available in ${others.length} store`);
            }

            $('#change-store-button').on('click', () => {
                $('#store-locator-button').trigger('click');

                $.each($('.location-item'), (_, value) => {
                    const locationId = Number(value.id.split('-')[1]);
                    const isInStock = stockByLocationsId[locationId] > 0;
                    const $stockSection = $(value).find('.location-item-description');
                    
                    $stockSection.html(isInStock ? `${stockByLocationsId[locationId]} in stock` : 'Out of stock');

                    if (!isInStock) {
                        $stockSection.addClass('location-item-description--error');
                    }
                });
            });

        }

        return inventory.locations;
    });
}
