import { db, sqlOps } from "../utils/database.js";
import { schema, Decimal, EditorOutputData } from "lib";
import { getCacheValue, setCacheValue } from "./cache.js";
import { GraphQLError, validate } from "graphql";
import pinataSDK from '@pinata/sdk';
import { tokenController } from "./tokenController.js"
import dotenv from 'dotenv';
import { validateSubmissionPayload } from "./validatePayload.js";
dotenv.config();

const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY, pinataSecretApiKey: process.env.PINATA_SECRET });


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
    user: { address: string },
    contestId: number
) => {

    const userSubmissions = await db.select({
        id: schema.submissions.id,
    })
        .from(schema.submissions)
        .where(sqlOps.and(sqlOps.eq(schema.submissions.contestId, contestId), sqlOps.eq(schema.submissions.author, user.address)));

    return userSubmissions;
};




// query the cache and return the total sub power for the user / contest
export const getCacheTotalSubPower = async (
    user: { address: string },
    contestId: number
) => {
    const key = `sub-power:${user.address}-${contestId}`;
    return await getCacheValue(key).then(value => {
        if (value === null) return null
        return parseInt(value);
    });
}

// cache the total sub power for the user / contest
export const setCacheTotalSubPower = async (
    user: { address: string },
    contestId: number,
    subPower: number
) => {
    const key = `sub-power:${user.address}-${contestId}`;
    const value = subPower.toString();
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
    user: { address: string },
    contestId: number,
    submission: {
        title: string,
        type: string,
        previewAsset?: string | null,
        videoAsset?: string | null,
        body?: EditorOutputData | null
    },
    contestType: string
) => {

    if (contestType === "twitter") { }
    else if (contestType === "standard") {
        const ipfsUrl = await pinata.pinJSONToIPFS(submission).then((result) => {
            return `https://calabara.mypinata.cloud/ipfs/${result.IpfsHash}`;
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
            type: contestType,
            version: 'uplink-v1',
            url: ipfsUrl,
        }

        const result = await db.insert(schema.submissions).values(newSubmission);
        const submissionId = result.insertId;
        return submissionId;

    }
};


// verify that the user is eligible to submit
export const restrictionWalletCheck = async (
    user: { address: string },
    snapshot: string,
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
        const userBalance = await tokenController.computeUserTokenBalance({ token, snapshot, walletAddress: user.address });
        if (userBalance > threshold) return true;
        return false;
    }));
    return restrictionResults.some((result) => result === true);
}

// compute the max submission power for a user and contest type
export const computeMaxSubmissionPower = async (
    user: { address: string },
    contestId: number,
) => {

    const [cachedMaxSubPower, contestParameters] = await Promise.all([
        getCacheTotalSubPower(user, contestId),
        fetchContestParameters(contestId)
    ])

    const { subLimit, deadlines, contestType } = contestParameters;

    if (cachedMaxSubPower !== null) return { contestType, maxSubPower: deadlineAdjustedSubmittingPower(cachedMaxSubPower, deadlines) };

    else {

        // when there is no subLimit, set max subs per user to 10
        const maxSubPower = subLimit === 0 ? 10 : subLimit;
        const submitterRestrictions = await fetchSubmitterRestrictions(contestId);

        if (submitterRestrictions.length === 0) return { contestType, maxSubPower: deadlineAdjustedSubmittingPower(maxSubPower, deadlines) };

        const userRestrictionResult = await restrictionWalletCheck(user, deadlines.snapshot, submitterRestrictions);
        const restrictionAdjustedSubPower = userRestrictionResult ? maxSubPower : 0;
        await setCacheTotalSubPower(user, contestId, restrictionAdjustedSubPower);
        return { contestType, maxSubPower: deadlineAdjustedSubmittingPower(restrictionAdjustedSubPower, deadlines) };
    }

};

// compute the reamaining submission power for a user
export const computeSubmissionParams = async (
    user: { address: string },
    contestId: number
) => {

    const [{ maxSubPower, contestType }, userSubmissions] = await Promise.all([
        computeMaxSubmissionPower(user, contestId),
        fetchUserSubmissions(user, contestId)
    ]);

    const userSubCount = userSubmissions.length;
    const remainingSubPower = maxSubPower === 0 ? 0 : maxSubPower - userSubCount;
    return {
        contestType,
        userSubmissions,
        remainingSubPower,
        maxSubPower
    }
}



export const submit = async (
    user: { address: string },
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
        const submissionId = await uploadSubmission(user, contestId, cleanPayload, contestType);

        return {
            success: true,
            userSubmissionParams: {
                userSubmissions: [...userSubmissions, { id: submissionId, ...cleanPayload }],
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