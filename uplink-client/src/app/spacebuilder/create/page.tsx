import { SpaceForm } from "@/app/spacebuilder/SpaceForm";
import { SpaceSettingsStateT } from "@/hooks/useSpaceReducer";

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {

  const initialState: SpaceSettingsStateT = {
    name: "",
    logoUrl: "",
    website: "",
    admins: ["you", ""],
    errors: {},
  };

  return <SpaceForm initialState={initialState} />;
}
