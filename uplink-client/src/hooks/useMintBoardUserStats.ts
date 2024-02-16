import { handleMutationError } from "@/lib/handleMutationError";
import { useSession } from "@/providers/SessionProvider";
import useSWR from "swr";

const fetchMintBoardUserStats = async (
    csrfToken: string,
    boardId: string
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                query MintBoardUserStats($boardId: ID!) {
                    mintBoardUserStats(boardId: $boardId) {
                        totalMints
                    }
                }`,
            variables: {
                csrfToken: csrfToken,
                boardId: boardId,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.mintBoardUserStats);
}



export const useMintBoardUserStats = (spaceName: string, boardId: string | null) => {
    const { data: session, status } = useSession();
    const key = (boardId && status === 'authenticated') ? `/api/mintBoardUserStats/${spaceName}/${session.user.address}` : null;

    const {
        data,
        isLoading,
        error,
        mutate
    }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWR(
        key,
        () => fetchMintBoardUserStats(
            session.csrfToken,
            boardId
        ), { refreshInterval: 10_000 }
    );

    return {
        data,
        isLoading,
        error,
        mutate
    }

}