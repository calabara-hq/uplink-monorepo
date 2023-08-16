import { mysqlTable, index, serial, tinyint, json, varchar, int, text, uniqueIndex } from 'drizzle-orm/mysql-core';
import { InferModel, relations } from 'drizzle-orm';

export const spaces = mysqlTable('spaces', {
    id: serial('id').primaryKey(),
    created: varchar('created', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    displayName: varchar('displayName', { length: 255 }).notNull(),
    members: int('members').notNull(),
    logoUrl: varchar('logoUrl', { length: 255 }).notNull(),
    twitter: varchar('twitter', { length: 255 }),
    website: varchar('website', { length: 255 }),
}, (spaces) => ({
    spaceNameIndex: uniqueIndex("name_idx").on(
        spaces.name
    ),
}))

export const admins = mysqlTable('admins', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    address: varchar('address', { length: 255 }).notNull(),

}, (admins) => ({
    spaceIdIndex: index("admins_space_id_idx").on(admins.spaceId),
}))


export const contests = mysqlTable('contests', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    startTime: varchar('startTime', { length: 255 }).notNull(),
    voteTime: varchar('voteTime', { length: 255 }).notNull(),
    endTime: varchar('endTime', { length: 255 }).notNull(),
    snapshot: varchar('snapshot', { length: 255 }).notNull(),
    promptUrl: varchar('promptUrl', { length: 255 }).notNull(),
    anonSubs: tinyint('anonSubs').notNull(),
    visibleVotes: tinyint('visibleVotes').notNull(),
    selfVote: tinyint('selfVote').notNull(),
    subLimit: int('subLimit').notNull(),
    tweetId: varchar('tweetId', { length: 255 }),
}, (contests) => ({
    spaceIdIndex: index("contest_space_id_idx").on(contests.spaceId),
}))


export const rewards = mysqlTable('rewards', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    rank: int('rank').notNull(),
    recipient: varchar('recipient', { length: 255 }).notNull(),
}, (rewards) => ({
    contestIdIndex: index("rewards_contest_id_idx").on(rewards.contestId),
}));


export const submitterRestrictions = mysqlTable('submitterRestrictions', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    restrictionType: varchar('restrictionType', { length: 255 }).notNull(),

}, (submitterRestriction) => ({
    submitterRestrictionContestIdIndex: index("submitterRestriction_contest_id_idx").on(submitterRestriction.contestId),
}));

export const tokens = mysqlTable('tokens', {
    id: serial('id').primaryKey(),
    tokenHash: varchar('tokenHash', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    symbol: varchar('symbol', { length: 255 }).notNull(),
    decimals: int('decimals').notNull(),
    address: varchar('address', { length: 255 }),
    tokenId: int('tokenId'),
}, (tokens) => ({
    tokenHashIndex: uniqueIndex("tokenhash_idx").on(
        tokens.tokenHash
    )
}))

export const spaceTokens = mysqlTable('spaceTokens', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    tokenLink: int('tokenLink').notNull(),
}, (spaceTokens) => ({
    spaceTokensIdIndex: uniqueIndex("spaceTokens_id_idx").on(spaceTokens.spaceId, spaceTokens.tokenLink),
}));


export const tokenRestrictions = mysqlTable('tokenRestrictions', {
    id: serial('id').primaryKey(),
    restrictionId: int('restrictionId').notNull(),
    tokenLink: int('tokenLink').notNull(),
    threshold: varchar('threshold', { length: 255 }).notNull(),
}, (tokenRestrictions) => ({
    tokenRestrictionsRestrictionIdIndex: uniqueIndex("tokenRestrictions_restriction_id_idx").on(tokenRestrictions.restrictionId),
    tokenRestrictionsTokenLinkIndex: index("tokenRestrictions_token_link_idx").on(tokenRestrictions.tokenLink),
}));

export const tokenRewards = mysqlTable('tokenRewards', {
    id: serial('id').primaryKey(),
    rewardId: int('rewardId').notNull(),
    tokenLink: int('tokenLink').notNull(),
    amount: varchar('amount', { length: 255 }),
    tokenId: int('tokenId'),
}, (tokenRewards) => ({
    tokenRewardsRewardIdIndex: uniqueIndex("tokenRewards_reward_id_idx").on(tokenRewards.rewardId),
    tokenRewardsTokenLinkIndex: index("tokenRewards_token_link_idx").on(tokenRewards.tokenLink),
}));

export const votingPolicy = mysqlTable('votingPolicy', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    strategyType: varchar('strategyType', { length: 255 }).notNull(),
}, (votingPolicy) => ({
    votingPolicyContestIdIndex: index("votingPolicy_contest_id_idx").on(votingPolicy.contestId),
}));

