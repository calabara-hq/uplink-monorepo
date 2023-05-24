import { db, sqlOps } from "../utils/database.js";
import { schema, Decimal, computeUserTokenBalance } from "lib";
import { getCacheValue, setCacheValue } from "./cache.js";
import { GraphQLError } from "graphql";
// return the contest deadlines and additional params
export const fetchContestParameters = async (contestId: number) => {
    const contestParameters = await db.select({
        subLimit: schema.contests.subLimit,
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
        .where(sqlOps.and(sqlOps.eq(schema.submissions.contestId, contestId), sqlOps.eq(schema.submissions.author, user)));

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

// insert a submission into the database
export const insertSubmission = async (
    user: { address: string },
    contestId: number,
    submission: any
) => { };


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
        const userBalance = await computeUserTokenBalance({ token, snapshot, walletAddress: user.address });
        if (userBalance > threshold) return true;
        return false;
    }));
    return restrictionResults.some((result) => result === true);
}

// compute the max submission power for a user
export const computeMaxSubmissionPower = async (
    user: { address: string },
    contestId: number,
) => {

    const [cachedMaxSubPower, contestParameters] = await Promise.all([
        getCacheTotalSubPower(user, contestId),
        fetchContestParameters(contestId)
    ])

    const { subLimit, deadlines } = contestParameters;

    if (cachedMaxSubPower !== null) return deadlineAdjustedSubmittingPower(cachedMaxSubPower, deadlines);

    else {

        // when there is no subLimit, set max subs per user to 10
        const maxSubPower = subLimit === 0 ? 10 : subLimit;
        const submitterRestrictions = await fetchSubmitterRestrictions(contestId);

        if (submitterRestrictions.length === 0) return deadlineAdjustedSubmittingPower(maxSubPower, deadlines);

        const userRestrictionResult = await restrictionWalletCheck(user, deadlines.snapshot, submitterRestrictions);
        const restrictionAdjustedSubPower = userRestrictionResult ? maxSubPower : 0;
        await setCacheTotalSubPower(user, contestId, restrictionAdjustedSubPower);
        return deadlineAdjustedSubmittingPower(restrictionAdjustedSubPower, deadlines);
    }

};

// compute the reamaining submission power for a user
export const computeSubmissionParams = async (
    user: { address: string },
    contestId: number
) => {

    const [maxSubPower, userSubmissions] = await Promise.all([
        computeMaxSubmissionPower(user, contestId),
        fetchUserSubmissions(user, contestId)
    ]);

    const userSubCount = userSubmissions.length;
    const remainingSubPower = maxSubPower === 0 ? 0 : maxSubPower - userSubCount;
    return {
        userSubmissions,
        remainingSubPower,
        maxSubPower
    }
}



export const submit = async (
    user: { address: string },
    contestId: number,
    submission: any // TODO: define submission type
) => {

    const { maxSubPower, remainingSubPower, userSubmissions } = await computeSubmissionParams(user, contestId);

    if (remainingSubPower === 0) throw new GraphQLError('No entries remaining', {
        extensions: {
            code: 'ENTRY_LIMIT_REACHED'
        }
    });

    await insertSubmission(user, contestId, submission);

    return {
        userSubmissions: [...userSubmissions, submission],
        remainingSubPower: remainingSubPower - 1,
        maxSubPower
    }
}