const getFilterIfNeeded = (value, key) => value ? `(${key || 'entityIds'}: ${value})` : '';
const getNode = (obj) => obj?.edges[0].node;

export const getProductInventory = (token, { variantId, productId, locationId }) => fetch('/graphql', {
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
                              byLocation${getFilterIfNeeded(locationId, 'locationEntityIds')} {
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
                                            "locationEntityCode": "123",
                                            "locationEntityTypeId": "PHYSICAL",
                                            "availableToSell": 10,
                                            "warningLevel": 0,
                                            "isInStock": true
                                          }
                                        }
                                      ]
                                    }
                                  }
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
        return getNode(getNode(getNode(data.site.products).variants).inventory.byLocation);
    });
