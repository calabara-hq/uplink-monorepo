import SpaceForm from "@/webapp/spacebuilder/SpaceForm";

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {

  const initialState = {
    name: "",
    logoBlob: "",
    logoUrl: "",
    website: "",
    twitter: "",
    admins: ["you", ""],
    errors: {
      admins: [],
    },
  };

  return <SpaceForm initialState={initialState} isNewSpace={true} referral={searchParams.referral} />;
}
