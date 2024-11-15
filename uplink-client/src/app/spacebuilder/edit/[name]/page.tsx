import { SpaceForm } from "@/app/spacebuilder/SpaceForm";
import { SpaceSettingsStateT } from "@/hooks/useSpaceReducer";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { Admin } from "@/types/space";

export default async function Page({ params }: { params: { name: string } }) {
  const spaceData = await fetchSingleSpace(params.name);

  const initialState: SpaceSettingsStateT = {
    ...spaceData,
    name: spaceData.displayName,
    logoUrl: spaceData.logoUrl,
    admins: spaceData.admins.map((admin: Admin) => admin.address),
    errors: {},
  };

  return (
    <SpaceForm
      initialState={initialState}
      spaceId={spaceData.id}
    />
  );
}
