[{
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this NFT represents"
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this NFT represents"
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
        }
    }
}]
[
    {
        "program": {
          "uuid": "C7Xvge",
          "config": "C7XvgezXZTeSBX4N8aQPymf4GLDGDTVG5JoUVpmEKWLx"
        },
        "items": {
          "0": {
            "link": "https://arweave.net/QN009FCQt3lcgVOIAhr49QhWdAcs5BZPU4n47A6_rq8",
            "name": "Test #00",
            "onChain": true
          },
          "1": {
            "link": "https://arweave.net/sUTj9idBQkhh2DuWlp_07th95JyJ4hrywOltwMGb1LY",
            "name": "Test #01",
            "onChain": true
          },
          "2": {
            "link": "https://arweave.net/bu6nBPzPSygQYUw4myQo-0AH37suaIpVvuMpQnHEWgE",
            "name": "Test #02",
            "onChain": true
          },
          "3": {
            "link": "https://arweave.net/tHwNadXtWwrt1JOvmHLE7YHmuUl9Pa3AKNwoiEe8XbU",
            "name": "Test #03",
            "onChain": true
          }
        },
        "env": "devnet",
        "cacheName": "temp",
        "authority": "7S5G4WUJX49gDTt2RjsodoDTNSDt63fdHkvx2geF1VBw"
      }
]
[
    {
        "name": "Test #00",
        "symbol": "TEST",
        "description": "Congratulations, you got the test!",
        "seller_fee_basis_points": 500,
        "image": "https://uzkgw3nvnmirvqj7fv44yghghansvoilbrdbds4yr3rkvo6lit4a.arweave.net/plRrbbVrERrBPy15zBjmOBsquQsMRhHLmI7iqrvLRPg?ext=png",
        "external_url": "https://www.thugbirdz.com/",
        "collection": {
        "name": "Test Drop",
        "family": "Test Drop Family"
        },
        "properties": {
        "files": [
        {
        "uri": "https://uzkgw3nvnmirvqj7fv44yghghansvoilbrdbds4yr3rkvo6lit4a.arweave.net/plRrbbVrERrBPy15zBjmOBsquQsMRhHLmI7iqrvLRPg?ext=png",
        "type": "image/png"
        }
        ],
        "category": "image",
        "creators": [
        {
        "address": "EfwGaw4kLBYhyuGjx9GzuzG5zycdiFFVnb6q3ecFrkMD",
        "share": 100
        }
        ]
        }
        }
]
[
    {
        "title": "Token Metadata",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Identifies the asset to which this token represents"
            },
            "decimals": {
                "type": "integer",
                "description": "The number of decimal places that the token amount should display - e.g. 18, means to divide the token amount by 1000000000000000000 to get its user representation."
            },
            "description": {
                "type": "string",
                "description": "Describes the asset to which this token represents"
            },
            "image": {
                "type": "string",
                "description": "A URI pointing to a resource with mime type image/* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
            },
            "properties": {
                "type": "object",
                "description": "Arbitrary properties. Values may be strings, numbers, object or arrays."
            }
        }
    }
]
[
    {
        "name": "Asset Name",
        "description": "Lorem ipsum...",
        "image": "https:\/\/s3.amazonaws.com\/your-bucket\/images\/{id}.png",
        "properties": {
            "simple_property": "example value",
            "rich_property": {
                "name": "Name",
                "value": "123",
                "display_value": "123 Example Value",
                "class": "emphasis",
                "css": {
                    "color": "#ffffff",
                    "font-weight": "bold",
                    "text-decoration": "underline"
                }
            },
            "array_property": {
                "name": "Name",
                "value": [1,2,3,4],
                "class": "emphasis"
            }
        }
    }
]
[
    {
        "title": "Token Metadata",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Identifies the asset to which this token represents",
            },
            "decimals": {
                "type": "integer",
                "description": "The number of decimal places that the token amount should display - e.g. 18, means to divide the token amount by 1000000000000000000 to get its user representation."
            },
            "description": {
                "type": "string",
                "description": "Describes the asset to which this token represents"
            },
            "image": {
                "type": "string",
                "description": "A URI pointing to a resource with mime type image/* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
            },
            "properties": {
                "type": "object",
                "description": "Arbitrary properties. Values may be strings, numbers, object or arrays.",
            },
            "localization": {
                "type": "object",
                "required": ["uri", "default", "locales"],
                "properties": {
                    "uri": {
                        "type": "string",
                        "description": "The URI pattern to fetch localized data from. This URI should contain the substring `{locale}` which will be replaced with the appropriate locale value before sending the request."
                    },
                    "default": {
                        "type": "string",
                        "description": "The locale of the default data within the base JSON"
                    },
                    "locales": {
                        "type": "array",
                        "description": "The list of locales for which data is available. These locales should conform to those defined in the Unicode Common Locale Data Repository (http://cldr.unicode.org/)."
                    }
                }
            }
        }
    }
]
[
    {
        "name": "Advertising Space",
        "description": "Each token represents a unique Ad space in the city.",
        "localization": {
          "uri": "ipfs://QmWS1VAdMD353A6SDk9wNyvkT14kyCiZrNDYAad4w1tKqT/{locale}.json",
          "default": "en",
          "locales": ["en", "es", "fr"]
        }
      }
]
[
    {
        "name": "Espacio Publicitario",
        "description": "Cada token representa un espacio publicitario único en la ciudad."
      }
]