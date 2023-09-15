import { describe, expect, test } from "@jest/globals";
import { sampleERC1155Token, sampleERC20Token, sampleERC721Token, sampleETHToken } from "./sampleTokens";
import { Prompt, SubmitterRewards, VoterRewards, VotingPolicyType, validateDeadlines, validateMetadata, validatePrompt, validateSubmitterRewards, validateVoterRewards, validateVotingPolicy } from "@/ui/ContestForm/contestHandler";



describe("Contest Handler", () => {
    describe("Validate Contest Metadata", () => {
        test("fail with null values", () => {
            const { isError, errors, data } = validateMetadata({ type: null, category: null })
            expect(isError).toBe(true)
            expect(errors).toEqual({
                type: "Please select a contest type",
                category: "Please select a contest category",
            })
        })

        test("pass with valid inputs", () => {
            const { isError, errors, data } = validateMetadata({
                type: "standard",
                category: "art",
            })
            expect(isError).toBe(false)
            expect(errors).toEqual({
                type: "",
                category: "",
            })
            expect(data).toEqual({
                type: "standard",
                category: "art",
            })
        })
    });

    describe("Validate Contest Deadlines", () => {
        test("fail with empty string values", () => {
            const deadlines = {
                startTime: "",
                voteTime: "",
                endTime: "",
                snapshot: "",
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)

            expect(isError).toBe(true)
            expect(errors).toEqual({
                snapshot: "snapshot date is required",
                startTime: "start date is required",
                voteTime: "vote date is required",
                endTime: "end date is required",
            })
            expect(data).toEqual(deadlines)
        })

        test("fail with incorrect order #1", () => {
            const deadlines = {
                startTime: new Date(Date.now() + 5 * 864e5).toISOString(),
                voteTime: new Date(Date.now() + 4 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 3 * 864e5).toISOString(),
                snapshot: new Date(Date.now() + 6 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)

            expect(isError).toBe(true)
            expect(errors).toEqual({
                snapshot: "snapshot date must be less than or equal to start date",
                voteTime: "vote date must be after start date",
                endTime: "end date must be after start date",
                startTime: "",
            })
            expect(data).toEqual(deadlines)
        })

        test("fail with incorrect order #2", () => {
            const deadlines = {
                snapshot: new Date(Date.now() + 1 * 864e5).toISOString(),
                startTime: new Date(Date.now() + 2 * 864e5).toISOString(),
                voteTime: new Date(Date.now() + 4 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 3 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)

            expect(isError).toBe(true)
            expect(errors).toEqual({
                snapshot: "",
                voteTime: "",
                endTime: "end date must be after vote date",
                startTime: "",
            })
            expect(data).toEqual(deadlines)
        })

        test("pass with correct order", () => {
            const deadlines = {
                snapshot: new Date(Date.now() + 1 * 864e5).toISOString(),
                startTime: new Date(Date.now() + 2 * 864e5).toISOString(),
                voteTime: new Date(Date.now() + 3 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)
            expect(isError).toBe(false)
            expect(errors).toEqual({
                snapshot: "",
                startTime: "",
                voteTime: "",
                endTime: "",

            })
            expect(data).toEqual(deadlines)
        });

        test("pass with now for snapshot", () => {
            const deadlines = {
                snapshot: "now",
                startTime: new Date(Date.now() + 2 * 864e5).toISOString(),
                voteTime: new Date(Date.now() + 3 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)
            expect(isError).toBe(false)
            expect(errors).toEqual({
                snapshot: "",
                startTime: "",
                voteTime: "",
                endTime: "",

            })
            expect(data).toEqual(deadlines)
        })
        test("pass with now for startTime", () => {
            const deadlines = {
                snapshot: new Date(Date.now()).toISOString(),
                startTime: "now",
                voteTime: new Date(Date.now() + 3 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)
            expect(isError).toBe(false)
            expect(errors).toEqual({
                snapshot: "",
                startTime: "",
                voteTime: "",
                endTime: "",

            })
            expect(data).toEqual(deadlines)
        })

        test("pass with now for startTime + snapshot", () => {
            const deadlines = {
                snapshot: "now",
                startTime: "now",
                voteTime: new Date(Date.now() + 3 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, false)
            expect(isError).toBe(false)
            expect(errors).toEqual({
                snapshot: "",
                startTime: "",
                voteTime: "",
                endTime: "",

            })
            expect(data).toEqual(deadlines)
        })

        test("return cleaned data", () => {
            const deadlines = {
                snapshot: "now",
                startTime: "now",
                voteTime: new Date(Date.now() + 3 * 864e5).toISOString(),
                endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
            }
            const { isError, errors, data } = validateDeadlines(deadlines, true)
            expect(isError).toBe(false)
            expect(errors).toEqual({
                snapshot: "",
                startTime: "",
                voteTime: "",
                endTime: "",

            })
            expect(data.voteTime).toEqual(deadlines.voteTime)
            expect(data.endTime).toEqual(deadlines.endTime)
            expect(data.snapshot.length).toBeGreaterThan(3) // check that it is not "now" anymore
            expect(data.startTime.length).toBeGreaterThan(3) // check that it is not "now" anymore
        })
    })


    describe("Validate Contest Prompt", () => {

        test("fail with invalid values", () => {
            const prompt: Prompt = {
                title: "",
                body: null,
                coverUrl: "https://google.com/image.png",
                coverBlob: "asdf"
            }
            const { isError, errors, data } = validatePrompt(prompt)

            expect(isError).toBe(true)
            expect(errors).toEqual({
                title: "Please provide a title",
                body: "Please provide a prompt body",
                coverUrl: "Invalid cover image",
            })
            expect(data).toEqual(prompt)
        })


        test("fail with ", () => {
            const prompt: Prompt = {
                title: "",
                body: null,
                coverUrl: "",
                coverBlob: ""
            }
            const { isError, errors, data } = validatePrompt(prompt)

            expect(isError).toBe(true)
            expect(errors).toEqual({
                title: "Please provide a title",
                body: "Please provide a prompt body",
                coverUrl: "",
            })
            expect(data).toEqual(prompt)
        })

        test("fail with empty blocks", () => {
            const prompt: Prompt = {
                title: " aaaaaa ",
                body: {
                    blocks: []
                },
                coverUrl: "",
                coverBlob: ""
            }
            const { isError, errors, data } = validatePrompt(prompt)

            expect(isError).toBe(true)
            expect(errors).toEqual({
                title: "",
                body: "Please provide a prompt body",
                coverUrl: "",
            })
            expect(data).toEqual(prompt)
        })

        test("pass with valid inputs", () => {
            const prompt = {
                title: " aaaaaa ",
                body: {
                    blocks: [{
                        type: "paragraph",
                        data: {
                            text: "test"
                        }
                    }]
                },
                coverUrl: "https://uplink.mypinata.cloud/ipfs/QmZ1Z2Z3Z4Z5Z6Z7Z8Z9Z0",
                coverBlob: "asdf"
            }
            const { isError, errors, data } = validatePrompt(prompt)

            expect(isError).toBe(false)
            expect(errors).toEqual({
                title: "",
                body: "",
                coverUrl: "",
            })
            expect(data).toEqual(prompt)
        })
    });


    // remember that this function is also cleaning the data (for now)
    describe("Validate Submitter Rewards", () => {

        test("fail with duplicate ranks", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                    {
                        rank: 2,
                        ETH: { amount: '1' },
                    },
                ],
            };

            const { isError, errors, data } = validateSubmitterRewards(rewards);
            expect(isError).toBe(true);
            expect(errors).toEqual({
                duplicateRanks: [1]
            });
            expect(data).toEqual(rewards);

        })
        test("pass with empty rewards", () => {
            const rewards: SubmitterRewards = {};

            const { isError, errors, data } = validateSubmitterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual(rewards);

        })
        test("pass with valid rewards", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                        ERC20: { amount: '1' },
                        ERC721: { tokenId: 1 },
                        ERC1155: { amount: '2' },
                    },
                    {
                        rank: 2,
                        ETH: { amount: '1' },
                        ERC20: { amount: '1' },
                        ERC721: { tokenId: 1 },
                        ERC1155: { amount: '2' },
                    },
                ],
            };

            const { isError, errors, data } = validateSubmitterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual(rewards);

        })
        test("clean empty rewards #1", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                        ERC20: { amount: '1' },
                        ERC721: { tokenId: 1 },
                    },
                    {
                        rank: 2,
                        ETH: { amount: '1' },
                        ERC20: { amount: '1' },
                        ERC721: { tokenId: 1 },
                    },
                ],
            };

            const { isError, errors, data } = validateSubmitterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual({ ...rewards, ERC1155: undefined });
        })

        test("clean empty rewards #2", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                        ERC20: { amount: '1' },
                        ERC721: { tokenId: null },
                    },
                    {
                        rank: 2,
                        ETH: { amount: '1' },
                        ERC20: { amount: '' },
                        ERC721: { tokenId: null },
                    },
                ],
            };

            const { isError, errors, data } = validateSubmitterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual({
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                        ERC20: { amount: '1' },
                    },
                    {
                        rank: 2,
                        ETH: { amount: '1' },
                    },
                ]
            });
        })

        test("clean empty rewards #3", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '' },
                        ERC20: { amount: '' },
                        ERC721: { tokenId: null },
                    },
                    {
                        rank: 2,
                        ETH: { amount: '' },
                        ERC20: { amount: '' },
                        ERC721: { tokenId: null },
                    },
                ],
            };

            const { isError, errors, data } = validateSubmitterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual({});
        })
    })



    describe("Validate Voter Rewards", () => {
        test("fail with duplicate ranks", () => {
            const rewards: VoterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                ]
            }
            const { errors, isError, data } = validateVoterRewards(rewards);
            expect(isError).toBe(true);
            expect(errors).toEqual({
                duplicateRanks: [1]
            });
            expect(data).toEqual(rewards);
        });

        test("pass with empty rewards", () => {
            const rewards: VoterRewards = {};
            const { errors, isError, data } = validateVoterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual(rewards);
        });

        test("pass with valid rewards", () => {
            const rewards: VoterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                    {
                        rank: 2,
                        ERC20: { amount: '30' },
                    }
                ]
            }

            const { errors, isError, data } = validateVoterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual(rewards);
        });

        test("clean empty rewards #1", () => {
            const rewards: VoterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                    {
                        rank: 2,
                        ERC20: { amount: '' },
                    }

                ]
            }
            const { errors, isError, data } = validateVoterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual({
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                    },
                ]
            });
        });

        test("clean empty rewards #2", () => {
            const rewards: VoterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '' },
                    },
                    {
                        rank: 2,
                        ERC20: { amount: '' },
                    }

                ]
            }
            const { errors, isError, data } = validateVoterRewards(rewards);
            expect(isError).toBe(false);
            expect(errors).toEqual({
                duplicateRanks: []
            });
            expect(data).toEqual({});
        });




        describe("Validate Voting Policy", () => {
            test("fail with empty policy", () => {
                const votingPolicy: VotingPolicyType[] = [];
                const { errors, isError, data } = validateVotingPolicy(votingPolicy);
                expect(isError).toBe(true);
                expect(errors).toEqual(
                    "Please add at least one voting policy",
                );
                expect(data).toEqual(votingPolicy);
            });

            test("pass with valid policy", () => {
                const votingPolicy: VotingPolicyType[] = [
                    {
                        token: sampleETHToken,
                        strategy: {
                            type: "weighted",
                        }

                    },
                    {
                        token: sampleERC20Token,
                        strategy: {
                            type: "arcade",
                            votingPower: '1',
                        }
                    }
                ]

                const { errors, isError, data } = validateVotingPolicy(votingPolicy);
                expect(isError).toBe(false);
                expect(errors).toEqual("");
                expect(data).toEqual(votingPolicy);
            });
        })

    });

})