import { describe, expect, test, jest, afterEach, afterAll } from '@jest/globals';
import { computeUserTokenBalance } from '../src/token/index.js';
import { IToken } from '../dist';


describe('token utils test suite', () => {
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
            const result = await computeUserTokenBalance({ token, snapshot, walletAddress });
            expect(result).toEqual(0);
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
            const result = await computeUserTokenBalance({ token, snapshot, walletAddress });
            expect(result).toEqual(67.274366);
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
            const result = await computeUserTokenBalance({ token, snapshot, walletAddress });
            expect(result).toEqual(1);
        });

        test('eth balance check', async () => {
            const token: IToken = {
                type: 'ETH',
                symbol: 'ETH',
                decimals: 18,
            };
            const snapshot = '2023-05-20T12:30:00.000Z';
            const walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C';
            const result = await computeUserTokenBalance({ token, snapshot, walletAddress });
            expect(result).toEqual(1.9971736915154192);
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
            const result = await computeUserTokenBalance({ token, snapshot, walletAddress });
            expect(result).toEqual(1);
        });

    })
});