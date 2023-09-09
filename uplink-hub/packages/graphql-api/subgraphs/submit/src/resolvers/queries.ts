import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { computeSubmissionParams } from "../utils/submit.js";
import { AuthorizationController, schema, Decimal } from "lib";
import dotenv from 'dotenv'
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);



// include the contest object so we can filter fields that may need to be hidden (votes, author)
const singleSubmissionById = db.query.submissions.findFirst({
    where: (submission) => sqlOps.eq(submission.id, sqlOps.placeholder('submissionId')),
    with: {
        votes: true,
        contest: true
    }
}).prepare();

// we don't need to include the contest object here because the reference to the fields we need 
// (additional params, deadlines)  is resolved by the schema
const submissionsByContestId = db.query.submissions.findMany({
    where: (submission) => sqlOps.eq(submission.contestId, sqlOps.placeholder('contestId')),
    with: {
        votes: true,
    }
}).prepare();



const getRewards = db.query.rewards.findMany({
    where: (reward) => sqlOps.eq(reward.contestId, sqlOps.placeholder('contestId')),
    with: {
        tokenReward: {
            with: {
                token: true,
            }
        }
    }
}).prepare();


// take a random sample of 20 submissions that recieved more than 5 vote instances (not vote amount)
// TODO: this can be converted to a relational query
const getPopularSubmissions = async () => {


    // get submissions that recieved more than 5 unique vote instances (not vote amount)
    const submissionIds = await db.select({
        submissionId: schema.votes.submissionId,
    }).from(schema.votes)
        .groupBy(schema.votes.submissionId)
        //.having(sqlOps.gt(sqlOps.sql<number>`count(*)`, 2))
        .then(res => res.map(el => el.submissionId))



    if (submissionIds.length > 0) {
        // extract the details only for submissions in which the contest has ended, and take a random sample of 20
        const submissions = await db.select({
            id: schema.submissions.id,
            created: schema.submissions.created,
            type: schema.submissions.type,
            contestId: schema.submissions.contestId,
            author: schema.submissions.author,
            url: schema.submissions.url,
            version: schema.submissions.version,
            contestCategory: schema.contests.category,
            spaceName: schema.spaces.name,
            spaceDisplayName: schema.spaces.displayName,
        }).from(schema.submissions)
            .leftJoin(schema.contests, sqlOps.eq(schema.submissions.contestId, schema.contests.id))
            .leftJoin(schema.spaces, sqlOps.eq(schema.contests.spaceId, schema.spaces.id))
            .where(sqlOps.and(
                sqlOps.inArray(schema.submissions.id, submissionIds),
                sqlOps.lt(schema.contests.endTime, new Date().toISOString())
            ))
            //.orderBy(schema.submissions.created, 'desc')
            .limit(10)

        return submissions;
    } else {
        return [];
    }
}


const postProcessSubmission = (submission, withAuthor: boolean, withVotes: boolean) => {
    // sum the votes and set a new field called "totalVotes"
    submission.totalVotes = withVotes ? submission.votes.reduce((acc: Decimal, vote: { amount: string }) => acc.plus(new Decimal(vote.amount)), new Decimal(0)) : null;
    !withAuthor && delete submission.author;
    return submission;
}



const postProcessRewards = (rewards) => {
    // split rewards into submitter and voter rewards
    const submitterRewards = [];
    const voterRewards = [];
    for (const reward of rewards) {
        const newReward = {
            ...reward,
            tokenReward: {
                ...reward.tokenReward,
                amount: new Decimal(reward.tokenReward.amount)
            }
        };
        if (reward.recipient === 'submitter') {
            submitterRewards.push(newReward);
        } else if (reward.recipient === 'voter') {
            voterRewards.push(newReward);
        }
    }

    return {
        submitterRewards,
        voterRewards
    }
}


const sortSubmissions = (submissions, isContestOver: boolean) => {

    // randomize the order of the submissions if the contest is still ongoing
    if (!isContestOver) return submissions.sort(() => Math.random() - 0.5);

    // contest is over, sort by total votes.
    return submissions.sort((a, b) => {
        const diff = b.totalVotes.minus(a.totalVotes)
        // if there is a tie, give the submission with more unique voters the higher rank.
        if (diff.equals(new Decimal(0))) {
            const voteCountDiff = b.votes.length - a.votes.length;
            // if there is still a tie, give the submission that was submitted first the higher rank.
            if (voteCountDiff === 0) {
                return a.created - b.created;
            }
            return voteCountDiff;
        }
        return diff.toNumber();
    })

}


