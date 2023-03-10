import { nanoid } from "nanoid";
import {
  CreateSpaceDocument,
  AllSpacesDocument,
} from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";

export type Admin = {
  id: string;
  address: string;
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
  spaceName: StandardInput;
  website: StandardInput;
  twitter: StandardInput;
  spaceIdentifier: StandardInput;
  admins: Admin[];
};

// parse spaceData and return errors + sanitized data
export const sanitizeSpaceData = (spaceData: SpaceBuilderProps) => {
  let isError: boolean = false;
  // handle space name errors
  if (spaceData.spaceName.value.length < 3) {
    isError = true;
    spaceData.spaceName.error = "Space name must be at least 3 characters";
  }

  /*
  // handle website errors
  if (spaceData.website.length > 0) {
    console.log(spaceData.website);
    // check if website is valid
    // check if website is valid
    const isValidWebsite = spaceData.website.match(
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
    );
    if (!isValidWebsite) {
      isError = true;
      errors.websiteError = "Website is not valid";
    }
    // if website is valid, add protocol back to website
    sanitized.website = spaceData.website;
  }
*/
  // handle pfp errors

  // handle admin errors

  for (const [index, admin] of spaceData.admins.entries()) {
    const { id: adminId, address: adminAddress } = admin;
    // skip the first admin since it's not editable
    if (index === 0) continue;
    // trim whitespace
    const trimmedAddress = adminAddress.trim();

    // check if address is empty
    if (trimmedAddress.length === 0) {
      // remove admin from array if it is
      spaceData.admins = spaceData.admins.filter(
        (admin) => admin.id !== adminId
      );
      console.log("to remove", adminId);
      continue;
    }

    const isEns = trimmedAddress.match(/\.eth$/); // check if address is ens or hex

    if (isEns) {
      // check if ens is valid
      const isValidEns = trimmedAddress.match(
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
      );
      if (!isValidEns) {
        isError = true;
        admin.error = "Address is not valid";
      }
    } else {
      // check if address is valid hex
      const isValidAddress = trimmedAddress.match(/^(0x)?[0-9a-f]{40}$/i);
      if (!isValidAddress) {
        isError = true;
        admin.error = "Address is not valid";
      }
    }
    admin.address = trimmedAddress;
  }

  return { spaceData: spaceData, isError: isError };
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setSpaceName":
      return {
        ...state,
        spaceName: { value: action.payload, error: null },
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
          { id: nanoid(), address: "", error: null }, // add unique ID to new admin object
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
            ? { ...admin, address: action.payload.address, error: null }
            : admin
        ),
      };

    case "setTotalState":
      return { ...action.payload };
    default:
      return state;
  }
};

export const createSpace = async (state: any) => {
  const results = await graphqlClient.query(AllSpacesDocument, {}).toPromise();
  if (results.error) {
    throw new Error(results.error.message);
  }
  console.log(results);
  return results;

  //console.log(state)
  /*
  const result = await graphqlClient
    .mutation(CreateSpaceDocument, {
      space: {
        name: state.spaceName.value,
        members: 0,
      },
    })
    .toPromise();
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
  */
};
