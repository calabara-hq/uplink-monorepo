import { WritableStandardSubmission } from "../types/writeStandardSubmission";
import { getCacheSubParams, setCacheSubParams } from "./cache.js";
import { db, sqlOps } from "../utils/database.js";
import { schema, Decimal, EditorOutputData, TokenController } from "lib";
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { GraphQLError } from "graphql";
import { WritableTwitterSubmission } from "../types/writeTwitterSubmission";

dotenv.config();
const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY!, pinataSecretApiKey: process.env.PINATA_SECRET! });


// return the user's submissions for a contest
export const fetchUserSubmissions = async (
    user: any,
    contestId: number
) => {

    const userSubmissions = await db.select({
        id: schema.submissions.id,
        contestId: schema.submissions.contestId,
        author: schema.submissions.author,
        created: schema.submissions.created,
        type: schema.submissions.type,
        url: schema.submissions.url,
        version: schema.submissions.version,
    })
        .from(schema.submissions)
        .where(sqlOps.and(sqlOps.eq(schema.submissions.contestId, contestId), sqlOps.eq(schema.submissions.author, user.address)));

    return userSubmissions;
};


// return the contest deadlines and additional params
export const fetchContestParameters = async (contestId: number) => {
    const contestParameters = await db.select({
        subLimit: schema.contests.subLimit,
        contestType: schema.contests.type,
        chainId: schema.contests.chainId,
        deadlines: {
            startTime: schema.contests.startTime,
            voteTime: schema.contests.voteTime,
            endTime: schema.contests.endTime,
            snapshot: schema.contests.snapshot,
        }
    })
        .from(schema.contests).where(sqlOps.eq(schema.contests.id, contestId));

    return contestParameters[0];
};


// return the contest submitter restrictions
export const fetchSubmitterRestrictions = async (contestId: number) => {
    const submitterRestrictions = await db.select({
        id: schema.submitterRestrictions.id,
        contestId: schema.submitterRestrictions.contestId,
        restrictionType: schema.submitterRestrictions.restrictionType,
        tokenRestriction: {
            ...schema.tokenRestrictions,
            token: schema.tokens
        } as any
    })
        .from(schema.submitterRestrictions)
        .leftJoin(schema.tokenRestrictions, sqlOps.eq(schema.tokenRestrictions.restrictionId, schema.submitterRestrictions.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.tokenRestrictions.tokenLink))
        .where(sqlOps.eq(schema.submitterRestrictions.contestId, contestId));


    return submitterRestrictions.map((restriction: any) => {
        return {
            ...restriction,
            tokenRestriction: {
                ...restriction.tokenRestriction,
                threshold: new Decimal(restriction.tokenRestriction.threshold)
            }

        }
    });
}

// return the user submitting power adjusted for deadlines
export const deadlineAdjustedSubmittingPower = (
    sp: number,
    deadlines: {
        startTime: string,
        voteTime: string,
        endTime: string,
        snapshot: string,
    }) => {
    const now = new Date().toISOString();
    const { startTime, voteTime } = deadlines;
    if (now < startTime) return 0;
    if (now > voteTime) return 0;
    return sp;
};

// verify that the user is eligible to submit
export const checkWalletRestrictions = async (
    user: any,
    blockNum: number,
    tokenController: TokenController,
    restrictions: {
        restrictionType: string,
        tokenRestriction: {
            threshold: Decimal,
            token: {
                type: string,
                decimals: number,
                symbol: string,
                address?: string,
                tokenId?: string,
            }
        }
    }[]
) => {
    const restrictionResults = await Promise.all(restrictions.map(async (restriction: any) => {
        const { restrictionType, tokenRestriction } = restriction;
        const { token, threshold } = tokenRestriction;
        const userBalance = await tokenController.computeUserTokenBalance({ token, blockNum, walletAddress: user.address });
        if (userBalance.cmp(threshold) >= 0) return {
            restriction,
            result: true
        };
        return {
            restriction,
            result: false
        }
    }));
    return restrictionResults
}