const queries = {
    Query: {
        async getUserSubmissionParams(_, { walletAddress, contestId }, contextValue, info) {

            const user = walletAddress ? { address: walletAddress } : await authController.getUser(contextValue);
            if (!user) throw new GraphQLError('Unknown user', {
                extensions: {
                    code: 'UNKOWN_USER'
                }
            })
            return computeSubmissionParams(user, parseInt(contestId))
        },

        async submission(_, { submissionId }, contextValue, info) {
            // determine if we need to filter out some of the hidden fields
            const data = await singleSubmissionById.execute({ submissionId })
            const { endTime, anonSubs, visibleVotes } = data.contest;
            const withAuthor = !anonSubs || endTime < new Date().toISOString();
            const withVotes = visibleVotes || endTime < new Date().toISOString();
            return postProcessSubmission(data, withAuthor, withVotes);
        },

        async popularSubmissions(_, { submissionId }, contextValue, info) {
            return getPopularSubmissions();
        },
    },

    Contest: {
        async submissions(contest) {
            // here we'll pluck out the deadlines for the contest to determine which fields are private
            const { deadlines, additionalParams } = contest;
            const { endTime } = deadlines;
            const { anonSubs, visibleVotes } = additionalParams;
            const isContestOver = endTime < new Date().toISOString();
            const withAuthor = !anonSubs || isContestOver;
            const withVotes = visibleVotes || isContestOver;

            const promise_submissions = submissionsByContestId.execute({ contestId: contest.id })
                .then(async (submissions) => {
                    return await Promise.all(submissions.map((submission) => postProcessSubmission(submission, withAuthor, withVotes)))
                });


            const promise_rewards = isContestOver ? getRewards.execute({ contestId: contest.id }).then(postProcessRewards) : { submitterRewards: [], voterRewards: [] }

            const [submissions, { submitterRewards }] = await Promise.all([promise_submissions, promise_rewards])

            if(submissions.length === 0) return submissions;

            // at this point, submissions are ranked by total votes and we know the reward ranks.
            // we'll add a field to the submissions called "rank" which is the reward rank.
            // if a submission did not recieve a reward, it will not have a rank.
            // then, we'll sort the submissions by rank.


            // assign reward ranks to submissions
            submitterRewards.forEach((reward, idx) => {
                submissions[reward.rank - 1].rank = idx + 1;
            });

            // sort submissions by reward rank
            const sortedSubmissions = isContestOver ? submissions.sort((a, b) => {
                return b?.rank ?? 0 - a?.rank ?? 0;
            }) : submissions;

            return sortedSubmissions;
        },

        async gnosisResults(contest) {
            if (!contest) return null;
            const { deadlines } = contest;
            const { endTime } = deadlines;
            const isContestOver = endTime < new Date().toISOString();
            if (!isContestOver) return null;

            const promise_submissions = isContestOver ? submissionsByContestId.execute({ contestId: contest.id })
                .then(async (submissions) => {
                    return await Promise.all(submissions.map((submission) => postProcessSubmission(submission, true, true)))
                }) : [];

            const promise_rewards = getRewards.execute({ contestId: contest.id }).then(postProcessRewards)

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
                            winner.votes.forEach((vote, idx) => {
                                const decRewardAmount = new Decimal(reward.tokenReward.amount);
                                const decVoteAmount = new Decimal(vote.amount);
                                const decTotalVotes = new Decimal(winner.totalVotes);
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
        async utopiaResults(contest) {
            if (!contest) return null;
            const { deadlines } = contest;
            const { endTime } = deadlines;
            const isContestOver = endTime < new Date().toISOString();
            if (!isContestOver) return null;

            const promise_submissions = isContestOver ? submissionsByContestId.execute({ contestId: contest.id })
                .then(async (submissions) => {
                    return await Promise.all(submissions.map((submission) => postProcessSubmission(submission, true, true)))
                }) : [];

            const promise_rewards = getRewards.execute({ contestId: contest.id }).then(postProcessRewards)

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
                            winner.votes.forEach((vote, idx) => {
                                const decRewardAmount = new Decimal(reward.tokenReward.amount);
                                const decVoteAmount = new Decimal(vote.amount);
                                const decTotalVotes = new Decimal(winner.totalVotes);
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