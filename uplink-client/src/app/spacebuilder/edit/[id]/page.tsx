import SpaceForm from "@/ui/SpaceForm/SpaceForm";

const getSpace = async (id: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query space($id: ID!){
          space(id: $id) {
            id
            name
            displayName
            logoUrl
            twitter
            website
            admins{
                address
            }
          }
      }`,
      variables: {
        id,
      },
    }),
    cache: "no-store",
    next: { tags: [`space/${id}`] /*revalidate: 60 */ },
  })
    .then((res) => res.json())
    .then((res) => res.data.space);
  return data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const spaceData = await getSpace(params.id);

  const initialState = {
    ...spaceData,
    logoBlob: spaceData.logoUrl,
    admins: spaceData.admins.map((admin: any) => admin.address),
    errors: {
      admins: Array(spaceData.admins.length).fill(null),
    },
  };

  return (
    <SpaceForm
      initialState={initialState}
      isNewSpace={false}
      spaceId={params.id}
    />
  );
}