// compute the max theoretical submission power for a user
export const computeMaxSubmissionPower = async (
    user: any,
    contestId: number,
): Promise<{
    maxSubPower: number,
    restrictionResults: {
        restriction: {
            restrictionType: string,
            tokenRestriction: {
                threshold: Decimal,
                token: {
                    type: string,
                    decimals: number,
                    symbol: string,
                    address?: string,
                    tokenId?: string,
                }
            }
        },
        result: boolean
    }[]
}> => {

    const [cacheResult, contestParameters] = await Promise.all([
        getCacheSubParams(user, contestId),
        fetchContestParameters(contestId),
    ])

    const { subLimit, chainId, deadlines } = contestParameters;

    // cache hit, no need for wallet checks

    if (cacheResult !== null) return { maxSubPower: deadlineAdjustedSubmittingPower(cacheResult.subPower, deadlines), restrictionResults: cacheResult.restrictionResults };

    // cache miss 

    else {

        const tokenController = new TokenController(process.env.ALCHEMY_KEY!, chainId);
        // when there is no subLimit, set max subs per user to 10
        const maxSubPower = subLimit === 0 ? 10 : subLimit;
        const submitterRestrictions = await fetchSubmitterRestrictions(contestId);

        if (submitterRestrictions.length === 0) return { maxSubPower: deadlineAdjustedSubmittingPower(maxSubPower, deadlines), restrictionResults: [] };

        const blockNum = await tokenController.calculateBlockFromTimestamp(deadlines.snapshot)
        const userRestrictionResult = await checkWalletRestrictions(user, blockNum, tokenController, submitterRestrictions);
        const restrictionAdjustedSubPower = userRestrictionResult.some((token) => token.result === true) ? maxSubPower : 0;
        await setCacheSubParams(user, contestId, restrictionAdjustedSubPower, userRestrictionResult);
        return { maxSubPower: deadlineAdjustedSubmittingPower(restrictionAdjustedSubPower, deadlines), restrictionResults: userRestrictionResult };
    }

};

// compute the reamaining submission power for a user
export const computeSubmissionParams = async (
    user: any,
    contestId: number
) => {


    const [{ maxSubPower, restrictionResults }, userSubmissions] = await Promise.all([
        computeMaxSubmissionPower(user, contestId),
        fetchUserSubmissions(user, contestId)
    ]);


    const userSubCount = userSubmissions.length;
    const remainingSubPower = maxSubPower === 0 ? 0 : maxSubPower - userSubCount;
    return {
        userSubmissions,
        remainingSubPower,
        maxSubPower,
        restrictionResults: restrictionResults.map((el: any) => {
            return {
                ...el,
                restriction: {
                    ...el.restriction,
                    tokenRestriction: {
                        ...el.restriction.tokenRestriction,
                        threshold: new Decimal(el.restriction.tokenRestriction.threshold)
                    }
                }
            }
        })
    }
}



// upload submission to ipfs
export const pinSubmission = async (
    submission: WritableStandardSubmission | WritableTwitterSubmission,
) => {


    const ipfsUrl = await pinata.pinJSONToIPFS(submission).then((result) => {
        return `https://uplink.mypinata.cloud/ipfs/${result.IpfsHash}`;
    }).catch((err) => {
        throw new GraphQLError('Error uploading submission to IPFS', {
            extensions: {
                code: 'IPFS_UPLOAD_ERROR'
            }
        })
    })

    return ipfsUrl;
};



const insertStandardSubmission = async (submission: WritableStandardSubmission, ipfsUrl: string, contestId: number, user: any) => {
    const newSubmission: schema.dbNewSubmissionType = {
        contestId: contestId,
        author: user.address,
        created: new Date().toISOString(),
        type: "standard",
        version: 'uplink-v1',
        url: ipfsUrl,
    }

    const result = await db.insert(schema.submissions).values(newSubmission);
    return result.insertId;
}


