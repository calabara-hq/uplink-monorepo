export type FormField = {
  value: string;
  error: string | null;
};

export type ImageField = {
  value: string;
  error: string | null;
};

export type SpaceBuilderProps = {
  name: FormField;
  logo: ImageField;
  systemName: FormField;
  website: FormField;
  twitter: FormField;
  admins: FormField[];
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setSpaceName":
      return {
        ...state,
        name: { value: action.payload, error: null },
      };
    case "setLogo":
      return {
        ...state,
        logo: { value: action.payload, error: null },
      };
    case "setWebsite":
      return {
        ...state,
        website: { value: action.payload, error: null },
      };
    case "setTwitter":
      return {
        ...state,
        twitter: { value: action.payload, error: null },
      };
    case "setPfp":
      return {
        ...state,
        pfp: { value: action.payload, error: null },
      };
    case "addAdmin":
      return {
        ...state,
        admins: [
          ...state.admins,
          { value: "", error: null }, // add unique ID to new admin object
        ],
      };
    case "removeAdmin":
      return {
        ...state,
        admins: state.admins.filter(
          (admin: FormField, index: number) => index !== action.payload
        ),
      };
    case "setAdmin":
      return {
        ...state,
        admins: state.admins.map((admin: FormField, index: number) =>
          index === action.payload.index
            ? { ...admin, value: action.payload.value, error: null }
            : admin
        ),
      };

    case "setTotalState":
      console.log(action.payload);
      return { ...action.payload };
    default:
      return state;
  }
};
