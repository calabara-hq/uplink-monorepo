import { User } from "@/types/user";
import handleNotFound from "../handleNotFound";
import { BaseSubmission, Submission } from "@/types/submission";


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
                  submissions {
                    id
                    contestId
                    type
                    version
                    url
                    author {
                        id
                        address
                        displayName
                        userName
                        profileAvatar
                    }
                    edition {
                        id
                        chainId
                        contractAddress
                        name
                        symbol
                        editionSize
                        royaltyBPS
                        fundsRecipient
                        defaultAdmin
                        saleConfig {
                            publicSalePrice
                            maxSalePurchasePerAddress
                            publicSaleStart
                            publicSaleEnd
                            presaleStart
                            presaleEnd
                            presaleMerkleRoot
                        }
                        description
                        animationURI
                        imageURI
                        referrer
                    }
                  }
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
        .then(handleNotFound)
        .then(async (res) => {
            const subData = await Promise.all(
                res.submissions.map(async (submission: BaseSubmission) => {
                    const data: Submission = await fetch(submission.url).then((res) => res.json());
                    return { ...submission, data: data };
                })
            );
            return {
                ...res,
                submissions: subData
            }
        });
    return data;
};

export default fetchUser;