import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Popover from './stencil-popover.js';
import urlUtils from '../common/utils/url-utils';

export default function ({ token }) {
    const storeLocatorButton = document.getElementById('store-locator-toggler');
    const template = document.getElementById('popoverWrapper');

    const mockedLocations = {
        "data": {
            "inventory": {
            "locations": {
                "edges": [
                {
                    "node": {
                    "entityId": 1,
                    "code": "123",
                    "description": "asdasd",
                    "label": "a",
                    "typeId": "PHYSICAL",
                    "address": {
                        "code": "BC-ADDRESS-1",
                        "address1": "123",
                        "city": "London",
                        "stateOrProvince": "asdasdasdas",
                        "countryCode": "JM",
                        "phone": "",
                        "email": "asdasd@mail.com",
                        "latitude": 51.5074,
                        "longitude": 0.1278
                    },
                    "operatingHours": {
                        "sunday": {
                        "open": true,
                        "opening": "02:00",
                        "closing": "00:00"
                        },
                        "monday": {
                        "open": true,
                        "opening": "00:30",
                        "closing": "02:30"
                        },
                        "thursday": {
                        "open": true,
                        "opening": "01:30",
                        "closing": "01:30"
                        },
                        "wednesday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "tuesday": {
                        "open": false,
                        "opening": "01:00",
                        "closing": "01:30"
                        },
                        "friday": {
                        "open": false,
                        "opening": "02:00",
                        "closing": "01:00"
                        },
                        "saturday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        }
                    }
                    }
                },
                {
                    "node": {
                    "entityId": 29,
                    "code": "123123",
                    "description": null,
                    "label": "Test",
                    "typeId": "PHYSICAL",
                    "address": {
                        "code": "67d6114c-2f35-4bd7-9f10-b69e8b5bf1c2",
                        "address1": "123",
                        "city": "Ternopil",
                        "stateOrProvince": "12",
                        "countryCode": "AL",
                        "phone": "123",
                        "email": "asdasd@asda.cm",
                        "latitude": 49.5535,
                        "longitude": 25.5948
                    },
                    "operatingHours": {
                        "sunday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "monday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "thursday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "wednesday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "tuesday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "friday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        },
                        "saturday": {
                        "open": false,
                        "opening": "",
                        "closing": ""
                        }
                    }
                    }
                },
                {
                    "node": {
                    "entityId": 31,
                    "code": "1231234535435",
                    "description": null,
                    "label": "Test",
                    "typeId": "PHYSICAL",
                    "address": {
                        "code": "816292f7-821e-44bf-a19c-c32dc70ca7b1",
                        "address1": "Test address",
                        "city": "Kyiv",
                        "stateOrProvince": "asdsad",
                        "countryCode": "AL",
                        "phone": "",
                        "email": "asdasd@mail.com",
                        "latitude": 50.4501,
                        "longitude": 30.5234
                    },
                    "operatingHours": {
                        "sunday": {
                        "open": false,
                        "opening": "00:00",
                        "closing": "00:00"
                        },
                        "monday": {
                        "open": true,
                        "opening": "09:00",
                        "closing": "17:00"
                        },
                        "thursday": {
                        "open": true,
                        "opening": "09:00",
                        "closing": "17:00"
                        },
                        "wednesday": {
                        "open": true,
                        "opening": "09:00",
                        "closing": "17:00"
                        },
                        "tuesday": {
                        "open": true,
                        "opening": "09:00",
                        "closing": "17:00"
                        },
                        "friday": {
                        "open": true,
                        "opening": "09:00",
                        "closing": "17:00"
                        },
                        "saturday": {
                        "open": false,
                        "opening": "00:00",
                        "closing": "00:00"
                        }
                    }
                    }
                }
                ]
            }
            }
        }
    }

    const request = fetch('/graphql', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: `
            {
                inventory {
                    locations {
                        edges {
                            node {
                                entityId
                                code
                                description
                                label
                                typeId
                                address {
                                    code
                                    address1
                                    city
                                    stateOrProvince
                                    countryCode
                                    phone
                                    email
                                    latitude
                                    longitude
                                }
                                operatingHours {
                                    sunday {
                                        open
                                        opening
                                        closing
                                    }
                                    monday {
                                        open
                                        opening
                                        closing
                                    }
                                    thursday {
                                        open
                                        opening
                                        closing
                                    }
                                    wednesday {
                                        open
                                        opening
                                        closing
                                    }
                                    tuesday {
                                        open
                                        opening
                                        closing
                                    }
                                    friday {
                                        open
                                        opening
                                        closing
                                    }
                                    saturday {
                                        open
                                        opening
                                        closing
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ` }),
    })
    .then((response) => response.json());

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

    Promise.all([request, getUserLocation()]).then(([result, data]) => {
        const pop = new Popover(template, storeLocatorButton, {
            position: Popover.BOTTOM
        });

        const _data = result?.data?.inventory ? result : mockedLocations;
        const locations = getLocationsList(_data);
        const getLocationById = getLocationFinderById(locations);

        const locationBlock = document.getElementById('store-locator-city');
        const input = document.getElementById('store-locator-input');

        if (data.coords) {
            const distancesList = locations.map(({ entityId, address }) => {
                return {
                    entityId,
                    distance: getDistanceBetweenTwoLocations(data.coords, address) };
            }).sort(({ distance: distance1 }, { distance: distance2 }) => distance1 - distance2);

            const closestLocationId = distancesList[0].entityId;

            const defaultLocation = getLocationById(closestLocationId);
            const preferredLocationId = getPreferedLocationId();

            setPreferredLocation(preferredLocationId ? getLocationById(preferredLocationId) : defaultLocation);


            const searchResultsWrapper = document.getElementById('store-locator-search-results');
            const sortedLocation = distancesList.map(({ entityId }) => locations.find(({ entityId: _entityId }) => _entityId === entityId));

            setInnerHTMLlocationsString(sortedLocation);


            if (preferredLocationId) {
                switchButtonToLabel()
            }

            input.addEventListener('input', getHandlerOfLocationFiltering(sortedLocation));
            getSetPreferredButtonNode().addEventListener('click', handlePreferredButtonClick);
            searchResultsWrapper.addEventListener('click', getHandlerSelectionOfPreferredLocation(getLocationById));
        }
    });

    const getHandlerOfLocationFiltering = (locations = []) => (event) => {
        const value = event.target.value.toLowerCase();
        const resultLocations = locations.filter(({ address: { city } }) => {
            return (city.toLowerCase().match(value) !== null);
        });

        setInnerHTMLlocationsString(resultLocations);
    };

    const handlePreferredButtonClick = (event) => {
        switchButtonToLabel();
        setPreferedLocationIdToLocalStorage(defaultLocation.entityId);
    };

    const getHandlerSelectionOfPreferredLocation = (getLocationById = () => {}) => (event) => {
        const location = getLocationById(event.target.getAttribute('data-id'));

        setPreferredLocation(location);
    };

    const switchButtonToLabel = () => {
        const setPreferredButton = getSetPreferredButtonNode();
        const setPreferredLabel = document.getElementById('preferred-location-label');

        setPreferredButton.style.display = 'none';
        setPreferredLabel.style.display = 'inline';
    };

    const getSetPreferredButtonNode = () => document.getElementById('set-preferred-location-button');

    const setPreferredLocation = (location) => {
        const locationBlock = document.getElementById('store-locator-city');
        const storeLocatorButtonLabel = document.getElementById('store-locator-toggler-label');

        storeLocatorButtonLabel.innerHTML = location.address.city;
        locationBlock.innerHTML = location.address.city;
    };

    const setPreferedLocationIdToLocalStorage = (id) => window.localStorage.setItem('peferedLocationId', id);

    const getPreferedLocationId = () => window.localStorage.getItem('peferedLocationId');

    const getLocationsList = ({ data: { inventory: { locations: { edges } } } }) => {
        return edges.map(({ node }) => node);
    };

    const getLocationFinderById = (locations = []) => (id) => locations.find(({ entityId }) => Number(id) === entityId);

    const setInnerHTMLlocationsString = (locations = []) => {
        const locationsSection = document.getElementById('store-locator-search-results');
        const locationItems = locations.map(({ entityId, address: { city } }) => {
            return `<div data-id="${entityId}" class="serched-location-item">${city}</div>`;
        }).join('');

        locationsSection.innerHTML = locationItems;
    };

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
}