const insertTwitterSubmission = async (submission: WritableTwitterSubmission, ipfsUrl: string, contestId: number, user: any) => {


    const newSubmission: schema.dbNewSubmissionType = {
        contestId: contestId,
        author: user.address,
        created: new Date().toISOString(),
        type: "twitter",
        version: 'uplink-v1',
        url: ipfsUrl,
    }

    type TweetQueueThreadItem = {
        id: string;
        text: string;
        media: {
            type?: string;
            size?: number;
            url?: string;
        } | null;
    };

    const tweetQueueThread: TweetQueueThreadItem[] = submission.thread.map((item) => {
        return {
            id: nanoid(),
            text: item.text || "",

            media: item.videoAsset ? {
                url: item.videoAsset,
                type: item.assetType,
                size: item.assetSize
            } : item.previewAsset ? {
                url: item.previewAsset,
                type: item.assetType,
                size: item.assetSize
            } : null
        }
    });


    const tweetJob: schema.dbNewTweetQueueType = {
        contestId: contestId,
        author: user.id,
        created: new Date().toISOString(),
        jobContext: 'submission',
        payload: tweetQueueThread,
        accessToken: user.twitter.accessToken,
        expiresAt: user.twitter.expiresAt,
        retries: 0,
        status: 0
    }

    try {
        return await db.transaction(async (tx: any) => {
            await tx.insert(schema.tweetQueue).values(tweetJob);
            const submissionResult = await db.insert(schema.submissions).values(newSubmission);
            const submissionId = submissionResult.insertId;
            return submissionId;
        });
    } catch (err: any) {
        throw new Error("database error: " + err.message)
    }

}


export const createStandardSubmission = async (user: any, contestId: number, submissionPayload: WritableStandardSubmission) => {

    // calc user eligibility
    const { maxSubPower, remainingSubPower, userSubmissions } = await computeSubmissionParams(user, contestId);

    if (maxSubPower === 0) throw new GraphQLError('No entries allowed', {
        extensions: {
            code: 'INELIGIBLE_TO_SUBMIT'
        }
    });


    if (remainingSubPower < 1) throw new GraphQLError('No entries remaining', {
        extensions: {
            code: 'ENTRY_LIMIT_REACHED'
        }
    });

    try {
        // upload the submission
        const submissionUrl = await pinSubmission(submissionPayload);
        const submissionId = await insertStandardSubmission(submissionPayload, submissionUrl, contestId, user);
        // get the users updated submissions
        const updatedUserSubmissions = await fetchUserSubmissions(user, contestId);
        // return new user parameters
        return {
            success: true,
            userSubmissionParams: {
                userSubmissions: updatedUserSubmissions,
                remainingSubPower: remainingSubPower - 1,
                maxSubPower
            }
        }
    } catch (e) {
        return {
            success: false,
            userSubmissionParams: {
                userSubmissions,
                remainingSubPower,
                maxSubPower
            }
        }
    }
}

export const createTwitterSubmission = async (user: any, contestId: number, submissionPayload: WritableTwitterSubmission) => {
    const { maxSubPower, remainingSubPower, userSubmissions } = await computeSubmissionParams(user, contestId);

    if (maxSubPower === 0) throw new GraphQLError('No entries allowed', {
        extensions: {
            code: 'INELIGIBLE_TO_SUBMIT'
        }
    });


    if (remainingSubPower < 1) throw new GraphQLError('No entries remaining', {
        extensions: {
            code: 'ENTRY_LIMIT_REACHED'
        }
    });

    try {


        // upload the submission
        const submissionUrl = await pinSubmission(submissionPayload);
        const submissionId = await insertTwitterSubmission(submissionPayload, submissionUrl, contestId, user);
        // get the users updated submissions
        const updatedUserSubmissions = await fetchUserSubmissions(user, contestId);
        // return new user parameters
        return {
            success: true,
            userSubmissionParams: {
                userSubmissions: updatedUserSubmissions,
                remainingSubPower: remainingSubPower - 1,
                maxSubPower
            }
        }
    } catch (e) {
        return {
            success: false,
            userSubmissionParams: {
                userSubmissions,
                remainingSubPower,
                maxSubPower
            }
        }
    }
};