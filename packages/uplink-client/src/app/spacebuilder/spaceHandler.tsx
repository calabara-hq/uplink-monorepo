import { nanoid } from "nanoid";

export type Admin = {
  id: string;
  value: string;
  error: string | null;
};

export type StandardInput = {
  value: string;
  error: string | null;
};

export type AdminError = {
  id: string;
  addressError: string | null;
};

export type SpaceBuilderProps = {
  name: StandardInput;
  systemName: StandardInput;
  website: StandardInput;
  twitter: StandardInput;
  admins: Admin[];
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setSpaceName":
      return {
        ...state,
        name: { value: action.payload, error: null },
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
          { id: nanoid(), value: "", error: null }, // add unique ID to new admin object
        ],
      };
    case "removeAdmin":
      return {
        ...state,
        admins: state.admins.filter(
          (admin: Admin) => admin.id !== action.payload
        ),
      };
    case "setAdmin":
      return {
        ...state,
        admins: state.admins.map((admin: Admin) =>
          admin.id === action.payload.id
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
