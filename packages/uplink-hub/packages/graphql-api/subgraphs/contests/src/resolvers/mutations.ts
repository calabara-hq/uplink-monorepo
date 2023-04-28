import {
    Authorization,
    IERCToken,
    INativeToken,
    IToken,
    isERCToken,
    verifyTokenStandard,
    Deadlines,
    Prompt,
    SubmitterRewards,
    VoterRewards,
    SubmitterRestriction,
    VotingPolicy,
    ContestBuilderProps,
} from "lib";
import { GraphQLError } from "graphql";
import { VotingStrategyType } from "lib";




export type FieldResponse = {
    error?: string;
}


const validateContestType = (type: ContestBuilderProps['type']) => {
    const response: FieldResponse = {};

    if (!type || type === '') {
        response.error = "Contest type must be defined";
        return response;
    }

    if (type !== 'standard' && type !== 'twitter') {
        response.error = "Invalid contest type";
        return response;
    }

    return response;
}

export const validateDeadlines = (deadlines: Deadlines) => {
    const response: {
        startTime: FieldResponse;
        voteTime: FieldResponse;
        endTime: FieldResponse;
    } = {
        startTime: {},
        voteTime: {},
        endTime: {},
    };

    const { startTime, voteTime, endTime } = deadlines || {};

    const isIsoDate = (date: string) => !isNaN(Date.parse(date));

    const validateField = (field: string, fieldName: string) => {
        if (!field || field === '') {
            response[fieldName].error = `${fieldName} must be defined`;
        } else if (!isIsoDate(field)) {
            response[fieldName].error = `${fieldName} must be a valid ISO date`;
        }
    };

    validateField(startTime, "startTime");
    validateField(voteTime, "voteTime");
    validateField(endTime, "endTime");

    if (response.startTime.error || response.voteTime.error || response.endTime.error) return response;

    if (voteTime <= startTime) {
        response.voteTime.error = "Vote date must be after start date";
    }

    if (endTime <= voteTime) {
        response.endTime.error = "End date must be after vote date";
    }

    if (endTime <= startTime) {
        response.endTime.error = "End date must be after start date";
    }

    return response;
};

export const validatePrompt = (prompt: Prompt) => {
    const response: {
        title: FieldResponse;
        body: FieldResponse;
        coverUrl: FieldResponse;
    } = {
        title: {},
        body: {},
        coverUrl: {},
    };

    const { title, body, coverUrl } = prompt || {};

    if (!title || title === '') {
        response.title.error = "Prompt title must be defined";
    }

    if (!body || body === '') {
        response.body.error = "Prompt body must be defined";
    }

    if (coverUrl) {
        // cover image should look like https://calabara.mypinata.cloud/ipfs/${hash}
        const isIpfs = coverUrl.match(/https:\/\/calabara.mypinata.cloud\/ipfs\/Qm[a-zA-Z0-9]{44}/);
        if (!isIpfs) {
            response.coverUrl.error = "Prompt cover image must be a valid IPFS hash";
        }
    }

    return response;
}


export const validateSubmitterRewards = async (submitterRewards: SubmitterRewards) => {
    const response: {
        tokens: FieldResponse;
        payouts: FieldResponse;
    } = {
        tokens: {},
        payouts: {},
    };

    if (!submitterRewards || Object.keys(submitterRewards).length === 0) return response;

    const seenRanks = new Set<number>();

    // verify the tokens are valid
    const { payouts, ...tokens } = submitterRewards;

    if (Object.keys(tokens).length === 0 && payouts.length > 0) {
        response.tokens.error = "At least one token must be defined";
        return response;
    }

    if (payouts.length === 0 && Object.keys(tokens).length > 0) {
        response.payouts.error = "At least one payout must be defined";
        return response;
    }

    for (const token of Object.keys(tokens)) {
        const tokenData = tokens[token];

        if (isERCToken(tokenData)) {
            const isValid = await verifyTokenStandard({
                contractAddress: tokenData.address as IERCToken["address"],
                expectedStandard: token as "ERC20" | "ERC721" | "ERC1155",
            });

            if (!isValid) {
                response.tokens.error = `Invalid ${token} token`;
            }
        }
    }

    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];
    ranks.forEach((rank, index) => {
        if (seenRanks.has(rank)) {
            response.payouts.error = `Duplicate rank ${rank} found at index ${index}`;
        } else {
            seenRanks.add(rank);
        }
    });

    return response;
};


