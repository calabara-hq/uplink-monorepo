export type Admin = {
    id: number;
    address: string;
  };
  
  export type SpaceBuilderProps = {
    spaceName: string;
    website: string;
    twitter: string;
    spaceIdentifier: string;
    admins: Admin[];
    errors: SpaceBuilderErrors;
  };
  
  export type SpaceBuilderErrors = {
    spaceNameError: string | null;
    websiteError: string | null;
    twitterError: string | null;
  };
  
  // parse spaceData and return errors + sanitized data
  export const sanitizeSpaceData = (spaceData: SpaceBuilderProps) => {
    let isError: boolean = false;
    const sanitized: SpaceBuilderProps = spaceData;
    const errors: SpaceBuilderErrors = {
      spaceNameError: null,
      websiteError: null,
      twitterError: null,
    };
  
    // handle space name errors
    if (spaceData.spaceName.length < 3) {
      isError = true;
      errors.spaceNameError = "Space name must be at least 3 characters";
    }
  
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
  
    // handle website errors
  
    // handle pfp errors
  
    // handle admin errors
  
    // handle token errors
  
    return { sanitized: sanitized, isError: isError, errors: errors };
  };
  
  export const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "setSpaceName":
        return {
          ...state,
          spaceName: action.payload,
          errors: { ...state.errors, spaceNameError: null },
        };
      case "setWebsite":
        return {
          ...state,
          website: action.payload,
          errors: { ...state.errors, websiteError: null },
        };
      case "setTwitter":
        return {
          ...state,
          twitter: action.payload,
          errors: { ...state.errors, twitterError: null },
        };
      case "setPfp":
        return {
          ...state,
          pfp: action.payload,
          errors: { ...state.errors, pfpError: null },
        };
      case "addAdmin":
        return {
          ...state,
          admins: [
            ...state.admins,
            { id: state.admins.length, address: "" }, // add unique ID to new admin object
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
              ? { ...admin, address: action.payload.address }
              : admin
          ),
        };
  
      case "setErrors":
        return { ...state, errors: action.payload };
      default:
        return state;
    }
  };