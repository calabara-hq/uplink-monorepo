export type ContestBuilderProps = {
    startTime: Date;
    voteTime: Date;
    endTime: Date;
}

export type ContestBuilderErrors = {
    startTime: string | null;
    voteTime: string | null;
    endTime: string | null;
}

export const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "setStartTime":
            return {
                ...state,
                startTime: action.payload,
                errors: { ...state.errors, startTime: null },
            };
        case "setVoteTime":
            return {
                ...state,
                voteTime: action.payload,
                errors: { ...state.errors, voteTime: null },
            };
        case "setEndTime":
            return {
                ...state,
                endTime: action.payload,
                errors: { ...state.errors, endTime: null },
            };
        default:
            return state;
    }
}