export const validateVoterRewards = async (voterRewards: VoterRewards) => {
    const response: {
        tokens: FieldResponse;
        payouts: FieldResponse;
    } = {
        tokens: {},
        payouts: {},
    };

    if (!voterRewards || Object.keys(voterRewards).length === 0) return response;

    const seenRanks = new Set<number>();

    // verify the tokens are valid
    const { payouts, ...tokens } = voterRewards;

    if (Object.keys(tokens).length === 0 && payouts.length > 0) {
        response.tokens.error = "At least one token must be defined";
        return response;
    }

    if (payouts.length === 0 && Object.keys(tokens).length > 0) {
        response.payouts.error = "At least one payout must be defined";
        return response;
    }

    for (const token of Object.keys(tokens)) {
        const tokenData = tokens[token];

        if (isERCToken(tokenData)) {
            const isValid = await verifyTokenStandard({
                contractAddress: tokenData.address as IERCToken["address"],
                expectedStandard: "ERC20"
            });

            if (!isValid) {
                response.tokens.error = `Invalid ${token} token`;
            }
        }
    }

    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];
    ranks.forEach((rank, index) => {
        if (seenRanks.has(rank)) {
            response.payouts.error = `Duplicate rank ${rank} found at index ${index}`;
        } else {
            // make sure the payout has a rank, token (ETH or ERC20), and amount
            if (!payouts[index].rank) {
                response.payouts.error = `Rank must be defined for payout at index ${index}`;
            }

            if (!payouts[index].ERC20 && !payouts[index].ETH) {
                response.payouts.error = `Token must be defined for payout at index ${index}`;
            }

            if (!payouts[index].ERC20.amount && !payouts[index].ETH.amount) {
                response.payouts.error = `Amount must be defined for payout at index ${index}`;
            }

            seenRanks.add(rank);
        }
    });

    return response;
};

export const validateSubmitterRestrictions = async (submitterRestrictions: SubmitterRestriction[] | []) => {
    const response: {
        tokens: FieldResponse;
        thresholds: FieldResponse;
    } = {
        tokens: {},
        thresholds: {},
    };

    if (submitterRestrictions.length === 0) return response


    for (const { token, threshold } of submitterRestrictions) {
        if (isERCToken(token)) {
            // verify the token is valid
            const isValid = await verifyTokenStandard({
                contractAddress: token.address,
                expectedStandard: token.type,
            });

            if (!isValid) {
                response.tokens.error = `Invalid ${token.type} token`;
            }
        }

        const floatThreshold = parseFloat(threshold);

        if (!floatThreshold || floatThreshold <= 0) {
            response.thresholds.error = "Threshold must be a positive, non-zero number";
        }
    }

    return response;
}

export const validateVotingPolicy = async (votingPolicy: VotingPolicy[]) => {
    const response: {
        tokens: FieldResponse;
        strategies: FieldResponse;
    } = {
        tokens: {},
        strategies: {},
    };

    // token: IToken
    // strategy:
    // type
    // multiplier
    // votingPower

    const validateStrategy = (strategy: VotingPolicy["strategy"]) => {
        const { type, multiplier, votingPower } = strategy || {};

        // return false if multiplier and votingPower are both defined
        if (multiplier && votingPower) return false;

        // return false if multiplier and votingPower are both undefined
        if (!multiplier && !votingPower) return false;


        const floatMultiplier = parseFloat(multiplier);
        const floatVotingPower = parseFloat(votingPower);

        if (type === 'arcade') {
            if (!floatVotingPower) return false
            if (floatVotingPower <= 0) return false;
        }

        if (type === 'weighted') {
            if (!floatMultiplier) return false
            if (floatMultiplier <= 0) return false;
        }

        return true;
    }

    for (const [index, { token, strategy }] of votingPolicy.entries()) {
        if (isERCToken(token)) {
            // verify the token is valid
            const isValidToken = await verifyTokenStandard({
                contractAddress: token.address,
                expectedStandard: token.type,
            });

            if (!isValidToken) {
                response.tokens.error = `Invalid ${token.type} token`;
            }

            const isValidStrategy = validateStrategy(strategy);
            if (!isValidStrategy) {
                response.strategies.error = `Invalid strategy at index ${index}`;
            }

        }
    }

    return response;

}

