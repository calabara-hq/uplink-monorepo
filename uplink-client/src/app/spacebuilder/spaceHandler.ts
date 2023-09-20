import { validateEthAddress } from "@/lib/ethAddress";
import { handleMutationError } from "@/lib/handleMutationError";

export type FormField = {
  value: string;
  error: string | null;
};

export type SpaceBuilderErrors = {
  name?: string;
  logoUrl?: string;
  website?: string;
  twitter?: string;
  admins: (string | null)[];
};

export type SpaceBuilderProps = {
  name: string;
  logoUrl: string;
  logoBlob: string;
  website?: string;
  twitter?: string;
  admins: string[];
  errors: SpaceBuilderErrors;
};

export const reducer = (state: SpaceBuilderProps, action: any) => {
  switch (action.type) {

    case "setSpaceName":
      return {
        ...state,
        name: action.payload,
        errors: { ...state.errors, name: null },
      };
    case "setLogoBlob":
      return {
        ...state,
        logoBlob: action.payload,
      };
    case "setLogoUrl":
      return {
        ...state,
        logoUrl: action.payload,
        errors: { ...state.errors, logoUrl: null },
      };

    case "setWebsite": {
      const { website: websiteError, ...otherErrors } = state.errors;

      return {
        ...state,
        website: action.payload !== "" ? action.payload : undefined,
        errors: otherErrors,
      };
    }

    case "setTwitter": {
      const { twitter: twitterError, ...otherErrors } = state.errors;

      return {
        ...state,
        twitter: action.payload !== "" ? action.payload : undefined,
        errors: otherErrors,
      };
    }

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
          (admin: string, index: number) => index !== action.payload
        ),
        errors: {
          ...state.errors,
          admins: state.errors.admins.filter(
            (admin: string | null, index: number) => index !== action.payload
          ),
        },
      };
    case "setAdmin":
      return {
        ...state,
        admins: state.admins.map((admin: string, index: number) =>
          index === action.payload.index ? action.payload.value : admin
        ),
        errors: {
          ...state.errors,
          admins: state.errors.admins.map((admin: string | null, index: number) =>
            index === action.payload.index ? null : admin
          ),
        },
      };
    case "setErrors": {
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload
        },
      };
    }
    case "setTotalState":
      return {
        ...state,
        ...action.payload.spaceBuilderData,
        errors: {
          ...state.errors,
          ...action.payload.errors
        }
      };
    default:
      return state;
  }
};


export const validateSpaceName = (name: SpaceBuilderProps['name']): { error: string | null, value: SpaceBuilderProps['name'] } => {

  const cleanedName = name.trim();

  if (!cleanedName) return { value: cleanedName, error: "Name is required" };
  if (cleanedName.length < 3) return { value: cleanedName, error: "Name must be at least 3 characters long" }
  if (cleanedName.length > 30) return { value: cleanedName, error: "Name must be less than 30 characters long" }
  if (!cleanedName.match(/^[a-zA-Z0-9_ ]+$/)) return { value: cleanedName, error: "Name must only contain alphanumeric characters and underscores" }

  return {
    error: null,
    value: cleanedName
  }
}

export const validateSpaceLogo = (logoUrl: SpaceBuilderProps['logoUrl']): { error: string | null, value: SpaceBuilderProps['logoUrl'] } => {

  if (!logoUrl) return { value: logoUrl, error: "Logo is required" };
  const pattern = /^https:\/\/uplink\.mypinata\.cloud\/ipfs\/[a-zA-Z0-9]+/;
  if (!pattern.test(logoUrl)) return { value: logoUrl, error: "Logo is not valid" };

  return {
    error: null,
    value: logoUrl
  };
}

export const validateSpaceWebsite = (website: SpaceBuilderProps['website']): { error: string | null, value?: SpaceBuilderProps['website'] } => {

  if (!website) return { error: null };

  const cleanedWebsite = website.trim().toLowerCase();

  const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.([a-z]{2,})(\.[a-z]{2,})?$/;
  if (!pattern.test(website)) return { value: cleanedWebsite, error: "Website is not valid" };

  return {
    error: null,
    value: cleanedWebsite
  };
}

