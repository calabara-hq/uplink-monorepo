import { supportedChains } from "../chains/supportedChains";

export const ZoraAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "defaultAdmin",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "editionSize",
                "type": "uint64"
            },
            {
                "internalType": "uint16",
                "name": "royaltyBPS",
                "type": "uint16"
            },
            {
                "internalType": "address payable",
                "name": "fundsRecipient",
                "type": "address"
            },
            {
                "internalType": "bytes[]",
                "name": "setupCalls",
                "type": "bytes[]"
            },
            {
                "internalType": "contract IMetadataRenderer",
                "name": "metadataRenderer",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "metadataInitializer",
                "type": "bytes"
            },
            {
                "internalType": "address",
                "name": "createReferral",
                "type": "address"
            }
        ],
        "name": "createAndConfigureDrop",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "newDropAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "defaultAdmin",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "editionSize",
                "type": "uint64"
            },
            {
                "internalType": "uint16",
                "name": "royaltyBPS",
                "type": "uint16"
            },
            {
                "internalType": "address payable",
                "name": "fundsRecipient",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint104",
                        "name": "publicSalePrice",
                        "type": "uint104"
                    },
                    {
                        "internalType": "uint32",
                        "name": "maxSalePurchasePerAddress",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "presaleMerkleRoot",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IERC721Drop.SalesConfiguration",
                "name": "saleConfig",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "metadataURIBase",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "metadataContractURI",
                "type": "string"
            }
        ],
        "name": "createDrop",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "defaultAdmin",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "editionSize",
                "type": "uint64"
            },
            {
                "internalType": "uint16",
                "name": "royaltyBPS",
                "type": "uint16"
            },
            {
                "internalType": "address payable",
                "name": "fundsRecipient",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint104",
                        "name": "publicSalePrice",
                        "type": "uint104"
                    },
                    {
                        "internalType": "uint32",
                        "name": "maxSalePurchasePerAddress",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "presaleMerkleRoot",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IERC721Drop.SalesConfiguration",
                "name": "saleConfig",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "metadataURIBase",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "metadataContractURI",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "createReferral",
                "type": "address"
            }
        ],
        "name": "createDropWithReferral",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint64",
                "name": "editionSize",
                "type": "uint64"
            },
            {
                "internalType": "uint16",
                "name": "royaltyBPS",
                "type": "uint16"
            },
            {
                "internalType": "address payable",
                "name": "fundsRecipient",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "defaultAdmin",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint104",
                        "name": "publicSalePrice",
                        "type": "uint104"
                    },
                    {
                        "internalType": "uint32",
                        "name": "maxSalePurchasePerAddress",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "presaleMerkleRoot",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IERC721Drop.SalesConfiguration",
                "name": "saleConfig",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "animationURI",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageURI",
                "type": "string"
            }
        ],
        "name": "createEdition",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint64",
                "name": "editionSize",
                "type": "uint64"
            },
            {
                "internalType": "uint16",
                "name": "royaltyBPS",
                "type": "uint16"
            },
            {
                "internalType": "address payable",
                "name": "fundsRecipient",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "defaultAdmin",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint104",
                        "name": "publicSalePrice",
                        "type": "uint104"
                    },
                    {
                        "internalType": "uint32",
                        "name": "maxSalePurchasePerAddress",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "publicSaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleStart",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "presaleEnd",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "presaleMerkleRoot",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IERC721Drop.SalesConfiguration",
                "name": "saleConfig",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "animationURI",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageURI",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "createReferral",
                "type": "address"
            }
        ],
        "name": "createEditionWithReferral",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "comment",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "mintReferral",
                "type": "address"
            }
        ],
        "name": "mintWithRewards",
        "outputs":
            [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const


// creator mainnet
const ZORA_NFT_CREATOR_PROXY_MAINNET = '0xf74b146ce44cc162b601dec3be331784db111dc1'
const ZORA_NFT_CREATOR_PROXY_BASE = '0x58C3ccB2dcb9384E5AB9111CD1a5DEA916B0f33c'
const ZORA_NFT_CREATOR_PROXY_OP = '0x7d1a46c6e614A0091c39E102F2798C27c1fA8892'
const ZORA_NFT_CREATOR_PROXY_ZORA = '0xA2c2A96A232113Dd4993E8b048EEbc3371AE8d85'

// rewards mainnet
const ZORA_PROTOCOL_REWARDS_MAINNET = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'
const ZORA_PROTOCOL_REWARDS_BASE = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'
const ZORA_PROTOCOL_REWARDS_OP = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'
const ZORA_PROTOCOL_REWARDS_ZORA = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'

// creator testnet
const ZORA_NFT_CREATOR_PROXY_BASE_TESTNET = '0x87cfd516c5ea86e50b950678CA970a8a28de27ac'
const ZORA_NFT_CREATOR_PROXY_OP_TESTNET = '0x3C1ebcF36Ca9DD9371c9aA99c274e4988906c6E3'
const ZORA_NFT_CREATOR_PROXY_ZORA_TESTNET = '0xeB29A4e5b84fef428c072debA2444e93c080CE87'

// rewards testnet
const ZORA_PROTOCOL_REWARDS_BASE_TESTNET = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'
const ZORA_PROTOCOL_REWARDS_OP_TESTNET = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'
const ZORA_PROTOCOL_REWARDS_ZORA_TESTNET = '0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B'

export const getContractFromChainId = (chainId: number) => {
    if (!supportedChains.map(chain => chain.id).includes(chainId)) throw new Error("Chain not supported");

    switch (chainId) {
        case 1:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_MAINNET,
                rewards_contract: ZORA_PROTOCOL_REWARDS_MAINNET,
                explorer: "https://etherscan.io",
                bridge: "https://app.uniswap.org/swap",
                chainId: 1,
            }
        case 8453:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_BASE,
                rewards_contract: ZORA_PROTOCOL_REWARDS_BASE,
                explorer: "https://basescan.org",
                bridge: "https://bridge.base.org/deposit",
                chainId: 8453,
            }
        case 10:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_OP,
                rewards_contract: ZORA_PROTOCOL_REWARDS_OP,
                explorer: "https://optimistic.etherscan.io",
                bridge: "https://app.optimism.io/bridge/deposit",
                chainId: 10,
            }
        case 7777777:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_ZORA,
                rewards_contract: ZORA_PROTOCOL_REWARDS_ZORA,
                explorer: "https://explorer.zora.energy",
                bridge: "https://bridge.zora.energy/",
                chainId: 7777777,
            }
        case 84531:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_BASE_TESTNET,
                rewards_contract: ZORA_PROTOCOL_REWARDS_BASE_TESTNET,
                explorer: "https://goerli.basescan.org",
                bridge: "https://goerli-bridge.base.org/deposit",
                chainId: 84531,
            }
        case 420:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_OP_TESTNET,
                rewards_contract: ZORA_PROTOCOL_REWARDS_OP_TESTNET,
                explorer: "https://goerli-optimism.etherscan.io",
                bridge: "https://app.optimism.io/bridge/deposit",
                chainId: 420,
            }
        case 999:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_ZORA_TESTNET,
                rewards_contract: ZORA_PROTOCOL_REWARDS_ZORA_TESTNET,
                explorer: "https://testnet.explorer.zora.energy",
                bridge: "https://testnet.bridge.zora.energy",
                chainId: 999,
            }
        default:
            return {
                creator_contract: ZORA_NFT_CREATOR_PROXY_MAINNET,
                rewards_contract: ZORA_PROTOCOL_REWARDS_MAINNET,
                explorer: "https://etherscan.io",
                bridge: "https://app.uniswap.org/swap",
                chainId: 1,
            }
    }
}