const processContestData = async (contestData: ContestBuilderProps) => {
    const { type, deadlines, prompt, submitterRewards, voterRewards, submitterRestrictions, votingPolicy } = contestData;
    const typeResult = validateContestType(type);
    const deadlinesResult = validateDeadlines(deadlines);
    /*
    const promptResult = validatePrompt(prompt);
    const submitterRewardsResult = await validateSubmitterRewards(submitterRewards);
    const voterRewardsResult = await validateVoterRewards(voterRewards);
    const submitterRestrictionsResult = await validateSubmitterRestrictions(submitterRestrictions);
    const votingPolicyResult = await validateVotingPolicy(votingPolicy);
    */
    const errors = {
        ...(typeResult?.error ? { type: typeResult.error } : {}),
        ...(Object.keys(deadlinesResult).some(key => deadlinesResult[key].error) ? {
            deadlines: {
                ...(deadlinesResult.startTime.error ? { startTime: deadlinesResult.startTime.error } : {}),
                ...(deadlinesResult.voteTime.error ? { voteTime: deadlinesResult.voteTime.error } : {}),
                ...(deadlinesResult.endTime.error ? { endTime: deadlinesResult.endTime.error } : {}),
            }
        } : {}),
        /*
        ...(Object.keys(promptResult).some(key => promptResult[key].error) ? {
            prompt: {
                ...(promptResult.title.error ? { title: promptResult.title.error } : {}),
                ...(promptResult.body.error ? { body: promptResult.body.error } : {}),
                ...(promptResult.coverUrl.error ? { coverUrl: promptResult.coverUrl.error } : {}),
            }
        } : {}),
        ...(Object.keys(submitterRewardsResult).some(key => submitterRewardsResult[key].error) ? {
            submitterRewards: {
                ...(submitterRewardsResult.tokens.error ? { tokens: submitterRewardsResult.tokens.error } : {}),
                ...(submitterRewardsResult.payouts.error ? { payouts: submitterRewardsResult.payouts.error } : {}),
            }
        } : {}),

        ...(Object.keys(voterRewardsResult).some(key => voterRewardsResult[key].error) ? {
            voterRewards: {
                ...(voterRewardsResult.tokens.error ? { tokens: voterRewardsResult.tokens.error } : {}),
                ...(voterRewardsResult.payouts.error ? { payouts: voterRewardsResult.payouts.error } : {}),
            }
        } : {}),
        ...(Object.keys(submitterRestrictionsResult).some(key => submitterRestrictionsResult[key].error) ? {
            submitterRestrictions: {
                ...(submitterRestrictionsResult.tokens.error ? { tokens: submitterRestrictionsResult.tokens.error } : {}),
                ...(submitterRestrictionsResult.thresholds.error ? { thresholds: submitterRestrictionsResult.thresholds.error } : {}),

            }
        } : {}),

        ...(Object.keys(votingPolicyResult).some(key => votingPolicyResult[key].error) ? {
            votingPolicy: {
                ...(votingPolicyResult.tokens.error ? { tokens: votingPolicyResult.tokens.error } : {}),
                ...(votingPolicyResult.strategies.error ? { strategies: votingPolicyResult.strategies.error } : {}),
            }
        } : {}),
        */
    }
    const isSuccess = Object.keys(errors).length === 0;

    return {
        success: isSuccess,
        errors: errors,
    }
}

const mutations = {
    Mutation: {
        createContest: async (_: any, args: any, context: any) => {
            //const user = await Authorization.getUser(context);
            //if (!user) throw new Error('Unauthorized');

            const { contestData } = args;
            const result = await processContestData(contestData);

            return {
                success: result.success,
                errors: result.errors,
            }
        },
    }
}


export default mutations;