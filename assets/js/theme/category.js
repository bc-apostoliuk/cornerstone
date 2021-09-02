import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';
import { getAllProducts } from './getAllProducts';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();
        this.populateProductsWithStockLevel();
    }

    mergeArrays(...arrays) {
        let jointArray = []
    
        arrays.forEach(array => {
            jointArray = [...jointArray, ...array]
        })
        const uniqueArray = jointArray.reduce((newArray, item) =>{
            if (newArray.includes(item)){
                return newArray
            } else {
                return [...newArray, item]
            }
        }, [])
        return uniqueArray
    }

    populateProductsWithStockLevel() {
        const preferredLocationId = Number(window.localStorage.getItem('preferredLocationId'));
        // const preferredLocationId = '';
        const $productsStockLevelBlock = $('.product #stock-level-by-location');

        getAllProducts(preferredLocationId, this.context.token).then(({ data : { site: { products }, inventory }}) => {
            console.log('products', products, inventory);
            const preferredlocationData = inventory.locations.edges.find(({ node: { entityId } }) => entityId === preferredLocationId);


            $.each($productsStockLevelBlock, (_, value) => {
                const $stockLevelBlock = $(value);
                const $deliveryStockLevelBlock = $stockLevelBlock.find('#delivery-stock');
                const $infoStockLevelBlock = $stockLevelBlock.find('#stock-info');
                const $stockLevelDelivery = $stockLevelBlock.find('#delivery-stock-level');
                const $stockLevelPickup = $stockLevelBlock.find('#pickup-stock-level');
                const productId = Number($stockLevelBlock.attr('data-id'));
                const productInventory = products.edges.find(({ node: { entityId } }) => entityId === productId);
                const isPreferredLocationSelected = !!preferredLocationId;
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
                                others: this.mergeArrays(accum.others, availableAtOthersStores),
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
                    console.log('TEST');
                    $stockLevelPickup.html(generalStockLevel > 0 ? inStockMsg : outOfStockMsg);
                    $stockLevelPickup.addClass(generalStockLevel > 0 ? 'stock-level-by-location--success' : 'stock-level-by-location--error');
                }

                $stockLevelDelivery.text(aggregatedByVariants.default > 0 ? `${aggregatedByVariants.default} in stock` : 'out of stock');
                $stockLevelDelivery.addClass(aggregatedByVariants.default > 0 ? 'stock-level-by-location--success' : 'stock-level-by-location--error');

            });
        });
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
