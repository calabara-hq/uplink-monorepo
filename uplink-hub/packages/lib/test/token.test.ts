import { describe, expect, test, jest, afterEach, afterAll, beforeAll } from '@jest/globals';
import { TokenController } from '../src/token/index.js';
import { IToken } from '../dist';

const { computeUserTokenBalance, calculateBlockFromTimestamp } = new TokenController("EfYshASeuYUUeaL7K6EecREUaAJyU9Cz")//process.env.ALCHEMY_KEY);

describe('token utils test suite', () => {

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
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
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
            };
            const snapshot = '2023-05-20T12:30:00.000Z';
            const walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("1.997173691515419231");
        });

        test('erc721 balance check', async () => {
            const token: IToken = {
                type: 'ERC721',
                symbol: 'ERC721',
                decimals: 0,
                address: "0xDb6fd84921272E288998a4B321B6C187BBd2BA4C"
            };
            const snapshot = '2023-05-20T12:30:00.000Z';
            const walletAddress = '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1';
            const blockNum = await calculateBlockFromTimestamp(snapshot);
            const result = await computeUserTokenBalance({ token, blockNum, walletAddress });
            expect(result.toString()).toEqual("1");
        });

    })
});