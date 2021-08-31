const getFilterIfNeeded = (value, key) => value ? `(${key || 'entityIds'}: ${value})` : '';
const getNode = (obj) => obj?.edges[0].node;

export const getProductInventory =
    (
        token,
        {
            variantId,
            productId,
            locationId
        },
        { filterByLocationId }
    ) =>
    fetch('/graphql', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: `
        {
            site {
                products${getFilterIfNeeded(productId)} {
                  edges {
                    node {
                      inventory {
                        hasVariantInventory
                        aggregated {
                          availableToSell
                          warningLevel
                        }
                      }
                      entityId
                      name
                        variants${getFilterIfNeeded(variantId)} {
                        edges {
                          node {
                            entityId
                            sku
                            inventory {
                              aggregated {
                                availableToSell
                                warningLevel
                              }
                              byLocation {
                                edges {
                                  node {
                                    locationEntityId
                                    locationEntityCode
                                    locationEntityTypeId
                                    availableToSell
                                    warningLevel
                                    isInStock
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
            }
        }
        ` }),
    })
    .then((response) => response.json())
    .then((data) =>  {
        return data.data || {
                "site": {
                  "products": {
                    "edges": [
                      {
                        "node": {
                          "inventory": {
                            "aggregated": {
                              "availableToSell": 0,
                              "warningLevel": 0
                            }
                          },
                          "entityId": 138,
                          "name": "Complex product",
                          "variants": {
                            "edges": [
                              {
                                "node": {
                                  "entityId": 108,
                                  "sku": "138-GR",
                                  "inventory": {
                                    "aggregated": {
                                      "availableToSell": 0,
                                      "warningLevel": 0
                                    },
                                    "byLocation": {
                                        "edges": [
                                            {
                                              "node": {
                                                "locationEntityId": 1,
                                                "locationEntityCode": "BC-LOCATION-1",
                                                "locationEntityTypeId": "PHYSICAL",
                                                "availableToSell": 10,
                                                "warningLevel": 0,
                                                "isInStock": true
                                              }
                                            },
                                            {
                                              "node": {
                                                "locationEntityId": 5,
                                                "locationEntityCode": "123213213124124321",
                                                "locationEntityTypeId": "PHYSICAL",
                                                "availableToSell": 50,
                                                "warningLevel": 0,
                                                "isInStock": true
                                              }
                                            },
                                            {
                                              "node": {
                                                "locationEntityId": 6,
                                                "locationEntityCode": "2423423432423",
                                                "locationEntityTypeId": "PHYSICAL",
                                                "availableToSell": 0,
                                                "warningLevel": 0,
                                                "isInStock": false
                                              }
                                            }
                                          ]
                                    }
                                  },
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
    }})
    .then((data) => {
        const locations = getNode(getNode(data.site.products).variants)
            ?.inventory
            ?.byLocation.edges;

            window.locationsList = locations;

            return {
                delivery: locations.find(({ node: { locationEntityId } }) => {
                    return locationEntityId === 1
                })?.node,
                pickup: locations.find(({ node: { locationEntityId } }) => {
                    return Number(locationEntityId) === Number(filterByLocationId)
                })?.node
            }
    });
