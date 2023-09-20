import { db, sqlOps } from "../utils/database.js";
import { schema, Decimal, EditorOutputData, revalidateClientCache } from "lib";
import { getCacheValue, setCacheValue } from "./cache.js";
import { GraphQLError, validate } from "graphql";
import pinataSDK from '@pinata/sdk';
import { tokenController } from "./tokenController.js"
import dotenv from 'dotenv';
import { validateSubmissionPayload, validateTwitterSubmissionPayload } from "./validatePayload.js";
import { nanoid } from 'nanoid';
import axios from "axios";
dotenv.config();

const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY, pinataSecretApiKey: process.env.PINATA_SECRET });



type TwitterThreadItem = {
    text?: string,
    previewAsset?: string,
    videoAsset?: string,
    assetType?: string,
    assetSize?: string
}


// return the contest deadlines and additional params
export const fetchContestParameters = async (contestId: number) => {
    const contestParameters = await db.select({
        subLimit: schema.contests.subLimit,
        contestType: schema.contests.type,
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


    return submitterRestrictions.map((restriction) => {
        return {
            ...restriction,
            tokenRestriction: {
                ...restriction.tokenRestriction,
                threshold: new Decimal(restriction.tokenRestriction.threshold)
            }

        }
    });
}


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




// query the cache and return the sub params for the user / contest
export const getCacheSubParams = async (
    user: any,
    contestId: number
) => {
    const key = `sub-params:${user.address}-${contestId}`;
    return await getCacheValue(key).then(value => {
        if (value === null) return null
        return {
            ...value,
            subPower: parseInt(value.subPower)
        }
    });
}

// cache the sub params for the user / contest
export const setCacheSubParams = async (
    user: any,
    contestId: number,
    subPower: number,
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
) => {
    const key = `sub-params:${user.address}-${contestId}`;
    const value = JSON.stringify({
        subPower: subPower.toString(),
        restrictionResults,
    });
    return await setCacheValue(key, value);
}


// return the user submitting power adjusted for deadlines
export const deadlineAdjustedSubmittingPower = (
    totalSubmittingPower: number,
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
    return totalSubmittingPower;
};





// upload submission to ipfs and insert into db
export const uploadSubmission = async (
    user: any,
    contestId: number,
    submission: {
        title: string,
        type: string,
        previewAsset?: string | null,
        videoAsset?: string | null,
        body?: EditorOutputData | null
    },
) => {


    const submissionType = submission.videoAsset ? 'video' : submission.previewAsset ? 'image' : 'text';

    const submissionWithType = {
        type: submissionType,
        ...submission
    }
    const ipfsUrl = await pinata.pinJSONToIPFS(submissionWithType).then((result) => {
        return `https://uplink.mypinata.cloud/ipfs/${result.IpfsHash}`;
    }).catch((err) => {
        throw new GraphQLError('Error uploading submission to IPFS', {
            extensions: {
                code: 'IPFS_UPLOAD_ERROR'
            }
        })
    })

    const newSubmission: schema.dbNewSubmissionType = {
        contestId: contestId,
        author: user.address,
        created: new Date().toISOString(),
        type: "standard",
        version: 'uplink-v1',
        url: ipfsUrl,
    }

    const result = await db.insert(schema.submissions).values(newSubmission);
    const submissionId = result.insertId;
    return submissionId;

};

const uploadTwitterSubmission = async (
    user: any,
    contestId: number,
    submission: {
        title: string,
        thread: TwitterThreadItem[]
    },
) => {


    const submissionType = submission.thread[0].videoAsset ? 'video' : submission.thread[0].previewAsset ? 'image' : 'text';

    const submissionWithType = {
        type: submissionType,
        ...submission
    }




    const ipfsUrl = await pinata.pinJSONToIPFS(submissionWithType).then((result) => {
        return `https://uplink.mypinata.cloud/ipfs/${result.IpfsHash}`;
    }).catch((err) => {
        throw new GraphQLError('Error uploading submission to IPFS', {
            extensions: {
                code: 'IPFS_UPLOAD_ERROR'
            }
        })
    })


    type TweetQueueThreadItem = {
        id: string;
        text: string;
        media: {
            type: string;
            size: string;
            url?: string;
        } | null;
    };


    const newSubmission: schema.dbNewSubmissionType = {
        contestId: contestId,
        author: user.address,
        created: new Date().toISOString(),
        type: "twitter",
        version: 'uplink-v1',
        url: ipfsUrl,
    }


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
        author: user.address,
        created: new Date().toISOString(),
        jobContext: 'submission',
        payload: tweetQueueThread,
        accessToken: user.twitter.accessToken,
        accessSecret: user.twitter.accessSecret,
        retries: 0,
        status: 0
    }

    try {
        return await db.transaction(async (tx) => {
            await tx.insert(schema.tweetQueue).values(tweetJob);
            const submissionResult = await db.insert(schema.submissions).values(newSubmission);
            const submissionId = submissionResult.insertId;
            return submissionId;
        });
    } catch (err) {
        throw new Error("database error: " + err.message)
    }
}


// verify that the user is eligible to submit
export const restrictionWalletCheck = async (
    user: any,
    blockNum: number,
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
        if (userBalance.cmp(threshold) > 0) return {
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

// compute the max submission power for a user and contest type
export const computeMaxSubmissionPower = async (
    user: any,
    contestId: number,
) => {

    const [cacheResult, contestParameters] = await Promise.all([
        getCacheSubParams(user, contestId),
        fetchContestParameters(contestId)
    ])

    const { subLimit, deadlines, contestType } = contestParameters;

    if (cacheResult !== null) return { contestType, maxSubPower: deadlineAdjustedSubmittingPower(cacheResult.subPower, deadlines), restrictionResults: cacheResult.restrictionResults };

    else {

        // when there is no subLimit, set max subs per user to 10
        const maxSubPower = subLimit === 0 ? 10 : subLimit;
        const submitterRestrictions = await fetchSubmitterRestrictions(contestId);

        if (submitterRestrictions.length === 0) return { contestType, maxSubPower: deadlineAdjustedSubmittingPower(maxSubPower, deadlines), restrictionResults: [] };

        const blockNum = await tokenController.calculateBlockFromTimestamp(deadlines.snapshot)
        const userRestrictionResult = await restrictionWalletCheck(user, blockNum, submitterRestrictions);
        const restrictionAdjustedSubPower = userRestrictionResult.some((token) => token.result === true) ? maxSubPower : 0;
        await setCacheSubParams(user, contestId, restrictionAdjustedSubPower, userRestrictionResult);
        return { contestType, maxSubPower: deadlineAdjustedSubmittingPower(restrictionAdjustedSubPower, deadlines), restrictionResults: userRestrictionResult };
    }

};

// compute the reamaining submission power for a user
export const computeSubmissionParams = async (
    user: any,
    contestId: number
) => {

    const [{ maxSubPower, contestType, restrictionResults }, userSubmissions] = await Promise.all([
        computeMaxSubmissionPower(user, contestId),
        fetchUserSubmissions(user, contestId)
    ]);

    const userSubCount = userSubmissions.length;
    const remainingSubPower = maxSubPower === 0 ? 0 : maxSubPower - userSubCount;
    return {
        contestType,
        userSubmissions,
        remainingSubPower,
        maxSubPower,
        restrictionResults: restrictionResults.map((el) => {
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



export const submit = async (
    user: any,
    contestId: number,
    submission: {
        title: string,
        previewAsset?: string,
        videoAsset?: string,
        body?: EditorOutputData
    }
) => {

    const { maxSubPower, contestType, remainingSubPower, userSubmissions } = await computeSubmissionParams(user, contestId);

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


    const validatedPayloadResult = await validateSubmissionPayload(submission);
    const { success, errors, cleanPayload } = validatedPayloadResult;

    if (success) {
        const submissionId = await uploadSubmission(user, contestId, cleanPayload);
        // get the users updated submissions
        const updatedUserSubmissions = await fetchUserSubmissions(user, contestId);

        await revalidateClientCache({
            host: process.env.FRONTEND_HOST,
            secret: process.env.FRONTEND_API_SECRET,
            tags: [`submissions/${contestId}`]
        })


        return {
            success: true,
            userSubmissionParams: {
                userSubmissions: updatedUserSubmissions,
                remainingSubPower: remainingSubPower - 1,
                maxSubPower
            }
        }
    }

    else if (!success) {
        return {
            success: false,
            errors: errors,
            userSubmissionParams: {
                userSubmissions,
                remainingSubPower,
                maxSubPower
            }
        }
    }
}

export const twitterSubmit = async (
    user: any,
    contestId: number,
    submission: {
        title: string,
        thread: TwitterThreadItem[]
    }
) => {
    const { maxSubPower, contestType, remainingSubPower, userSubmissions } = await computeSubmissionParams(user, contestId);

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

    const { success, errors, cleanPayload } = await validateTwitterSubmissionPayload(submission);

    if (success) {
        const submissionId = await uploadTwitterSubmission(user, contestId, cleanPayload);

        const updatedUserSubmissions = await fetchUserSubmissions(user, contestId);

        await revalidateClientCache({
            host: process.env.FRONTEND_HOST,
            secret: process.env.FRONTEND_API_SECRET,
            tags: [`submissions/${contestId}`]
        })

        return {
            success: true,
            userSubmissionParams: {
                userSubmissions: updatedUserSubmissions,
                remainingSubPower: remainingSubPower - 1,
                maxSubPower
            }
        }
    }

    else if (!success) {
        return {
            success: false,
            errors: errors,
            userSubmissionParams: {
                userSubmissions,
                remainingSubPower,
                maxSubPower
            }
        }
    }
}