

// validate space name
const validateSpaceName = (name: string) => {
    const fields = { value: name, error: null };
    fields.value = fields.value.trim();
    if (fields.value.length < 3) {
        fields.error = "Space name must be at least 3 characters";
    }

    if (fields.value.length > 30) {
        fields.error = "Space name is too long";
    }
    return fields;
}


const processSpaceData = async (spaceData) => {
    const { name } = spaceData;
    const nameResult = validateSpaceName(name);


    let isSuccess = !nameResult.error;
    return {
        success: isSuccess,
        spaceResponse: {
            name: nameResult
        }
    }
}

const mutations = {
    Mutation: {
        createSpace: async (_: any, args: any, context: any) => {
            const { spaceData } = args;
            const result = await processSpaceData(spaceData);
            console.log(result)
            return {
                success: result.success,
                spaceResponse: result.spaceResponse
            }
        }
    },
};

export default mutations;



/*
// parse spaceData and return errors + sanitized data
export const sanitizeSpaceData = (spaceData: SpaceBuilderProps) => {
  let isError: boolean = false;
  // handle space name errors
  if (spaceData.name.value.length < 3) {
    isError = true;
    spaceData.name.error = "Space name must be at least 3 characters";
  }


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

*/