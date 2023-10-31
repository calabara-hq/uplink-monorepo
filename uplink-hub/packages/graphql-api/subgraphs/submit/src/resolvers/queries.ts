import { sqlOps, db, dbSingleSubmissionById, dbGetPopularSubmissions, dbSubmissionsByContestId, dbGetRewards } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { AuthorizationController, schema, Decimal, Context } from "lib";
import type { Contest, Submission } from "../__generated__/resolvers-types.js";
import dotenv from 'dotenv'
import { computeSubmissionParams } from "../utils/insert.js";
import { dbVoteType } from "lib/dist/drizzle/schema.js";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL!);

type ProcessedSubmission = Omit<schema.dbSubmissionType, 'author'> & {
    totalVotes: Decimal | null,
    author: string | null,
}

const postProcessSubmission = (submission: schema.dbSubmissionType, withAuthor: boolean, withVotes: boolean): ProcessedSubmission => {
    // sum the votes and set a new field called "totalVotes"
    // conditionally include the author field

    return {
        ...submission,
        totalVotes: withVotes ? submission.votes.reduce((acc: Decimal, vote: { amount: string }) => acc.plus(new Decimal(vote.amount)), new Decimal(0)) : null,
        author: withAuthor ? submission.author : null
    }
}

type ProcessedRewards = {
    submitterRewards: Array<schema.dbRewardType>,
    voterRewards: Array<schema.dbRewardType>,
}

const postProcessRewards = (rewards: Array<schema.dbRewardType>): ProcessedRewards => {
    // split rewards into submitter and voter rewards
    const submitterRewards = [];
    const voterRewards = [];
    for (const reward of rewards) {
        if (reward.recipient === 'submitter') {
            submitterRewards.push(reward);
        } else if (reward.recipient === 'voter') {
            voterRewards.push(reward);
        }
    }

    return {
        submitterRewards,
        voterRewards
    }
}


const sortSubmissions = (submissions: Array<ProcessedSubmission>, isContestOver: boolean) => {

    // if contest is not over, return as is
    if (!isContestOver) return submissions

    // contest is over, sort by total votes.
    return submissions.sort((a, b) => {
        if (!a.totalVotes || !b.totalVotes) return 0;
        const diff = b.totalVotes.minus(a.totalVotes)
        // if there is a tie, give the submission with more unique voters the higher rank.
        if (diff.equals(new Decimal(0))) {
            const voteCountDiff = b.votes.length - a.votes.length;
            // if there is still a tie, give the submission that was submitted first the higher rank.
            if (voteCountDiff === 0) {
                return Date.parse(a.created) - Date.parse(b.created);
            }
            return voteCountDiff;
        }
        return diff.toNumber();
    })

}

type RankedSubmission = ProcessedSubmission & {
    rank: number | null
}

const rankSubmissions = (submissions: Array<ProcessedSubmission>, submitterRewards: ProcessedRewards['submitterRewards']): Array<RankedSubmission> => {
    // assign reward ranks to submissions

    // "fill" the submissions array with null ranks
    let rankedSubmissions: Array<RankedSubmission> = submissions.map((submission) => {
        return {
            ...submission,
            rank: null
        }
    })

    // assign ranks to submissions based on reward ranks
    submitterRewards.forEach((reward: schema.dbRewardType, idx) => {
        rankedSubmissions[reward.rank - 1] ? rankedSubmissions[reward.rank - 1].rank = idx + 1 : null;
    });

    return rankedSubmissions;
}

