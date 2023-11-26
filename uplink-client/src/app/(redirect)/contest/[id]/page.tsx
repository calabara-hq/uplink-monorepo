import fetchContest from "@/lib/fetch/fetchContest";
import { redirect } from "next/navigation";


// redirect to correct contest page given just the contest ID

export default async function Page({ params }: { params: { id: string } }) {
    const data = await fetchContest(params.id);
    redirect(`/${data.space.name}/contest/${params.id}`)
}

