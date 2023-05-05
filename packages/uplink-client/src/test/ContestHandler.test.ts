import { arraysSubtract, cleanSubmitterRewards, cleanVoterRewards, ContestBuilderProps, reducer, rewardsObjectToArray, SubmitterRewards, validateContestDeadlines, validateContestType, validatePrompt, validateSubmitterRewards, validateVoterRewards, validateVotingPolicy, VoterRewards } from "@/app/contestbuilder/contestHandler";
import { IToken } from "@/types/token";
import { describe, expect, test } from "@jest/globals";
import { sampleERC1155Token, sampleERC20Token, sampleERC721Token, sampleETHToken } from "./sampleTokens";

describe("Contest Handler", () => {

    describe("Contest Handler Reducer", () => {
        describe("Contest Type", () => {
            test("setContestType from initial null state", () => {
                const initialState = {
                    type: null,
                    errors: {}
                }

                const action = { type: "setType", payload: "standard" }
                const expectedState = { ...initialState, type: "standard" }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("setContestType from initial error state", () => {
                const initialState = {
                    type: null,
                    errors: {
                        type: "error"
                    }
                }

                const action = { type: "setType", payload: "standard" }
                const expectedState = { type: "standard", errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })
        });



        describe("Contest Deadlines", () => {
            test("setStartTime from initial state", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {}
                }

                const newStartTime = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setStartTime", payload: newStartTime }
                const expectedState = { ...initialState, deadlines: { ...initialState.deadlines, startTime: newStartTime } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear errors on setStartTime", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {
                        deadlines: {
                            startTime: "error"
                        }
                    }
                }

                const newStartTime = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setStartTime", payload: newStartTime }
                const expectedState = { ...initialState, deadlines: { ...initialState.deadlines, startTime: newStartTime }, errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("setVoteTime from initial state", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {}
                }

                const newVoteTime = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setVoteTime", payload: newVoteTime }
                const expectedState = { ...initialState, deadlines: { ...initialState.deadlines, voteTime: newVoteTime } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear errors on setVoteTime", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {
                        deadlines: {
                            voteTime: "error"
                        }
                    }
                }

                const newVoteTime = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setVoteTime", payload: newVoteTime }
                const expectedState = { ...initialState, deadlines: { ...initialState.deadlines, voteTime: newVoteTime }, errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("setEndTime from initial state", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {}
                }

                const newEndTime = new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setEndTime", payload: newEndTime }
                const expectedState = { ...initialState, deadlines: { ...initialState.deadlines, endTime: newEndTime } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear errors on setEndTime", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {
                        deadlines: {
                            endTime: "error"
                        }
                    }
                }

                const newEndTime = new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setEndTime", payload: newEndTime }
                const expectedState = { ...initialState, deadlines: { ...initialState.deadlines, endTime: newEndTime }, errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear only startTIme error on setStartTime", () => {
                const initialState = {
                    deadlines: {
                        startTime: "now",
                        voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                        endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    },
                    errors: {
                        deadlines: {
                            startTime: "error",
                            voteTime: "error",
                            endTime: "error"
                        }
                    }
                }

                const newStartTime = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z"
                const action = { type: "setStartTime", payload: newStartTime }
                const expectedState = {
                    ...initialState,
                    deadlines: { ...initialState.deadlines, startTime: newStartTime },
                    errors: { deadlines: { voteTime: "error", endTime: "error" } }
                }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

        })


        describe("Contest Prompt", () => {

            test("setPromptTitle", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null
                    },
                    errors: {}
                }
                const newPromptTitle = "new prompt"
                const action = { type: "setPromptTitle", payload: newPromptTitle }
                const expectedState = { ...initialState, prompt: { ...initialState.prompt, title: newPromptTitle } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear errors on setPromptTitle", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null
                    },
                    errors: {
                        prompt: {
                            title: "error"
                        }
                    }
                }

                const newPromptTitle = "different prompt"
                const action = { type: "setPromptTitle", payload: newPromptTitle }
                const expectedState = { prompt: { ...initialState.prompt, title: newPromptTitle }, errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("setPromptBody", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null
                    },
                    errors: {}
                }
                const newPromptBody = "new prompt"
                const action = { type: "setPromptBody", payload: newPromptBody }
                const expectedState = { ...initialState, prompt: { ...initialState.prompt, body: newPromptBody } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear errors on setPromptBody", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null
                    },
                    errors: {
                        prompt: {
                            body: "error"
                        }
                    }
                }

                const newPromptBody = "different prompt"
                const action = { type: "setPromptBody", payload: newPromptBody }
                const expectedState = { prompt: { ...initialState.prompt, body: newPromptBody }, errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("setCoverUrl", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null,
                    },
                    errors: {}
                }
                const newCoverUrl = "new prompt"
                const action = { type: "setCoverUrl", payload: newCoverUrl }
                const expectedState = { ...initialState, prompt: { ...initialState.prompt, coverUrl: newCoverUrl } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear errors on setCoverUrl", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null,
                    },
                    errors: {
                        prompt: {
                            coverUrl: "error"
                        }
                    }
                }

                const newCoverUrl = "different prompt"
                const action = { type: "setCoverUrl", payload: newCoverUrl }
                const expectedState = { prompt: { ...initialState.prompt, coverUrl: newCoverUrl }, errors: {} }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

            test("clear only body error on setPromptBody", () => {
                const initialState = {
                    prompt: {
                        title: "",
                        body: null
                    },
                    errors: {
                        prompt: {
                            title: "error",
                            body: "error"
                        }
                    }
                }

                const newPromptBody = "different prompt"
                const action = { type: "setPromptBody", payload: newPromptBody }
                const expectedState = { prompt: { ...initialState.prompt, body: newPromptBody }, errors: { prompt: { title: "error" } } }
                expect(reducer(initialState, action)).toEqual(expectedState)
            })

        });

        describe("Submitter Rewards", () => {

            test("addSubmitterReward ERC721", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1 }],
                    },
                };
                const action = { type: "addSubmitterReward", payload: { token: sampleERC721Token } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        payouts: [{ rank: 1, ERC721: { tokenId: null } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("addSubmitterReward ERC20", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1 }],
                    },
                };
                const action = { type: "addSubmitterReward", payload: { token: sampleERC20Token } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC20: { amount: "" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("removeSubmitterReward", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" }, ERC721: { tokenId: "1" } }],
                    },
                };

                const action = { type: "removeSubmitterReward", payload: { token: sampleERC20Token } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC721: sampleERC721Token,
                        payouts: [{ rank: 1, ERC721: { tokenId: "1" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);

            });

            test("removeSubmitterReward should unset fields on single initial token", () => {
                const initialState = {
                    submitterRewards: {
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }],
                    },
                };

                const action = { type: "removeSubmitterReward", payload: { token: sampleERC20Token } };
                const expectedState = {
                    submitterRewards: {},
                };
                expect(reducer(initialState, action)).toEqual(expectedState);

            });

            test("addSubRank", () => {
                const initialState = {
                    rewardOptions: [],
                    submitterRewards: {
                        payouts: [],
                    },
                };

                const action = { type: "addSubRank" };
                const newState = reducer(initialState, action);
                expect(newState.submitterRewards.payouts).toHaveLength(1);
                expect(newState.submitterRewards.payouts[0].rank).toBe(1);
            });

            test("removeSubRank", () => {
                const initialRemoveState = {
                    // ... other properties
                    rewardOptions: [],
                    submitterRewards: {
                        payouts: [
                            {
                                rank: 1,
                            },
                        ],
                    },
                    errors: {}
                };

                const action = { type: "removeSubRank", payload: 0 };
                const newState = reducer(initialRemoveState, action);
                expect(newState.submitterRewards.payouts).toHaveLength(0);
            });

            test("removeSubRank and clear rank errors", () => {
                const initialRemoveState = {
                    // ... other properties
                    rewardOptions: [],
                    submitterRewards: {
                        payouts: [
                            {
                                rank: 1,
                            },
                            {
                                rank: 1,
                            },
                        ],
                    },
                    errors: {
                        submitterRewards: {
                            duplicateRanks: [1],
                        },
                    }
                };

                const action = { type: "removeSubRank", payload: 0 };
                const newState = reducer(initialRemoveState, action);
                expect(newState.submitterRewards.payouts).toHaveLength(1);
                expect(newState.errors).toEqual({});
            });

            test("removeSubRank and clear single same-rank error", () => {
                const initialRemoveState = {
                    // ... other properties
                    rewardOptions: [],
                    submitterRewards: {
                        payouts: [
                            {
                                rank: 1,
                            },
                            {
                                rank: 1,
                            },
                            {
                                rank: 1,
                            },
                        ],
                    },
                    errors: {
                        submitterRewards: {
                            duplicateRanks: [1, 1],
                        },
                    }
                };

                const action = { type: "removeSubRank", payload: 0 };
                const newState = reducer(initialRemoveState, action);
                expect(newState.submitterRewards.payouts).toHaveLength(2);
                expect(newState.errors).toEqual({
                    submitterRewards: {
                        duplicateRanks: [1],
                    },
                });
            });

            test("updateSubRank", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }],
                    },
                    errors: {}
                };

                const action = { type: "updateSubRank", payload: { index: 0, rank: 2 } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 2, ERC20: { amount: "100" } }],
                    },
                    errors: {}
                };

                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateSubRank clear errors", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }, { rank: 1, ERC20: { amount: "200" } }],
                    },
                    errors: {
                        submitterRewards: {
                            duplicateRanks: [1]
                        }
                    }
                };

                const action = { type: "updateSubRank", payload: { index: 0, rank: 2 } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 2, ERC20: { amount: "100" } }, { rank: 1, ERC20: { amount: "200" } }],
                    },
                    errors: {}
                };

                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateSubRank and clear single same-rank error", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" } },
                            { rank: 1, ERC20: { amount: "200" } },
                            { rank: 1, ERC20: { amount: "300" } }
                        ],
                    },
                    errors: {
                        submitterRewards: {
                            duplicateRanks: [1, 1]
                        }
                    }
                };

                const action = { type: "updateSubRank", payload: { index: 0, rank: 2 } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [
                            { rank: 2, ERC20: { amount: "100" } },
                            { rank: 1, ERC20: { amount: "200" } },
                            { rank: 1, ERC20: { amount: "300" } }
                        ],
                    },
                    errors: {
                        submitterRewards: {
                            duplicateRanks: [1]
                        }
                    }
                };

                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateSubRewardAmount ERC20", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }],
                    },
                };
                const action = { type: "updateSubRewardAmount", payload: { index: 0, tokenType: "ERC20", amount: "200" } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC20: { amount: "200" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });
            test("updateERC721TokenId", () => {
                const initialState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC721: { tokenId: 1 } }],
                    },
                };
                const action = { type: "updateERC721TokenId", payload: { index: 0, tokenId: 2 } };
                const expectedState = {
                    submitterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        ERC721: sampleERC721Token,
                        ERC1155: sampleERC1155Token,
                        payouts: [{ rank: 1, ERC721: { tokenId: 2 } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

        })

        describe("Voter Rewards", () => {
            test("addVoterReward ETH intial state empty", () => {
                const initialState = {
                    voterRewards: {},
                };
                const action = { type: "addVoterReward", payload: { token: sampleETHToken } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        payouts: [{ rank: 1, ETH: { amount: "" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("addVoterReward ERC20", () => {
                const initialState = {
                    voterRewards: {
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }],
                    },
                };
                const newERC20Token = {
                    type: "ERC20",
                    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
                    symbol: "USDT",
                    decimals: 18,
                }
                const action = { type: "addVoterReward", payload: { token: newERC20Token } };
                const expectedState = {
                    voterRewards: {
                        ERC20: newERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("removeVoterReward", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
                    },
                };

                const action = { type: "removeVoterReward", payload: { token: sampleERC20Token } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        payouts: [{ rank: 1, ETH: { amount: "10" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);

            });

            test("removeVoterReward should return empty object", () => {
                const initialState = {
                    voterRewards: {
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" } }],
                    },
                };

                const action = { type: "removeVoterReward", payload: { token: sampleERC20Token } };
                const expectedState = {
                    voterRewards: {},
                };
                expect(reducer(initialState, action)).toEqual(expectedState);

            });

            test("addVoterRank", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: []
                        }
                    }
                };

                const action = { type: "addVoterRank" };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 2, ERC20: { amount: "" }, ETH: { amount: "" } },
                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: []
                        }
                    }
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });


            test("updateVoterRank", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
                    },
                    errors: {}
                };
                const action = { type: "updateVoterRank", payload: { index: 0, rank: 2 } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 2, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
                    },
                    errors: {}
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateVoterRank and clear errors", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }
                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: [1]
                        }
                    }
                };
                const action = { type: "updateVoterRank", payload: { index: 1, rank: 2 } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 2, ERC20: { amount: "100" }, ETH: { amount: "10" } }
                        ],
                    },
                    errors: {}
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateVoterRank and clear single same-rank error", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }
                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: [1, 1]
                        }
                    }
                };
                const action = { type: "updateVoterRank", payload: { index: 1, rank: 2 } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 2, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }

                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: [1]
                        }
                    }
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });


            test("removeVoterRank", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 2, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                        ],
                    },
                    errors: {}
                };
                const action = { type: "removeVoterRank", payload: 0 };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 2, ERC20: { amount: "0" }, ETH: { amount: "0" } }],
                    },
                    errors: {}

                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("removeVoterRank and clear errors", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: [1]
                        }
                    }
                };
                const action = { type: "removeVoterRank", payload: 0 };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "0" }, ETH: { amount: "0" } }],
                    },
                    errors: {}

                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("removeVoterRank and clear single same-rank error", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                            { rank: 1, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: [1, 1]
                        }
                    }
                };
                const action = { type: "removeVoterRank", payload: 2 };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [
                            { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                            { rank: 1, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                        ],
                    },
                    errors: {
                        voterRewards: {
                            duplicateRanks: [1]
                        }
                    }

                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });


            test("updateVoterRewardAmount", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
                    },
                };
                const action = { type: "updateVoterRewardAmount", payload: { index: 0, tokenType: "ERC20", amount: "200" } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "200" }, ETH: { amount: "10" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateVoterRewardType change type", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "10" } }],
                    },
                };
                const action = { type: "updateVoterRewardType", payload: { index: 0, oldTokenType: "ERC20", newTokenType: "ETH" } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ETH: { amount: "10" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateVoterRewardType same type", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "10" } }],
                    },
                };
                const action = { type: "updateVoterRewardType", payload: { index: 0, oldTokenType: "ERC20", newTokenType: "ERC20" } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "10" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("updateVoterRewardType no initial payouts", () => {
                const initialState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1 }],
                    },
                };
                const action = { type: "updateVoterRewardType", payload: { index: 0, oldTokenType: "ETH", newTokenType: "ERC20" } };
                const expectedState = {
                    voterRewards: {
                        ETH: sampleETHToken,
                        ERC20: sampleERC20Token,
                        payouts: [{ rank: 1, ERC20: { amount: "0" } }],
                    },
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

        });

        describe("Submitter Restrictions", () => {
            test("addSubmitterRestriction", () => {
                const initialState = {
                    submitterRestrictions: [],
                };
                const action = { type: "addSubmitterRestriction", payload: { token: sampleETHToken, threshold: "1" } };
                const expectedState = {
                    submitterRestrictions: [{
                        token: sampleETHToken,
                        threshold: "1",
                    }],
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("removeSubmitterRestriction", () => {
                const initialState = {
                    submitterRestrictions: [{ ...sampleETHToken }],
                };
                const action = { type: "removeSubmitterRestriction", payload: 0 };
                const expectedState = {
                    submitterRestrictions: [],
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            })

            test("updateSubmitterRestriction", () => {
                const initialState = {
                    submitterRestrictions: [{ token: sampleETHToken, threshold: "1" }],
                };
                const action = { type: "updateSubmitterRestriction", payload: { index: 0, restriction: { token: sampleETHToken, threshold: "5" } } };
                const expectedState = {
                    submitterRestrictions: [{ token: sampleETHToken, threshold: "5" }],
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            })

        });


        describe("Voting Policy", () => {

            test("addVotingPolicy", () => {
                const initialState = {
                    votingPolicy: [],
                    errors: {}
                };
                const action = {
                    type: "addVotingPolicy", payload: {
                        policy: {
                            token: sampleETHToken,
                            strategy: {
                                type: "arcade",
                                votingPower: "100",
                            }
                        }
                    }
                };
                const expectedState = {
                    votingPolicy: [{
                        token: sampleETHToken,
                        strategy: {
                            type: "arcade",
                            votingPower: "100",
                        }
                    }],
                    errors: {}
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });

            test("removeVotingPolicy", () => {
                const initialState = {
                    votingPolicy: [{
                        token: sampleETHToken,
                        strategy: {
                            type: "arcade",
                            votingPower: "100",
                        }
                    }],
                    errors: {}
                };
                const action = { type: "removeVotingPolicy", payload: 0 };
                const expectedState = {
                    votingPolicy: [],
                    errors: {}
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            })


            test("updateVotingPolicy", () => {
                const initialState = {
                    votingPolicy: [{
                        token: sampleETHToken,
                        strategy: {
                            type: "arcade",
                            votingPower: "100",
                        }
                    }],
                    errors: {}
                };
                const action = {
                    type: "updateVotingPolicy", payload: {
                        index: 0,
                        policy: {
                            token: sampleERC20Token,
                            strategy: {
                                type: "weighted",
                                votingPower: "600",
                            }
                        }
                    }
                };
                const expectedState = {
                    votingPolicy: [{
                        token: sampleERC20Token,
                        strategy: {
                            type: "weighted",
                            votingPower: "600",
                        }
                    }],
                    errors: {}
                };
                expect(reducer(initialState, action)).toEqual(expectedState);
            });


        });


    })


    describe("Helper functions", () => {


        test("cleansubmitterRewards", () => {
            const dirtyRewards: SubmitterRewards = {
                // ... other properties
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1.65' },
                        ERC20: { amount: '' },
                        ERC721: { tokenId: 0 },
                        ERC1155: { amount: '0' }
                    },
                ],
            };

            const cleanRewards = {
                ETH: sampleETHToken,
                ERC721: sampleERC721Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1.65' },
                        ERC721: { tokenId: 0 }

                    },
                ],
            };

            const newState = cleanSubmitterRewards(dirtyRewards);
            expect(newState).toEqual(cleanRewards);
        })

        test("cleansubmitterRewards empty rewards", () => {
            const dirtyRewards: SubmitterRewards = {};
            const cleanRewards = {};
            const newState = cleanSubmitterRewards(dirtyRewards);
            expect(newState).toEqual(cleanRewards);
        })


        test("cleanVoterRewards", () => {
            const dirtyRewards: VoterRewards = {
                // ... other properties
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1.6' },
                        ERC20: { amount: '' },
                    },
                ],
            };

            const cleanRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1.6' },
                    },
                ],
            };

            const newState = cleanVoterRewards(dirtyRewards);
            expect(newState).toEqual(cleanRewards);
        })

        test("cleanVoterRewards empty rewards", () => {
            const dirtyRewards: VoterRewards = {};
            const cleanRewards = {};
            const newState = cleanVoterRewards(dirtyRewards);
            expect(newState).toEqual(cleanRewards);
        })


        test("rewardsObjectToArray", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                        ERC20: { amount: '0' }
                    },
                ],
            };

            const result = rewardsObjectToArray(rewards)
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(sampleETHToken);
            expect(result[1]).toEqual(sampleERC20Token);
        });

        test("rewardsObjectToArray strict types", () => {
            const rewards: SubmitterRewards = {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '1' },
                        ERC20: { amount: '0' }
                    },
                ],
            };

            const result = rewardsObjectToArray(rewards, ["ETH", "ERC20"])
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(sampleETHToken);
            expect(result[1]).toEqual(sampleERC20Token);
        });


        test("arraysSubtract #1", () => {
            const arr1: IToken[] = [
                sampleETHToken,
                sampleERC20Token,
                sampleERC721Token
            ]

            const arr2: IToken[] = [
                sampleETHToken,
                sampleERC20Token,
            ]

            const result = arraysSubtract(arr1, arr2);
            expect(result).toEqual(
                [sampleERC721Token]
            );

        });

        test("arraysSubtract #2", () => {
            const arr1: IToken[] = [
                sampleETHToken,
                sampleERC20Token,

            ]

            const arr2: IToken[] = [
                sampleETHToken,
                sampleERC20Token,
                sampleERC721Token
            ]

            const result = arraysSubtract(arr1, arr2);
            expect(result).toHaveLength(0);

        });

        test("arraysSubtract #3", () => {
            const arr1: IToken[] = [
                sampleETHToken,
                sampleERC20Token,
                sampleERC721Token
            ]

            const arr2: IToken[] = [
                sampleETHToken,
            ]

            const result = arraysSubtract(arr1, arr2, ["ETH", "ERC20"]);
            expect(result).toEqual(
                [sampleERC20Token,]
            );

        });
    });



    describe('validation', () => {
        describe('validate contest type', () => {
            test('should fail with null contest type', () => {
                const contestType = null
                const { isError, errors } = validateContestType(contestType);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    type: 'Contest type is required'
                });
            })
            test('should fail with empty string contest type', () => {
                const contestType = ''
                const { isError, errors } = validateContestType(contestType);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    type: 'Contest type is required'
                });
            })
            test('should fail with unsupported contest type', () => {
                const contestType = 'prophouse'
                const { isError, errors } = validateContestType(contestType);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    type: 'Contest type is required'
                });
            })
            test('should succeed with standard contest type', () => {
                const contestType = 'standard'
                const { isError, errors } = validateContestType(contestType);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })

            test('should succeed with twitter contest type', () => {
                const contestType = 'twitter'
                const { isError, errors } = validateContestType(contestType);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })
        })


        describe('validate contest deadlines', () => {
            test('should fail with null deadlines', () => {
                const deadlines = null as any;
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    deadlines: {
                        snapshot: 'snapshot date is required',
                        startTime: 'start date is required',
                        voteTime: 'vote date is required',
                        endTime: 'end date is required',
                    }
                });
            })
            test('should fail with empty string deadlines', () => {
                const deadlines = {
                    snapshot: '',
                    startTime: '',
                    voteTime: '',
                    endTime: '',
                };
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    deadlines: {
                        snapshot: 'snapshot date is required',
                        startTime: 'start date is required',
                        voteTime: 'vote date is required',
                        endTime: 'end date is required',
                    }
                });
            })

            test('should fail with vote date < start date', () => {
                const deadlines = {
                    snapshot: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    startTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                    voteTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                };
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    deadlines: {
                        voteTime: 'vote date must be after start date',
                    }
                });
            })

            test('should fail with end date < vote date', () => {
                const deadlines = {
                    snapshot: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    startTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    voteTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    endTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",

                };
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    deadlines: {
                        endTime: 'end date must be after vote date',
                    }
                });
            })

            test('should fail with end date < start date and end date < vote date', () => {
                const deadlines = {
                    snapshot: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    startTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                    voteTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                    endTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",

                };
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    deadlines: {
                        endTime: 'end date must be after start date',
                    }
                });
            })

            test('should succeed with valid deadlines', () => {
                const deadlines = {
                    snapshot: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    startTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
                    voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                    endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                };
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })

            test('should succeed with `now` as startTime and `now` as snapshot', () => {
                const deadlines = {
                    snapshot: 'now',
                    startTime: 'now',
                    voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
                    endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
                };
                const { isError, errors } = validateContestDeadlines(deadlines);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })

        })

        describe('validate submitterRewards', () => {
            test('should fail with duplicate ranks', () => {
                const submitterRewards: ContestBuilderProps['submitterRewards'] = {
                    ETH: sampleETHToken,
                    payouts: [
                        {
                            rank: 1,
                            ETH: {
                                amount: "1",
                            }
                        },
                        {
                            rank: 1,
                            ETH: {
                                amount: "2",
                            }
                        },
                        {
                            rank: 2,
                            ETH: {
                                amount: "2",
                            }
                        }
                    ]
                }

                const { isError, errors } = validateSubmitterRewards(submitterRewards);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    submitterRewards: {
                        duplicateRanks: [1]
                    }
                });
            })

            test('should fail with multiple same-rank duplicates', () => {
                const submitterRewards: ContestBuilderProps['submitterRewards'] = {
                    ETH: sampleETHToken,
                    payouts: [
                        {
                            rank: 1,
                            ETH: {
                                amount: "1",
                            }
                        },
                        {
                            rank: 1,
                            ETH: {
                                amount: "2",
                            }
                        },
                        {
                            rank: 1,
                            ETH: {
                                amount: "2",
                            }
                        }
                    ]
                }

                const { isError, errors } = validateSubmitterRewards(submitterRewards);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    submitterRewards: {
                        duplicateRanks: [1, 1]
                    }
                });
            })

            test('should suceed with valid rewards', () => {
                const submitterRewards: ContestBuilderProps['submitterRewards'] = {
                    ETH: sampleETHToken,
                    payouts: [
                        {
                            rank: 1,
                            ETH: {
                                amount: "1",
                            }
                        },
                        {
                            rank: 2,
                            ETH: {
                                amount: "2",
                            }
                        },
                        {
                            rank: 3,
                            ETH: {
                                amount: "2",
                            }
                        }
                    ]
                }

                const { isError, errors } = validateSubmitterRewards(submitterRewards);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })
        })

        describe('validate voterRewards', () => {
            test('should fail with duplicate ranks', () => {
                const voterRewards: ContestBuilderProps['voterRewards'] = {
                    ETH: sampleETHToken,
                    payouts: [
                        {
                            rank: 1,
                            ETH: {
                                amount: "1",
                            }
                        },
                        {
                            rank: 1,
                            ETH: {
                                amount: "2",
                            }
                        },
                        {
                            rank: 2,
                            ETH: {
                                amount: "2",
                            }
                        }
                    ]
                }

                const { isError, errors } = validateVoterRewards(voterRewards);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    voterRewards: {
                        duplicateRanks: [1]
                    }
                });
            })

            test('should fail with multiple same-rank duplicates', () => {
                const voterRewards: ContestBuilderProps['voterRewards'] = {
                    ETH: sampleETHToken,
                    payouts: [
                        {
                            rank: 1,
                            ETH: {
                                amount: "1",
                            }
                        },
                        {
                            rank: 1,
                            ETH: {
                                amount: "2",
                            }
                        },
                        {
                            rank: 1,
                            ETH: {
                                amount: "2",
                            }
                        }
                    ]
                }

                const { isError, errors } = validateVoterRewards(voterRewards);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    voterRewards: {
                        duplicateRanks: [1, 1]
                    }
                });
            })


            test('should suceed with valid rewards', () => {
                const voterRewards: ContestBuilderProps['voterRewards'] = {
                    ETH: sampleETHToken,
                    payouts: [
                        {
                            rank: 1,
                            ETH: {
                                amount: "1",
                            }
                        },
                        {
                            rank: 2,
                            ETH: {
                                amount: "2",
                            }
                        },
                        {
                            rank: 3,
                            ETH: {
                                amount: "2",
                            }
                        }
                    ]
                }

                const { isError, errors } = validateVoterRewards(voterRewards);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })
        })

        describe('validate prompt', () => {
            test('should fail with empty title, null body, and invalid cover url', () => {
                const prompt: ContestBuilderProps['prompt'] = {
                    title: '',
                    body: null,
                    coverUrl: "test"
                }

                const { isError, errors } = validatePrompt(prompt);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    prompt: {
                        title: 'Prompt title is required',
                        body: 'Prompt body is required',
                        coverUrl: 'Image is not valid'
                    }
                });
            })

            test('should fail with empty prompt body blocks', () => {
                const prompt: ContestBuilderProps['prompt'] = {
                    title: 'a brand new title',
                    body: {
                        "time": 1682628241526,
                        "blocks": [],
                        "version": "2.26.5"
                    },
                    coverUrl: "https://calabara.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz"
                }

                const { isError, errors } = validatePrompt(prompt);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    prompt: {
                        body: 'Prompt body is required'
                    }
                });
            })

            test('should succeed with valid props', () => {
                const prompt: ContestBuilderProps['prompt'] = {
                    title: 'a brand new title',
                    body: {
                        "time": 1682628241526,
                        "blocks": [
                            {
                                "id": "qZxrSG7bxL",
                                "type": "paragraph",
                                "data": {
                                    "text": "test"
                                }
                            }
                        ],
                        "version": "2.26.5"
                    },
                    coverUrl: "https://calabara.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz"
                }

                const { isError, errors } = validatePrompt(prompt);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })
        })


        describe('validate votingPolicy', () => {
            test('should fail with empty votingPolicy', () => {
                const votingPolicy: ContestBuilderProps['votingPolicy'] = [];

                const { isError, errors } = validateVotingPolicy(votingPolicy);
                expect(isError).toEqual(true)
                expect(errors).toEqual({
                    votingPolicy: 'Voting policy is required'
                });
            })

            test('should succeed with valid votingPolicy', () => {
                const votingPolicy: ContestBuilderProps['votingPolicy'] = [{
                    token: sampleETHToken,
                    strategy: {
                        type: 'arcade',
                        votingPower: '2'
                    }
                }];

                const { isError, errors } = validateVotingPolicy(votingPolicy);
                expect(isError).toEqual(false)
                expect(errors).toEqual({});
            })

        })


    })

})