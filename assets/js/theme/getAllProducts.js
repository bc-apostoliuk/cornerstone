export const getAllProducts = (locationId, token, mock) => {
    const request = fetch('/graphql', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query: `{
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
        site {
          products(first: 50) {
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
                variants {
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
.then((response) => response.json());  

    return !mock ? request : Promise.resolve({
        "data": {
          "inventory": {
            "locations": {
              "edges": [
                {
                  "node": {
                    "entityId": 1,
                    "code": "BC-LOCATION-1",
                    "description": "",
                    "label": "Default location",
                    "typeId": "PHYSICAL",
                    "address": {
                      "code": "BC-ADDRESS-1",
                      "address1": "Test street",
                      "city": "London",
                      "stateOrProvince": "AR",
                      "countryCode": "US",
                      "phone": "sae1213123",
                      "email": "asdas@fasd.com",
                      "latitude": null,
                      "longitude": null
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
                },
                {
                  "node": {
                    "entityId": 5,
                    "code": "123213213124124321",
                    "description": "",
                    "label": "Canada",
                    "typeId": "PHYSICAL",
                    "address": {
                      "code": "46ba6d19-6352-452b-ac81-bba609a64484",
                      "address1": "Ternopil, Shevchenka street",
                      "city": "Manitoba",
                      "stateOrProvince": "MB",
                      "countryCode": "CA",
                      "phone": "",
                      "email": "asdasd@mail.com",
                      "latitude": null,
                      "longitude": null
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
                },
                {
                  "node": {
                    "entityId": 6,
                    "code": "2423423432423",
                    "description": "",
                    "label": "Canada store",
                    "typeId": "PHYSICAL",
                    "address": {
                      "code": "ee0f798d-4593-474c-93b6-341689e46f64",
                      "address1": "Test address",
                      "city": "Nova Scotia",
                      "stateOrProvince": "NS",
                      "countryCode": "CA",
                      "phone": "",
                      "email": "asdasd@mail.com",
                      "latitude": null,
                      "longitude": null
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
                },
                {
                  "node": {
                    "entityId": 7,
                    "code": "12323512421",
                    "description": "",
                    "label": "Custom location",
                    "typeId": "PHYSICAL",
                    "address": {
                      "code": "8ae9beaf-83cf-4af7-a0be-df847fcd32f5",
                      "address1": "Custom address",
                      "city": "Kyiv",
                      "stateOrProvince": "asdasd",
                      "countryCode": "AL",
                      "phone": "",
                      "email": "ma@asda.com",
                      "latitude": null,
                      "longitude": null
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
          },
          "site": {
            "products": {
              "edges": [
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 77,
                    "name": "[Sample] Fog Linen Chambray Towel - Beige Stripe",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 1,
                            "sku": "SLCTBS-A9615491",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 2,
                            "sku": "SLCTBS-5596D19E",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 3,
                            "sku": "SLCTBS-08950B35",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 4,
                            "sku": "SLCTBS-7765C099",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 5,
                            "sku": "SLCTBS-FC402DAC",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 6,
                            "sku": "SLCTBS-4404031B",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 7,
                            "sku": "SLCTBS-EBD25EBB",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 8,
                            "sku": "SLCTBS-6C6855B4",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 9,
                            "sku": "SLCTBS-2C8FBF3C",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 10,
                            "sku": "SLCTBS-906CEB57",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 80,
                    "name": "[Sample] Orbit Terrarium - Large",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 64,
                            "sku": "OTL",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 81,
                    "name": "[Sample] Orbit Terrarium - Small",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 65,
                            "sku": "OTS",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 86,
                    "name": "[Sample] Able Brewing System",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 66,
                            "sku": "ABS",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 88,
                    "name": "[Sample] Chemex Coffeemaker 3 Cup",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 67,
                            "sku": "CC3C",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 93,
                    "name": "[Sample] 1 L Le Parfait Jar",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 46,
                            "sku": "SLLPJ-6088C959",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 47,
                            "sku": "SLLPJ-20D88EFC",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 48,
                            "sku": "SLLPJ-0BAF36BA",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 49,
                            "sku": "SLLPJ-CD28D4F0",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 50,
                            "sku": "SLLPJ-9A544946",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 51,
                            "sku": "SLLPJ-F2FD045F",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 52,
                            "sku": "SLLPJ-0138EE43",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 53,
                            "sku": "SLLPJ-D334BA28",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 54,
                            "sku": "SLLPJ-8650D0FD",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 55,
                            "sku": "SLLPJ-8D93E1C3",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 94,
                    "name": "[Sample] Oak Cheese Grater",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 68,
                            "sku": "OCG",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 15,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 97,
                    "name": "[Sample] Tiered Wire Basket",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 80,
                            "sku": "TWB-RE",
                            "inventory": null
                          }
                        },
                        {
                          "node": {
                            "entityId": 81,
                            "sku": "TWB-GR",
                            "inventory": {
                              "aggregated": {
                                "availableToSell": 15,
                                "warningLevel": 0
                              },
                              "byLocation": {
                                "edges": [
                                  {
                                    "node": {
                                      "locationEntityId": 1,
                                      "locationEntityCode": "BC-LOCATION-1",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 15,
                                      "warningLevel": 0,
                                      "isInStock": true
                                    }
                                  }
                                ]
                              }
                            }
                          }
                        },
                        {
                          "node": {
                            "entityId": 82,
                            "sku": "TWB-BL",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 98,
                    "name": "[Sample] Laundry Detergent",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 70,
                            "sku": "CGLD",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 103,
                    "name": "[Sample] Canvas Laundry Cart",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 71,
                            "sku": "CLC",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 0,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 104,
                    "name": "[Sample] Utility Caddy",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 83,
                            "sku": "OFSUC-RE",
                            "inventory": null
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 64,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 107,
                    "name": "[Sample] Dustpan & Brush",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 77,
                            "sku": "DPB-SM",
                            "inventory": {
                              "aggregated": {
                                "availableToSell": 29,
                                "warningLevel": 0
                              },
                              "byLocation": {
                                "edges": [
                                  {
                                    "node": {
                                      "locationEntityId": 1,
                                      "locationEntityCode": "BC-LOCATION-1",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 14,
                                      "warningLevel": 0,
                                      "isInStock": true
                                    }
                                  },
                                  {
                                    "node": {
                                      "locationEntityId": 5,
                                      "locationEntityCode": "123213213124124321",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 15,
                                      "warningLevel": 0,
                                      "isInStock": true
                                    }
                                  }
                                ]
                              }
                            }
                          }
                        },
                        {
                          "node": {
                            "entityId": 78,
                            "sku": "DPB-ME",
                            "inventory": {
                              "aggregated": {
                                "availableToSell": 10,
                                "warningLevel": 0
                              },
                              "byLocation": {
                                "edges": [
                                  {
                                    "node": {
                                      "locationEntityId": 1,
                                      "locationEntityCode": "BC-LOCATION-1",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 0,
                                      "warningLevel": 0,
                                      "isInStock": false
                                    }
                                  },
                                  {
                                    "node": {
                                      "locationEntityId": 5,
                                      "locationEntityCode": "123213213124124321",
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
                        },
                        {
                          "node": {
                            "entityId": 79,
                            "sku": "DPB-LA",
                            "inventory": {
                              "aggregated": {
                                "availableToSell": 25,
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
                                      "availableToSell": 15,
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
                },
                {
                  "node": {
                    "inventory": {
                      "hasVariantInventory": true,
                      "aggregated": {
                        "availableToSell": 55,
                        "warningLevel": 0
                      }
                    },
                    "entityId": 111,
                    "name": "[Sample] Smith Journal 13",
                    "variants": {
                      "edges": [
                        {
                          "node": {
                            "entityId": 74,
                            "sku": "SM13",
                            "inventory": {
                              "aggregated": {
                                "availableToSell": 55,
                                "warningLevel": 0
                              },
                              "byLocation": {
                                "edges": [
                                  {
                                    "node": {
                                      "locationEntityId": 1,
                                      "locationEntityCode": "BC-LOCATION-1",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 15,
                                      "warningLevel": 0,
                                      "isInStock": true
                                    }
                                  },
                                  {
                                    "node": {
                                      "locationEntityId": 5,
                                      "locationEntityCode": "123213213124124321",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 40,
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
                                  },
                                  {
                                    "node": {
                                      "locationEntityId": 7,
                                      "locationEntityCode": "12323512421",
                                      "locationEntityTypeId": "PHYSICAL",
                                      "availableToSell": 0,
                                      "warningLevel": 0,
                                      "isInStock": false
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
        }
      })
};


