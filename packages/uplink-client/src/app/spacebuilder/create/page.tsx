import SpaceForm from "@/ui/SpaceForm/SpaceForm";

export default function Page() {
  const initialState = {
    ens: "",
    name: "",
    logo_blob: "",
    logo_url: "",
    website: "",
    twitter: "",
    admins: ["you", ""],
    errors: {
      ens: null,
      name: null,
      logo_url: null,
      website: null,
      twitter: null,
      admins: [],
    },
  };

  return <SpaceForm initialState={initialState} isNewSpace={true} />;
}