const queries = {
    Query: {
        async getUserSubmissionParams(_: any, { contestId }: { contestId: string }, context: Context) {

            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unknown user', {
                extensions: {
                    code: 'UNKOWN_USER'
                }
            })
            return computeSubmissionParams(user, parseInt(contestId))
        },

        async submission(_: any, { submissionId }: { submissionId: string }) {
            // determine if we need to filter out some of the hidden fields
            const data = await dbSingleSubmissionById(parseInt(submissionId));
            const { endTime, anonSubs, visibleVotes } = data.contest;
            const withAuthor = !anonSubs || endTime < new Date().toISOString();
            const withVotes = Boolean(visibleVotes) || endTime < new Date().toISOString();
            return postProcessSubmission(data, withAuthor, withVotes);
        },

        async popularSubmissions(_: any, { submissionId }: { submissionId: string }) {
            return dbGetPopularSubmissions();
        },
    },

    Contest: {
        async submissions(contest: Contest) {
            // here we'll pluck out the deadlines for the contest to determine which fields are private
            const { deadlines, additionalParams } = contest;
            const { endTime } = deadlines;
            const { anonSubs, visibleVotes } = additionalParams;
            const isContestOver = endTime < new Date().toISOString();
            const withAuthor = !anonSubs || isContestOver;
            const withVotes = visibleVotes || isContestOver;

            const promise_submissions: Promise<Array<ProcessedSubmission>> = dbSubmissionsByContestId(parseInt(contest.id))
                .then(async (submissions: Array<schema.dbSubmissionType>) => {
                    return await Promise.all(submissions.map((submission) => postProcessSubmission(submission, withAuthor, withVotes)))
                })
                .then((submissions: Array<ProcessedSubmission>) => sortSubmissions(submissions, isContestOver))


            const promise_rewards: Promise<ProcessedRewards> | ProcessedRewards = isContestOver ? dbGetRewards(parseInt(contest.id)).then(postProcessRewards) : { submitterRewards: [], voterRewards: [] }

            const [submissions, { submitterRewards }] = await Promise.all([promise_submissions, promise_rewards])


            if (submissions.length === 0) return submissions;

            // at this point, submissions are ranked by total votes and we know the reward ranks.
            // we'll add a field to the submissions called "rank" which is the reward rank.
            // if a submission did not recieve a reward, it will not have a rank.
            // then, we'll sort the submissions by rank.

            const rankedSubmissions = rankSubmissions(submissions, submitterRewards);

            // sort submissions by reward rank
            const sortedSubmissions = isContestOver ? rankedSubmissions.sort((a, b) => {
                if (!a.rank || !b.rank) return 0;
                return a.rank - b.rank;
            }) : submissions;

            return sortedSubmissions;
        },

        async gnosisResults(contest: Contest) {
            if (!contest) return null;
            const { deadlines } = contest;
            const { endTime } = deadlines;
            const isContestOver = endTime < new Date().toISOString();
            if (!isContestOver) return null;

            const promise_submissions = isContestOver ? dbSubmissionsByContestId(parseInt(contest.id))
                .then(async (submissions: Array<schema.dbSubmissionType>) => {
                    return await Promise.all(submissions.map((submission) => postProcessSubmission(submission, true, true)))
                }) : [];

            const promise_rewards = dbGetRewards(parseInt(contest.id)).then(postProcessRewards)

            const [submissions, { submitterRewards, voterRewards }] = await Promise.all([promise_submissions, promise_rewards])

            let csvContent = "data:text/csv;charset=utf-8,token_type,token_address,receiver,amount,id\r\n"

            try {
                submitterRewards.forEach((reward, idx) => {
                    const winner = submissions[reward.rank - 1];
                    if (winner) { // in case rewards.length > winners.length
                        switch (reward.tokenReward.token.type) {
                            case 'ETH':
                                csvContent += `native,,${winner.author},${reward.tokenReward.amount},\r\n`;
                                break;
                            case 'ERC20':
                                csvContent += `erc20,${reward.tokenReward.token.address},${winner.author},${reward.tokenReward.amount},\r\n`;
                                break;
                            case 'ERC721':
                                csvContent += `nft,${reward.tokenReward.token.address},${winner.author},,${reward.tokenReward.token.tokenId},\r\n`;
                                break;
                            case 'ERC1155':
                                csvContent += `nft,${reward.tokenReward.token.address},${winner.author},${reward.tokenReward.amount},${reward.tokenReward.token.tokenId},\r\n`;
                                break;
                        }
                    }

                    voterRewards.forEach((reward, idx) => {
                        const winner = submissions[reward.rank - 1];
                        if (winner) { // in case rewards.length > winners.length
                            winner.votes.forEach((vote: schema.dbVoteType) => {
                                const decRewardAmount = new Decimal(reward.tokenReward.amount ?? 0); // TODO: better typing solves this
                                const decVoteAmount = new Decimal(vote.amount);
                                const decTotalVotes = new Decimal(winner.totalVotes ?? 1); // TODO: better typing solves this
                                const voterShare = decRewardAmount.mul(decVoteAmount.div(decTotalVotes)).toString();
                                switch (reward.tokenReward.token.type) {
                                    case 'ETH':
                                        csvContent += `native,,${vote.voter},${voterShare},\r\n`;
                                        break;
                                    case 'ERC20':
                                        csvContent += `erc20,${reward.tokenReward.token.address},${vote.voter},${voterShare},\r\n`;
                                        break;
                                }
                            })
                        }
                    })
                })

            } catch (e) {
                return "";
            }

            return csvContent;
        },
        async utopiaResults(contest: Contest) {
            if (!contest) return null;
            const { deadlines } = contest;
            const { endTime } = deadlines;
            const isContestOver = endTime < new Date().toISOString();
            if (!isContestOver) return null;

            const promise_submissions = isContestOver ? dbSubmissionsByContestId(parseInt(contest.id))
                .then(async (submissions: Array<schema.dbSubmissionType>) => {
                    return await Promise.all(submissions.map((submission) => postProcessSubmission(submission, true, true)))
                }) : [];

            const promise_rewards = dbGetRewards(parseInt(contest.id)).then(postProcessRewards)

            const [submissions, { submitterRewards, voterRewards }] = await Promise.all([promise_submissions, promise_rewards])

            let csvContent = "data:text/csv;charset=utf-8,name,wallet,amount,Pay-out token\r\n";

            try {
                submitterRewards.forEach((reward, idx) => {
                    const winner = submissions[reward.rank - 1];
                    if (winner) { // in case rewards.length > winners.length
                        switch (reward.tokenReward.token.type) {
                            case 'ETH':
                                csvContent += `submitter reward,${winner.author},${reward.tokenReward.amount},ETH\r\n`;
                                break;
                            case 'ERC20':
                                csvContent += `submitter reward,${winner.author},${reward.tokenReward.amount},${reward.tokenReward.token.symbol}\r\n`;
                                break;
                        }
                    }

                    voterRewards.forEach((reward, idx) => {
                        const winner = submissions[reward.rank - 1];
                        if (winner) { // in case rewards.length > winners.length
                            winner.votes.forEach((vote: schema.dbVoteType) => {
                                const decRewardAmount = new Decimal(reward.tokenReward.amount ?? 0);
                                const decVoteAmount = new Decimal(vote.amount);
                                const decTotalVotes = new Decimal(winner.totalVotes ?? 1);
                                const voterShare = decRewardAmount.mul(decVoteAmount.div(decTotalVotes)).toString();
                                switch (reward.tokenReward.token.type) {
                                    case 'ETH':
                                        csvContent += `voter reward,${vote.voter},${voterShare},ETH,\r\n`;
                                        break;
                                    case 'ERC20':
                                        csvContent += `voter reward,${vote.voter}, ${voterShare},${reward.tokenReward.token.symbol}\r\n`;
                                        break;
                                }
                            })
                        }
                    })
                })

            } catch (e) {
                return "";
            }

            return csvContent;
        }
    }

};

export default queries