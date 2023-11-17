import { User } from "@/types/user";
import handleNotFound from "../handleNotFound";


const fetchUser = async (userIdentifier: string): Promise<User> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
            query User($userIdentifier: String!) {
                user(userIdentifier: $userIdentifier) {
                  id
                  displayName
                  userName
                  address
                  profileAvatar
                  twitterHandle
                  visibleTwitter
                }
            }`,
            variables: {
                userIdentifier,
            },
        }),
        next: { tags: [`user/${userIdentifier}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.user)
        .then(handleNotFound);
    return data;
};

export default fetchUser;