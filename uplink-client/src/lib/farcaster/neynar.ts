import type { FrameValidationData, NeynarFrameValidationInternalModel } from './types';

export const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';

export const neynarFrameValidation = async (
    messageBytes: string,
    apiKey: string = NEYNAR_DEFAULT_API_KEY,
    castReactionContext = true,
    followContext = true,
): Promise<FrameValidationData | undefined> => {
    const url = 'https://api.neynar.com/v2/farcaster/frame/validate';

    const responseBody = await postDataToNeynar(url, apiKey, {
        message_bytes_in_hex: messageBytes,
        cast_reaction_context: castReactionContext, // Returns if the user has liked/recasted
        follow_context: followContext, // Returns if the user is Following
    });
    return convertToNeynarResponseModel(responseBody);
}


export function convertToNeynarResponseModel(
    /* biome-ignore lint: code needs to be deprecated */
    data: any,
): FrameValidationData | undefined {
    if (!data) {
        return;
    }

    /**
     * Note: This is not a type-safe conversion, however, balancing that risk with an additional import
     * to include a library like AJV which can accomplish that.  Alternatively, we could write conversions
     * for each type, but that seemed overkill.
     */
    const neynarResponse = data as NeynarFrameValidationInternalModel;

    // Shorten paths
    const action = neynarResponse.action;
    const cast = action?.cast;
    const interactor = action?.interactor;

    return {
        address: action?.address || null,
        button: action?.tapped_button?.index,
        following: action?.interactor?.viewer_context?.following,
        input: action?.input?.text,
        interactor: {
            fid: interactor?.fid,
            custody_address: interactor?.custody_address,
            verified_accounts: interactor?.verifications,
            verified_addresses: {
                eth_addresses: interactor?.verified_addresses?.eth_addresses,
                sol_addresses: interactor?.verified_addresses?.sol_addresses,
            },
        },
        liked: cast?.viewer_context?.liked,
        raw: neynarResponse,
        recasted: cast?.viewer_context?.recasted,
        state: {
            serialized: action?.state?.serialized || '',
        },
        transaction: action?.transaction || null,
        valid: neynarResponse.valid,
    };
}

async function postDataToNeynar(url: string, apiKey: string, data: any) {
    const options = {
        method: 'POST',
        url: url,
        headers: {
            accept: 'application/json',
            api_key: apiKey,
            'content-type': 'application/json',
            uplink_version: '1.0.0',
        },
        body: JSON.stringify(data),
    };
    const resp = await fetch(options.url, options);
    if (resp.status !== 200) {
        throw new Error(
            `non-200 status returned from neynar : ${resp.status}`,
        );
    }
    return await resp.json();
}