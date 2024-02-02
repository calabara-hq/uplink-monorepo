import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { handleMutationError } from "@/lib/handleMutationError";
import { useSession } from "@/providers/SessionProvider";


const deleteMintboardPost = async (url, { arg }: {
    url: string;
    arg: {
        csrfToken: string;
        postId: string
        spaceId: string;
    }
}
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation DeleteMintboardPost($postId: ID!, $spaceId: ID!) {
                    deleteMintboardPost(postId: $postId, spaceId: $spaceId) {
                        success
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                postId: arg.postId,
                spaceId: arg.spaceId,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.deleteMintboardPost);
}



export const useDeleteMintboardPost = (onSuccess: () => void) => {
    const { data: session, status } = useSession();

    const { trigger: triggerDeleteMintboardPost, error, isMutating: isDeleteMintboardPostMutating, reset: resetDeleteMintboardPost } = useSWRMutation(
        `/api/deleteMintboardPost`,
        deleteMintboardPost,
        {
            onError: (err) => {
                console.log(err);
                toast.error(
                    "Oops, something went wrong. Please check the fields and try again."
                );
                resetDeleteMintboardPost();
            },
        }
    );



    const handleDeleteMintboardPost = async (postId: string, spaceId: string) => {
        try {
            await triggerDeleteMintboardPost({
                postId,
                spaceId,
                csrfToken: session.csrfToken
            }).then(({ success }) => {
                if (success) {
                    toast.success("Post successfully deleted", { icon: "🚀" });
                    onSuccess();
                } else {
                    // set the errors
                    toast.error(
                        "Oops, something went wrong. Please try again later."
                    );
                }
            });
        } catch (e) {
            resetDeleteMintboardPost();
        }
    }

    return {
        handleDeleteMintboardPost
    }
}