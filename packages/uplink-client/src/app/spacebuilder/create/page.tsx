import SpaceForm from "@/ui/SpaceForm/SpaceForm";

export default function Page() {
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

  return <SpaceForm initialState={initialState} isNewSpace={true} />;
}
