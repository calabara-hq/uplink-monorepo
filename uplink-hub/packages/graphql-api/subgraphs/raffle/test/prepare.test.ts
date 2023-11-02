import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { InsertedTokenCache } from '../src/utils/insert'
import { djb2Hash, extractTokens, prepareRestrictions, prepareRewards, prepareVotingPolicy } from '../src/utils/prepare'
import { ContestSubmitterRestrictions, ContestSubmitterRewards, ContestVoterRewards, ContestVotingPolicy } from '../src/types/writeContest'
import { sampleERC1155Token, sampleERC20Token, sampleERC721Token, sampleETHToken } from './validation.test'

const ethHash = djb2Hash(JSON.stringify(sampleETHToken));
const erc20Hash = djb2Hash(JSON.stringify(sampleERC20Token));
const erc721Hash = djb2Hash(JSON.stringify(sampleERC721Token));
const erc1155Hash = djb2Hash(JSON.stringify(sampleERC1155Token));


describe("extractTokens", () => {
    test("all unique", () => {
        const submitterRewards: ContestSubmitterRewards = {
            "ETH": sampleETHToken,
            "ERC1155": sampleERC1155Token,
            payouts: []
        }
        const voterRewards: ContestVoterRewards = {
            "ERC20": sampleERC20Token,
            payouts: []
        };
        const submitterRestrictions: ContestSubmitterRestrictions = [{
            token: sampleERC721Token,
            threshold: "1"
        }];
        const votingPolicy: ContestVotingPolicy = [{
            token: sampleERC1155Token,
            strategy: {
                type: "arcade",
                votingPower: "1"
            }
        }];

        const result = extractTokens(submitterRewards, voterRewards, submitterRestrictions, votingPolicy);
        const vals = Object.values(result);
        assert.equal(vals.length, 4);
        assert.equal(vals.some(token => token === sampleETHToken), true);
        assert.equal(vals.some(token => token === sampleERC20Token), true);
        assert.equal(vals.some(token => token === sampleERC721Token), true);
        assert.equal(vals.some(token => token === sampleERC1155Token), true);
    })

    test("duplication", () => {
        const submitterRewards: ContestSubmitterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "ERC721": sampleERC721Token,
            "ERC1155": sampleERC1155Token,
            payouts: []
        }
        const voterRewards: ContestVoterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            payouts: []
        };
        const submitterRestrictions: ContestSubmitterRestrictions = [{
            token: sampleERC721Token,
            threshold: "1"
        }, {
            token: sampleETHToken,
            threshold: "1"
        }];
        const votingPolicy: ContestVotingPolicy = [{
            token: sampleERC1155Token,
            strategy: {
                type: "arcade",
                votingPower: "1"
            }
        },
        {
            token: sampleERC20Token,
            strategy: {
                type: "arcade",
                votingPower: "1"
            }
        }
        ];

        const result = extractTokens(submitterRewards, voterRewards, submitterRestrictions, votingPolicy);
        const vals = Object.values(result);
        assert.equal(vals.length, 4);
        assert.equal(vals.some(token => token === sampleETHToken), true);
        assert.equal(vals.some(token => token === sampleERC20Token), true);
        assert.equal(vals.some(token => token === sampleERC721Token), true);
        assert.equal(vals.some(token => token === sampleERC1155Token), true);
    })

    test("all empty", () => {
        const submitterRewards: ContestSubmitterRewards = {}
        const voterRewards: ContestVoterRewards = {};
        const submitterRestrictions: ContestSubmitterRestrictions = [];
        const votingPolicy: ContestVotingPolicy = [];

        const result = extractTokens(submitterRewards, voterRewards, submitterRestrictions, votingPolicy);
        const vals = Object.values(result);
        assert.equal(vals.length, 0);
    })
})

describe("prepare submitter rewards", () => {
    test("successfully prepare rewards", () => {
        const submitterRewards: ContestSubmitterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "ERC721": sampleERC721Token,
            "ERC1155": sampleERC1155Token,
            payouts: [{
                rank: 1,
                "ETH": {
                    amount: "1"
                },
                "ERC20": {
                    amount: "1"
                },
            }, {
                rank: 2,
                "ERC721": {
                    tokenId: 1
                },
                "ERC1155": {
                    amount: "1"
                },
            }, {
                rank: 3,
                "ETH": {
                    amount: "1"
                }
            }]
        }

        const insertedTokenCache: InsertedTokenCache = {
            [ethHash]: { dbTokenId: 1 },
            [erc20Hash]: { dbTokenId: 2 },
            [erc721Hash]: { dbTokenId: 3 },
            [erc1155Hash]: { dbTokenId: 4 }
        }

        const result = prepareRewards(submitterRewards, insertedTokenCache);
        assert.deepEqual(result, [{
            rank: 1,
            tokenLink: 1,
            value: { amount: "1" }
        }, {
            rank: 1,
            tokenLink: 2,
            value: { amount: "1" }
        }, {
            rank: 2,
            tokenLink: 3,
            value: { tokenId: 1 }
        }, {
            rank: 2,
            tokenLink: 4,
            value: { amount: "1" }
        }, {
            rank: 3,
            tokenLink: 1,
            value: { amount: "1" }
        }])
    })
})


describe("prepare restrictions", () => {
    test("successfully prepare restrictions", () => {
        const restrictions: ContestSubmitterRestrictions = [{
            token: sampleERC721Token,
            threshold: "1"
        }, {
            token: sampleETHToken,
            threshold: "1"
        }];

        const insertedTokenCache: InsertedTokenCache = {
            [ethHash]: { dbTokenId: 1 },
            [erc721Hash]: { dbTokenId: 2 },
        }

        const result = prepareRestrictions(restrictions, insertedTokenCache);
        assert.deepEqual(result, [{
            tokenLink: 2,
            threshold: "1"
        }, {
            tokenLink: 1,
            threshold: "1"
        }])
    })
})

describe("prepare voting policy", () => {
    test("successfully prepare voting policy", () => {
        const policy: ContestVotingPolicy = [{
            token: sampleERC1155Token,
            strategy: {
                type: "arcade",
                votingPower: "1"
            }
        },
        {
            token: sampleERC20Token,
            strategy: {
                type: "weighted",
            }
        }
        ];

        const insertedTokenCache: InsertedTokenCache = {
            [erc20Hash]: { dbTokenId: 1 },
            [erc1155Hash]: { dbTokenId: 2 },
        }

        const result = prepareVotingPolicy(policy, insertedTokenCache);
        assert.deepEqual(result, [{
            tokenLink: 2,
            strategy: {
                type: "arcade",
                votingPower: "1"
            }
        }, {
            tokenLink: 1,
            strategy: {
                type: "weighted",
            }
        }])
    })
})