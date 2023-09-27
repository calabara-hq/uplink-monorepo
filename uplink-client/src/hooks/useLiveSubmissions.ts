import fetchSubmissions from "@/lib/fetch/fetchSubmissions";
import useSWR from "swr";
import { mutateSubmissions } from "@/app/mutate";

const useLiveSubmissions = (contestId: string) => {
    const {
        data: liveSubmissions,
        isLoading: areSubmissionsLoading,
        error: isSubmissionError,
        mutate: mutateSWRSubmissions,
    }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWR(
        `submissions/${contestId}`,
        () => fetchSubmissions(contestId),
        { refreshInterval: 10000 }
    );

    const mutateLiveSubmissions = () => {
        mutateSWRSubmissions(); // mutate the SWR cache
        mutateSubmissions(contestId); // mutate the server cache
    };

    return {
        liveSubmissions,
        areSubmissionsLoading,
        isSubmissionError,
        mutateLiveSubmissions,
    }
}


export default useLiveSubmissions;