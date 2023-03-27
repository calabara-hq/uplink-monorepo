export type FormField = {
  value: string;
  error: string | null;
};

export type SpaceBuilderErrors = {
  ens: string | null;
  name: string | null;
  logo_url: string | null;
  website: string | null;
  twitter: string | null;
  admins: (string | null)[];
};

export type SpaceBuilderProps = {
  ens: string;
  name: string;
  logo_url: string;
  logo_blob: string;
  website: string;
  twitter: string;
  admins: string[];
  errors: SpaceBuilderErrors;
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setSpaceEns":
      return {
        ...state,
        ens: action.payload,
        errors: { ...state.errors, ens: null },
      };
    case "setSpaceName":
      return {
        ...state,
        name: action.payload,
        errors: { ...state.errors, name: null },
      };
    case "setLogoBlob":
      return {
        ...state,
        logo_blob: action.payload,
        errors: { ...state.errors, logo_blob: null },
      };
    case "setLogoUrl":
      return {
        ...state,
        logo_url: action.payload,
        errors: { ...state.errors, logo_url: null },
      };
    case "setWebsite":
      return {
        ...state,
        website: action.payload,
        errors: { ...state.errors, website: null },
      };
    case "setTwitter":
      return {
        ...state,
        twitter: action.payload,
        errors: { ...state.errors, twitter: null },
      };
    case "setPfp":
      return {
        ...state,
        pfp: action.payload,
        errors: { ...state.errors, pfp: null },
      };
    case "addAdmin":
      return {
        ...state,
        admins: [...state.admins, ""],
        errors: { ...state.errors, admins: [...state.errors.admins, null] },
      };
    case "removeAdmin":
      return {
        ...state,
        admins: state.admins.filter(
          (admin: FormField, index: number) => index !== action.payload
        ),
        errors: {
          ...state.errors,
          admins: state.errors.admins.filter(
            (admin: string, index: number) => index !== action.payload
          ),
        },
      };
    case "setAdmin":
      return {
        ...state,
        admins: state.admins.map((admin: FormField, index: number) =>
          index === action.payload.index ? action.payload.value : admin
        ),
        errors: {
          ...state.errors,
          admins: state.errors.admins.map((admin: string, index: number) =>
            index === action.payload.index ? null : admin
          ),
        },
      };

    case "setTotalState":
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
