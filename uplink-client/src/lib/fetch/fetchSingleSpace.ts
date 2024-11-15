import { Space } from "@/types/space";

const fetchSingleSpace = async (spaceName: string): Promise<Space> => {

  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/space?spaceName=${spaceName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": process.env.API_SECRET!,
    },
    next: { revalidate: 60, tags: [`space/${spaceName}`] },
  })

    .then(res => res.json())

  return data;
}
export default fetchSingleSpace;