export const validateSpaceTwitter = (twitter: SpaceBuilderProps['twitter']): { error: string | null, value?: SpaceBuilderProps['twitter'] } => {

  if (!twitter) return { error: null };

  const cleanedTwitter = twitter.trim().toLowerCase();

  const pattern = /^@(\w){1,15}$/;
  if (!pattern.test(twitter)) return { value: cleanedTwitter, error: "Twitter handle is not valid" };

  return {
    error: null,
    value: cleanedTwitter
  };
}



/**
 * 
 * need to return the cleaned addresses array and the errors array
 * errors should be in the same order as the addresses
 * 
 */

export const validateSpaceAdmins = async (admins: SpaceBuilderProps['admins']): Promise<{ error: SpaceBuilderErrors['admins'], value: SpaceBuilderProps['admins'] }> => {
  type adminField = {
    value: string,
    error: string | null
  }

  const promises = admins.map(async (admin) => {
    const field: adminField = {
      value: admin,
      error: null
    }

    if (!field.value || field.value.length === 0) {
      return null;
    }

    const cleanAddress = await validateEthAddress(field.value);

    if (!cleanAddress) {
      field.error = "invalid address";
      return field;
    }

    field.value = cleanAddress;
    return field;
  })

  const adminFields = await Promise.all(promises);


  // Filter out undefined and null fields, and remove duplicates
  const uniqueAdminFields = adminFields.reduce((acc: adminField[], field) => {
    if (field && !acc.some(item => item.value === field.value)) {
      acc.push(field);
    }
    return acc;
  }, []);

  // Store errors and values in separate arrays
  const errors = uniqueAdminFields.map(field => field.error);
  const values = uniqueAdminFields.map(field => field.value);

  // Return the result
  return { error: errors, value: values };

}



export const validateSpaceBuilderProps = async (props: SpaceBuilderProps) => {
  const { error: nameError, value: nameValue } = validateSpaceName(props.name);
  const { error: logoErrors, value: logoValue } = validateSpaceLogo(props.logoUrl);
  const { error: websiteErrors, value: websiteValue } = validateSpaceWebsite(props.website);
  const { error: twitterErrors, value: twitterValue } = validateSpaceTwitter(props.twitter);
  const { error: adminsErrors, value: adminsValue } = await validateSpaceAdmins(props.admins);

  const errors = {
    ...(nameError ? { name: nameError } : {}),
    ...(logoErrors ? { logoUrl: logoErrors } : {}),
    ...(websiteErrors ? { website: websiteErrors } : {}),
    ...(twitterErrors ? { twitter: twitterErrors } : {}),
    admins: adminsErrors
  }

  const values = {
    name: nameValue,
    logoUrl: logoValue,
    ...(websiteValue ? { website: websiteValue } : {}),
    ...(twitterValue ? { twitter: twitterValue } : {}),
    admins: adminsValue,
  }


  const { admins, ...otherErrors } = errors;

  const hasAdminErrors = admins.some((admin) => typeof admin === 'string');
  return {
    isValid: Object.keys(otherErrors).length === 0 && !hasAdminErrors,
    errors,
    values
  }

}


export const createSpace = async (
  url,
  {
    arg,
  }: {
    arg: any;
  }
) => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": arg.csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
            mutation CreateSpace($spaceData: SpaceBuilderInput!){
              createSpace(spaceData: $spaceData){
                spaceName
                success
                errors{
                  name
                  logoUrl
                  twitter
                  website
                  admins
                }
              }
            }`,
      variables: {
        spaceData: arg.spaceData,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.createSpace);
};

export const editSpace = async (
  url,
  {
    arg,
  }: {
    arg: any;
  }
) => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": arg.csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
            mutation EditSpace($spaceId: ID!, $spaceData: SpaceBuilderInput!){
              editSpace(spaceId: $spaceId, spaceData: $spaceData){
                spaceName
                success
                errors{
                  name
                  logoUrl
                  twitter
                  website
                  admins
                }
              }
            }`,
      variables: {
        spaceId: arg.spaceId,
        spaceData: arg.spaceData,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.editSpace);
};