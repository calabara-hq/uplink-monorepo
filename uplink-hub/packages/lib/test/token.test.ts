import { describe, expect, test, jest, afterEach, afterAll, beforeAll } from '@jest/globals';
import { TokenController } from '../src/token/index.js';
import { IToken } from '../dist/index.js';
import { Decimal } from 'decimal.js'


describe('mainnet token utils test suite', () => {

    const { verifyTokenStandard, isValidERC1155TokenId, tokenGetSymbolAndDecimal, computeUserTokenBalance, calculateBlockFromTimestamp, validateEthAddress, validateERC20, validateInterface } = new TokenController(process.env.ALCHEMY_KEY!, 1);



    describe('validate eth address', () => {
        test('empty address', async () => {
            const result = await validateEthAddress('');
            expect(result).toEqual(null)
        })

        test('valid ens', async () => {
            const result = await validateEthAddress('nickdodson.eth')
            expect(result).toEqual('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C')
        })
        test('valid hex addr', async () => {
            const result = await validateEthAddress('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C')
            expect(result).toEqual('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C')
        })
        test('invalid hex addr', async () => {
            const result = await validateEthAddress('0xedcC867bc8B5FEBd0459af17a6f134F41f422f')
            expect(result).toEqual(null)
        })
        test('invalid ens addr', async () => {
            const result = await validateEthAddress('nickdodasdfasdfasdfasdfasdfason.eth')
            expect(result).toEqual(null)
        })
    })

    describe('validateERC20', () => {
        test('valid erc20', async () => {
            const result = await validateERC20('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
            expect(result).toEqual(true)
        })
        test('invalid when erc721', async () => {
            const result = await validateERC20('0xDb6fd84921272E288998a4B321B6C187BBd2BA4C')
            expect(result).toEqual(false)
        })
    })

    describe('validate token standard', () => {
        test('erc20', async () => {
            const result = await verifyTokenStandard({ contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', expectedStandard: 'ERC20' })
            expect(result).toEqual(true)
        })
        test('erc721', async () => {
            const result = await verifyTokenStandard({ contractAddress: '0xDb6fd84921272E288998a4B321B6C187BBd2BA4C', expectedStandard: 'ERC721' })
            expect(result).toEqual(true)
        })
        test('erc1155', async () => {
            const result = await verifyTokenStandard({ contractAddress: '0xB48176c8779559f01eff37834fa563be997aE5e6', expectedStandard: 'ERC1155' })
            expect(result).toEqual(true)
        })
    })

    describe('token get symbol / decimal', () => {
        test('erc20', async () => {
            const result = await tokenGetSymbolAndDecimal({ contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', tokenStandard: "ERC20" })
            expect(result).toEqual({ symbol: 'USDC', decimals: 6 })
        })
    })

    describe('is valid 1155 token id', () => {
        test('should pass', async () => {
            const result = await isValidERC1155TokenId({ contractAddress: '0xB48176c8779559f01eff37834fa563be997aE5e6', tokenId: 139 })
            expect(result).toBe(true)
        })
        test('should fail', async () => {
            const result = await isValidERC1155TokenId({ contractAddress: '0xB48176c8779559f01eff37834fa563be997aE5e6', tokenId: 9999 })
            expect(result).toBe(false)
        })
    })


    describe('blockFromTimestamp', () => {
        test('blockFromTimestamp', async () => {
            const result = await calculateBlockFromTimestamp('2023-09-15T21:28:11.220Z')
            expect(result).toEqual(18144272);
        });
    });

    describe('computeUserTokenBalance', () => {
        test('usdc 0 balance before snapshot', async () => {
            const token: IToken = {
                type: 'ERC20',
                symbol: 'USDC',
                decimals: 6,
                chainId: 1,
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                tokenId: null
            };
            const snapshot = '2022-09-28T12:30:00.000Z';
            const walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("0");
        });

        test('usdc non-zero balance after snapshot', async () => {
            const token: IToken = {
                type: 'ERC20',
                symbol: 'USDC',
                decimals: 6,
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                chainId: 1,
                tokenId: null
            };
            const snapshot = '2022-09-29T12:30:00.000Z';
            const walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("67.274366");
        });

        test('erc1155 balance check', async () => {
            const token: IToken = {
                type: 'ERC1155',
                symbol: '1155',
                decimals: 0,
                address: '0xB48176c8779559f01eff37834fa563be997aE5e6',
                chainId: 1,
                tokenId: 139
            };
            const snapshot = '2023-04-29T12:30:00.000Z';
            const walletAddress = '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("1");
        });

        test('eth balance check', async () => {
            const token: IToken = {
                type: 'ETH',
                symbol: 'ETH',
                decimals: 18,
                chainId: 1,
            };
            const snapshot = '2023-05-20T12:30:00.000Z';
            const walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("1.997173691515419231");
        });

        test('small balance eth check', async () => {
            const token: IToken = {
                type: 'ETH',
                symbol: 'ETH',
                decimals: 18,
                chainId: 1,
            };
            const snapshot = '2023-10-20T12:30:00.000Z';
            const walletAddress = '0x6CBb301352F850E2E1af4466bF28c7d10C3c48BB';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.greaterThan(new Decimal(0)))
        });

        test('erc721 balance check', async () => {
            const token: IToken = {
                type: 'ERC721',
                symbol: 'ERC721',
                decimals: 0,
                address: "0xDb6fd84921272E288998a4B321B6C187BBd2BA4C",
                tokenId: null,
                chainId: 1,
            };
            const snapshot = '2023-05-20T12:30:00.000Z';
            const walletAddress = '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("1");
        });

        test('nouns delegate balance check', async () => {
            const token: IToken = {
                type: 'ERC721',
                symbol: 'NOUNS',
                decimals: 0,
                address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
                tokenId: null,
                chainId: 1,
            };
            const snapshot = '2023-05-20T12:30:00.000Z';
            const walletAddress = '0xcC2688350d29623E2A0844Cc8885F9050F0f6Ed5'; // nouncil
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("7");
        });

        test('nouns delegate balance check dont revert', async () => {
            const token: IToken = {
                type: 'ERC721',
                symbol: 'NOUNS',
                decimals: 0,
                address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
                tokenId: null,
                chainId: 1,
            };
            const snapshot = new Date().toISOString();
            const walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("0");
        });
    })
});


describe('base token utils test suite', () => {
    const { computeUserTokenBalance, calculateBlockFromTimestamp } = new TokenController(process.env.ALCHEMY_KEY!, 8453);
    const walletAddress = "0xBd7Dbab9AEb52D6c8d0E80fCeBdE3af4CC86204A"

    test('blockFromTimestamp', async () => {
        const result = await calculateBlockFromTimestamp('2023-10-28T12:30:00.000Z')
        expect(result).toEqual(5853427);
    });

    test('eth balance check', async () => {
        const token: IToken = {
            type: 'ETH',
            symbol: 'ETH',
            decimals: 18,
            chainId: 8453,
        };
        const snapshot = '2023-10-28T12:30:00.000Z';
        const blockNum = await calculateBlockFromTimestamp(snapshot);
        const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
        expect(result.toString()).toEqual("0.248843925109580795");
    });

    test('erc721 balance check', async () => {
        const token: IToken = {
            type: 'ERC721',
            address: '0xb78b89eb81303a11cc597b4519035079453d8e31',
            symbol: 'MGMT',
            decimals: 0,
            tokenId: 0,
            chainId: 8453,
        }
        const snapshot = '2023-10-28T12:30:00.000Z';
        const blockNum = await calculateBlockFromTimestamp(snapshot);
        const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
        expect(result.toString()).toEqual('1')
    });

    test('weez erc721 balance check', async () => {
        const token: IToken = {
            type: 'ERC721',
            address: '0xAde73a09Dd3B57d30436C6c4bF309bb455961b1C',
            symbol: '$WFT',
            decimals: 0,
            tokenId: null,
            chainId: 8453,
        }
        const walletAddress = '0x02d1b331C8Ab3dDdC27Ef4EE891F264e5e3a4435'
        const snapshot = '2023-11-07T21:29:26.591Z';
        const blockNum = await calculateBlockFromTimestamp(snapshot);
        const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
        expect(result.toString()).toEqual('1')

    })

    test('erc1155 balance check', async () => {
        const token: IToken = {
            type: 'ERC1155',
            address: '0x32CfF5C2A7233097Efe3e8Dc708D1Df141780D69',
            symbol: 'BINT',
            decimals: 0,
            tokenId: 3,
            chainId: 8453,
        }
        const snapshot = '2023-10-28T12:30:00.000Z';
        const blockNum = await calculateBlockFromTimestamp(snapshot);
        const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
        expect(result.toString()).toEqual('1')
    });

});

describe('zora total mints base', () => {

    const { zora721TotalSupply } = new TokenController(process.env.ALCHEMY_KEY!, 8453);

    test('fetch total mints for a base drop', async () => {
        const supply = await zora721TotalSupply({ contractAddress: '0xdebc81933a4121e3de5a761e12074f1ee0d6024e' })
        expect(supply).toBe("6")
    })

});