export const weightedVotingStrategy = mysqlTable('weightedVotingStrategy', {
    id: serial('id').primaryKey(),
    votingPolicyId: int('votingPolicyId').notNull(),
    tokenLink: int('tokenLink').notNull(),
}, (weightedVotingStrategy) => ({
    weightedVotingStrategyVotingPolicyIdIndex: uniqueIndex("weightedVotingStrategy_voting_policy_id_idx").on(weightedVotingStrategy.votingPolicyId),
    weightedVotingStrategyTokenLinkIndex: index("weightedVotingStrategy_token_link_idx").on(weightedVotingStrategy.tokenLink),
}));

export const arcadeVotingStrategy = mysqlTable('arcadeVotingStrategy', {
    id: serial('id').primaryKey(),
    votingPolicyId: int('votingPolicyId').notNull(),
    tokenLink: int('tokenLink').notNull(),
    votingPower: varchar('votingPower', { length: 255 }).notNull(),
}, (arcadeVotingStrategy) => ({
    arcadeVotingStrategyVotingPolicyIdIndex: uniqueIndex("arcadeVotingStrategy_voting_policy_id_idx").on(arcadeVotingStrategy.votingPolicyId),
    arcadeVotingStrategyTokenLinkIndex: index("arcadeVotingStrategy_token_link_idx").on(arcadeVotingStrategy.tokenLink),
}));

export const submissions = mysqlTable('submissions', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    author: varchar('author', { length: 255 }).notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    url: varchar('url', { length: 255 }).notNull(),
    version: varchar('version', { length: 255 }).notNull(),
}, (submissions) => ({
    submissionsContestIdIndex: index("submissions_contest_id_idx").on(submissions.contestId),
    submissionsAuthorIndex: index("submissions_author_idx").on(submissions.author),
}));

export const votes = mysqlTable('votes', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    submissionId: int('submissionId').notNull(),
    voter: varchar('voter', { length: 255 }).notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    amount: varchar('amount', { length: 255 }).notNull()
}, (votes) => ({
    votesContestIdIndex: index("votes_contest_id_idx").on(votes.contestId),
    votesSubmissionIdIndex: index("votes_submission_id_idx").on(votes.submissionId),
    votesVoterIndex: index("votes_voter_idx").on(votes.voter),
    votesUniqueIndex: uniqueIndex("votes_unique_idx").on(votes.contestId, votes.submissionId, votes.voter),
}));


// upload media and send tweets

export const tweetQueue = mysqlTable('tweetQueue', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    author: varchar('author', { length: 255 }).notNull(),
    jobContext: varchar('jobContext', { length: 255 }).notNull(),   // 'submission' or 'contest'
    payload: json('payload').notNull().default('[]'),
    accessToken: varchar('accessToken', { length: 255 }).notNull(),
    accessSecret: varchar('accessSecret', { length: 255 }).notNull(),
    retries: int('retries').notNull(),
    status: tinyint('status').notNull(),                        // 0 = pending, 1 = failed, 2 = success
    error: json('error'),

});

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 255 }).notNull(),
}, (user) => ({
    userAddressIndex: uniqueIndex("user_address_idx").on(user.address)
}));


export const spacesRelations = relations(spaces, ({ many }) => ({
    admins: many(admins),
    spaceTokens: many(spaceTokens)
}));

export const adminsRelations = relations(admins, ({ one }) => ({
    space: one(spaces, {
        fields: [admins.spaceId],
        references: [spaces.id]
    })
}));

export const contestsRelations = relations(contests, ({ many }) => ({
    rewards: many(rewards),
    submitterRestrictions: many(submitterRestrictions),
    votingPolicy: many(votingPolicy),
    submissions: many(submissions),
    scheduledTweets: many(tweetQueue),
}));

export const rewardsRelations = relations(rewards, ({ one, many }) => ({
    contest: one(contests, {
        fields: [rewards.contestId],
        references: [contests.id]
    }),
    tokenReward: one(tokenRewards, {
        fields: [rewards.id],
        references: [tokenRewards.rewardId]
    })
}));

export const submitterRestrictionsRelations = relations(submitterRestrictions, ({ one }) => ({
    contest: one(contests, {
        fields: [submitterRestrictions.contestId],
        references: [contests.id]
    }),
    tokenRestriction: one(tokenRestrictions, {
        fields: [submitterRestrictions.id],
        references: [tokenRestrictions.restrictionId]
    })
}));



export const spaceTokensRelations = relations(spaceTokens, ({ one }) => ({
    space: one(spaces, {
        fields: [spaceTokens.spaceId],
        references: [spaces.id],
    }),
    token: one(tokens, {
        fields: [spaceTokens.tokenLink],
        references: [tokens.id],
    }),
}));

export const tokensRelations = relations(tokens, ({ many }) => ({
    spaceTokens: many(spaceTokens),
}));

