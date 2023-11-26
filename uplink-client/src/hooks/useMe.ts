import handleNotFound from "@/lib/handleNotFound";
import { useSession } from "@/providers/SessionProvider";
import { BaseSubmission, Submission } from "@/types/submission";
import { User } from "@/types/user";
import useSWR, { useSWRConfig } from "swr";

const fetchMe = async (csrfToken: string) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
            query: `
                query Me {
                    me {
                    id
                    address
                    displayName
                    profileAvatar
                    submissions {
                        id
                        contestId
                        type
                        version
                        url
                        nftDrop {
                            chainId
                            contractAddress
                            dropConfig
                        }
                        author {
                            address
                            id
                        }
                    }
                    twitterAvatar
                    twitterHandle
                    userName
                    visibleTwitter
                    }
                }`,
        }),
    })
        .then((res) => res.json())
        .then((res) => res.data.me)
        .then(handleNotFound)
        .then(async (res) => {
            const subData = await Promise.all(
                res.submissions.map(async (submission: BaseSubmission) => {
                    const data: Submission = await fetch(submission.url).then((res) => res.json());
                    return { ...submission, data: data, author: { id: res.id, address: res.address } };
                })
            );
            return {
                ...res,
                submissions: subData
            }
        });
    return data;

};




const useMe = (accountAddress: string) => {
    const { data: session, status } = useSession();
    const { fallback } = useSWRConfig()

    const isAuthed = status === "authenticated" && accountAddress === session?.user?.address
    const meParamsSwrKey = isAuthed ? `me/${accountAddress}` : null

    const {
        data,
        isLoading: isMeLoading,
        error: isMeError,
    }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWR(
        meParamsSwrKey,
        () => fetchMe(session.csrfToken),
    );


    const getCachedFallback = () => {
        return fallback[`me/${accountAddress}`];
    }

    return {
        me: meParamsSwrKey ? data : getCachedFallback(),
        getFallbackData: () => getCachedFallback(),
        isUserAuthorized: isAuthed,
        isMeLoading,
        isMeError,
    }
}


export default useMe;