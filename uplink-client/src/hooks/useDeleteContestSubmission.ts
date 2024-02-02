import useSWRMutation from "swr/mutation";
import useLiveSubmissions from './useLiveSubmissions';
import toast from "react-hot-toast";
import { handleMutationError } from "@/lib/handleMutationError";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from 'next/navigation';


const deleteContestSubmission = async (url, { arg }: {
    url: string;
    arg: {
        csrfToken: string;
        submissionId: string
        contestId: string;
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
                mutation DeleteContestSubmission($submissionId: ID!, $contestId: ID!) {
                    deleteContestSubmission(submissionId: $submissionId, contestId: $contestId) {
                        success
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                submissionId: arg.submissionId,
                contestId: arg.contestId,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.deleteContestSubmission);
}



export const useDeleteContestSubmission = (contestId: string) => {
    const { data: session, status } = useSession();
    const { mutateLiveSubmissions } = useLiveSubmissions(contestId);

    const { trigger: triggerDeleteContestSubmission, error, isMutating: isDeleteContestSubmissionMutating, reset: resetDeleteContestSubmission } = useSWRMutation(
        `/api/deleteContestSubmission`,
        deleteContestSubmission,
        {
            onError: (err) => {
                console.log(err);
                toast.error(
                    "Oops, something went wrong. Please check the fields and try again."
                );
                resetDeleteContestSubmission();
            },
        }
    );



    const handleDeleteContestSubmission = async (submissionId: string, onSuccess: () => void) => {
        try {
            await triggerDeleteContestSubmission({
                submissionId,
                contestId,
                csrfToken: session.csrfToken
            }).then(({ success }) => {
                if (success) {
                    mutateLiveSubmissions();
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
            resetDeleteContestSubmission();
        }
    }

    return {
        handleDeleteContestSubmission
    }
}