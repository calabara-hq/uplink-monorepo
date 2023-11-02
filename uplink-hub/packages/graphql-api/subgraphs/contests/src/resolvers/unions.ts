const unions = {
    SubmitterRewardOption: {
        __resolveType: (obj: any) => {
            if (obj.tokenReward) return 'SubmitterTokenReward'
            return null
        }
    },

    SubmitterTokenRewardOption: {
        __resolveType: (obj: any) => {
            if (obj.amount) return 'FungibleReward'
            if (obj.tokenId) return 'NonFungibleReward'
            return null
        }
    },

    VoterRewardOption: {
        __resolveType: (obj: any) => {
            if (obj.tokenReward) return 'VoterTokenReward'
            return null
        }
    },

    VoterTokenRewardOption: {
        __resolveType: (obj: any) => {
            if (obj.amount) return 'FungibleReward'
            return null
        }
    },

    SubmitterRestriction: {
        __resolveType: (obj: any) => {
            if (obj.restrictionType === "token") return 'TokenRestrictionOption'
            return null
        }
    },

    VotingStrategy: {
        __resolveType: (obj: any) => {
            if (obj.strategyType === "arcade") return 'ArcadeVotingStrategyOption'
            if (obj.strategyType === "weighted") return 'WeightedVotingStrategyOption'
            return null
        }
    }
}

export default unions;