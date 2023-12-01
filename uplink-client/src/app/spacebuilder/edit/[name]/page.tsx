import SpaceForm from "@/app/spacebuilder/SpaceForm";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { Admin } from "@/types/space";

export default async function Page({ params }: { params: { name: string } }) {
  const spaceData = await fetchSingleSpace(params.name);

  const initialState = {
    ...spaceData,
    name: spaceData.displayName,
    logoBlob: spaceData.logoUrl,
    admins: spaceData.admins.map((admin: Admin) => admin.address),
    errors: {
      admins: Array(spaceData.admins.length).fill(null),
    },
  };

  return (
    <SpaceForm
      initialState={initialState}
      isNewSpace={false}
      spaceId={spaceData.id}
    />
  );
}