export const tokenRewardsRelations = relations(tokenRewards, ({ one }) => ({
    reward: one(rewards, {
        fields: [tokenRewards.rewardId],
        references: [rewards.id],
    }),
    token: one(tokens, {
        fields: [tokenRewards.tokenLink],
        references: [tokens.id],
    }),
}));

export const tokenRestrictionsRelations = relations(tokenRestrictions, ({ one }) => ({
    submitterRestriction: one(submitterRestrictions, {
        fields: [tokenRestrictions.restrictionId],
        references: [submitterRestrictions.id],
    }),
    token: one(tokens, {
        fields: [tokenRestrictions.tokenLink],
        references: [tokens.id],
    }),
}));


export const votingPolicyRelations = relations(votingPolicy, ({ one }) => ({
    contest: one(contests, {
        fields: [votingPolicy.contestId],
        references: [contests.id],
    }),
    weightedVotingStrategy: one(weightedVotingStrategy, {
        fields: [votingPolicy.id],
        references: [weightedVotingStrategy.votingPolicyId],
    }),
    arcadeVotingStrategy: one(arcadeVotingStrategy, {
        fields: [votingPolicy.id],
        references: [arcadeVotingStrategy.votingPolicyId],
    }),
}));

export const weightedVotingStrategyRelations = relations(weightedVotingStrategy, ({ one }) => ({
    votingPolicy: one(votingPolicy, {
        fields: [weightedVotingStrategy.votingPolicyId],
        references: [votingPolicy.id],
    }),
    token: one(tokens, {
        fields: [weightedVotingStrategy.tokenLink],
        references: [tokens.id],
    }),
}));

export const arcadeVotingStrategyRelations = relations(arcadeVotingStrategy, ({ one }) => ({
    votingPolicy: one(votingPolicy, {
        fields: [arcadeVotingStrategy.votingPolicyId],
        references: [votingPolicy.id],
    }),
    token: one(tokens, {
        fields: [arcadeVotingStrategy.tokenLink],
        references: [tokens.id],
    }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
    contest: one(contests, {
        fields: [submissions.contestId],
        references: [contests.id],
    }),
    votes: one(votes, {
        fields: [submissions.id],
        references: [votes.submissionId],
    }),
}));

export const tweetQueueRelations = relations(tweetQueue, ({ one }) => ({
    contest: one(contests, {
        fields: [tweetQueue.contestId],
        references: [contests.id],
    }),
}));


export type dbSpaceType = InferModel<typeof spaces>
export type dbNewSpaceType = InferModel<typeof spaces, 'insert'>

export type dbAdminType = InferModel<typeof admins>
export type dbNewAdminType = InferModel<typeof admins, 'insert'>

export type dbContestType = InferModel<typeof contests>
export type dbNewContestType = InferModel<typeof contests, 'insert'>

export type dbRewardType = InferModel<typeof rewards>
export type dbNewRewardType = InferModel<typeof rewards, 'insert'>

export type dbSubmitterRestrictionType = InferModel<typeof submitterRestrictions>
export type dbNewSubmitterRestrictionType = InferModel<typeof submitterRestrictions, 'insert'>

export type dbTokenType = InferModel<typeof tokens>
export type dbNewTokenType = InferModel<typeof tokens, 'insert'>

export type dbSpaceToTokenType = InferModel<typeof spaceTokens>
export type dbNewSpaceToTokenType = InferModel<typeof spaceTokens, 'insert'>

export type dbTokenRestrictionType = InferModel<typeof tokenRestrictions>
export type dbNewTokenRestrictionType = InferModel<typeof tokenRestrictions, 'insert'>

export type dbTokenRewardType = InferModel<typeof tokenRewards>
export type dbNewTokenRewardType = InferModel<typeof tokenRewards, 'insert'>

export type dbVotingPolicyType = InferModel<typeof votingPolicy>
export type dbNewVotingPolicyType = InferModel<typeof votingPolicy, 'insert'>

export type dbWeightedVotingStrategyType = InferModel<typeof weightedVotingStrategy>
export type dbNewWeightedVotingStrategyType = InferModel<typeof weightedVotingStrategy, 'insert'>

export type dbArcadeVotingStrategyType = InferModel<typeof arcadeVotingStrategy>
export type dbNewArcadeVotingStrategyType = InferModel<typeof arcadeVotingStrategy, 'insert'>

export type dbSubmissionType = InferModel<typeof submissions>
export type dbNewSubmissionType = InferModel<typeof submissions, 'insert'>

export type dbVoteType = InferModel<typeof votes>
export type dbNewVoteType = InferModel<typeof votes, 'insert'>

export type dbTweetQueueType = InferModel<typeof tweetQueue>
export type dbNewTweetQueueType = InferModel<typeof tweetQueue, 'insert'>

export type dbUserType = InferModel<typeof users>
export type dbNewUserType = InferModel<typeof users, 'insert'>


