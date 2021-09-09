import _ from 'lodash';
import { populateProductsWithStockLevel } from '../common/utils/products-listing.js';
import modalFactory from './modal.js';

const getWeekDay = () => {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const now = new Date();

    return days[now.getDay()];
}

const getDistanceBetweenTwoLocations = (location1, location2) => {
    const { latitude: latitude1, longitude: longitude1 } = location1;
    const { latitude: latitude2, longitude: longitude2 } = location2;
    const radlat1 = Math.PI * latitude1 / 180;
    const radlat2 = Math.PI * latitude2 / 180;
    const theta = longitude1 - longitude2;
    const radtheta = Math.PI * theta / 180;

    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    if (dist > 1) {
        dist = 1;
    }

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    return dist;
};

const getUserLocation = () => {
    const promise = new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((_location) => {
                resolve(_location);
            });
        } else {
            reject('The Browser Does not Support Geolocation');
        }
    });

    return promise;
};

const groupeLocaions = (edges) => edges.reduce((accum, item) => {
    const { node: { address: { countryCode } } } = item;

    return {
        ...accum,
        [countryCode]: [...(accum[countryCode] || []), item.node]
    }
}, {});

export default function ({ token }) {
    const $modal = modalFactory('#modal')[0];
    const trigger = $('#store-locator-button');
    const activePreferredId = Number(localStorage.getItem('preferredLocationId'));

    // DEFINING THE LABEL
    if (activePreferredId) {
        $('#store-locator-default-label').hide();
    }
    const address = localStorage.getItem('preferredLocationAddress');

    $('.store-locator-toggler-label-location').html(address);

    // @todo: should be moved to the seperate file;    
    populateProductsWithStockLevel(token).then(({ edges }) => {
        if (activePreferredId) {
            const { operatingHours } = edges.find(({ node: { entityId } }) => entityId === activePreferredId)?.node;
            const { open, closing } = operatingHours[getWeekDay()];
    
            $('.store-locator-toggler-label-description').html(open ? `Open until ${closing}` : 'Closed');
        }

        const getLocationsListTemplate = (withGrouping = true, locations = []) => Object.entries(groupeLocaions(locations)).map(([key, value]) => {
            const locationItems = value.map(({ entityId, label, address }) =>
                `<div id="location-${entityId}" class="location-item">
                    <div class="location-item-content">
                        <div>
                            <div class="location-item-title">${label}</div>
                            <div class="location-item-info">${address.address1}</div>
                            <div class="location-item-info">${address.city}</div>
                        </div>
                        ${activePreferredId === entityId ? 'Selected' : `<button id="location-${entityId}" class="button shop-here-button">Shop here</button>`}
                    </div>
                    <span class="location-item-description"></span>
                </div>`
            ).join('');

            return (withGrouping ? `
                <div class="locations-groupe">
                    <h3>${key}</h3>
                    ${locationItems}
                </div>
            ` : locationItems);
        }).join('');

        const toggleLoadingOverlay = (shouldDisplay = true) => 
            $('#store-locator-list-section')
                .find('.loadingOverlay')
                .css('display', shouldDisplay ? 'block' : 'none');


        
        trigger.on('click', () => {
            $modal.open({ pending: false });
            $modal.updateContent(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-header-title">
                            Select preffered store
                        </h1>
                    </div>
                    <div class="store-locator-body">
                        <div id="store-locator-list-section" class="store-locator-body-item">
                            <div class="store-locator-filter-section">
                                <input id="location-filter" class="form-input" placeholder="Search by Zip, City or State" />
                                <button id="define-location-button" class="button button--icon button--primary">
                                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 8.13 15.87 5 12 5C8.13 5 5 8.13 5 12Z" />
                                    </svg>
                                </button>
                            </div>
                            <div id="location-list" class="location-list">
                                ${getLocationsListTemplate(true, edges)}
                            </div>
                            <div class="loadingOverlay"></div>
                        </div>
                        <div class="store-locator-body-item location-details">
                        </div>
                    </div>
                </div>
            `);


            // DEFINING USER LOCAATION
            $('#define-location-button').on('click', function() {
                toggleLoadingOverlay(true);
                getUserLocation().then((data) => {
                    toggleLoadingOverlay(false);

                    const distancesList = edges.map(( { node: { entityId, address } }) => {
                        return {
                            entityId,
                            distance: getDistanceBetweenTwoLocations(data.coords, address) };
                    }).sort(({ distance: distance1 }, { distance: distance2 }) => distance1 - distance2);

                    const sortedLocation = distancesList.map(({ entityId }) => edges.find(({ node: { entityId: _entityId } }) => _entityId === entityId));
                    const filteredLocationsTemplate = getLocationsListTemplate(false, sortedLocation);
                    $('#location-list').html(filteredLocationsTemplate);
                });


            });

            // FILTERING
            $('#location-filter').on('input', (e) => {
                const filterText = e.target.value.toLowerCase();
                const filteredLocations = edges.filter(({ node: { address: { city, stateOrProvince }, code } }) => {
                    const formattedCity = city.toLowerCase();

                    return formattedCity.includes(filterText) || stateOrProvince.includes(filterText) || code.includes(filterText);
                });


                const filteredLocationsTemplate = getLocationsListTemplate(filterText.length === 0, filteredLocations);

                $('#location-list').html(filteredLocationsTemplate);
            });

            $('#location-list').on('click', '.shop-here-button', function(event) {
                event.stopPropagation();

                const locationId = Number(this.id.split('-')[1]);
                const { address: { address1: address } } = edges.find(({ node: { entityId } }) => entityId === locationId)?.node;

                localStorage.setItem('preferredLocationId', locationId);
                localStorage.setItem('preferredLocationAddress', address);
                location.reload();
            });


            $('#location-list').on('click', '.location-item', function() {
                const locationId = Number(this.id.split('-')[1]);
                const locationDetails = edges.find(({ node: { entityId } }) => entityId === locationId)?.node;

                $('.location-item').removeClass('location-item--active');
                $(`#${this.id}`).addClass('location-item--active');

                if (locationDetails) {
                    const { operatingHours, address: { phone }, timeZone } = locationDetails;
                    const $detailsBlock = $('.location-details');

                    const openingHoursItemsTemplate = Object.entries(operatingHours).map(([day, value]) => {
                        const dayFormatted = day.charAt(0).toUpperCase() + day.slice(1);

                        return `
                            <div class="opening-hours-item">
                                <div>${dayFormatted}</div>
                                <div>${value.open ? `${value.opening} — ${value.closing}` : 'Closed'}</div>
                            </div>`
                    }).join('');

                    const phoneNumber = `
                        <div class="location-details-section">
                            <div class="location-item-title">Phone number</div>
                            ${phone || '—'}
                        </div>
                    `;

                    const openingHoursTemplate = `
                        <div class="location-details-section opening-hours-section">
                        <div class="location-item-title">${timeZone ? `Time zone: ${timeZone}` : ''}</div>
                            <div class="location-item-title">Store hours</div>
                            ${openingHoursItemsTemplate}
                        </div>
                    `;

                    $detailsBlock.html(`
                        <div class="">
                            <h2>${locationDetails.label}</h2>
                            ${openingHoursTemplate}
                            ${phoneNumber}
                        </div
                    `);
                }

            });
    
        });
    });
};
