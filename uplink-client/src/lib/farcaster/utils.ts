import { FrameRequest, MockFrameRequest, FrameValidationResponse, FrameMetadataHtmlResponse } from "./types";
import { neynarFrameValidation } from "./neynar";

export const calculateImageAspectRatio = async (url: string) => {
    try {
        const fileInfo = await fetch(`https://res.cloudinary.com/drrkx8iye/image/fetch/fl_getinfo/${url}`).then(res => res.json())
        const { output } = fileInfo;
        if (output.width / output.height > 1.45) return "1.91:1";
        return "1:1"
    } catch (e) {
        return "1:1"
    }
}

type FrameMessageOptions =
    | {
        neynarApiKey?: string;
        castReactionContext?: boolean;
        followContext?: boolean;
        allowFramegear?: boolean;
    }
    | undefined;

/**
 * Given a frame message, decode and validate it.
 * If message is valid, return the message. Otherwise undefined.
 */
export const getFrameMessage = async (
    body: FrameRequest | MockFrameRequest,
    messageOptions?: FrameMessageOptions,
): Promise<FrameValidationResponse> => {
    // Skip validation only when allowed and when receiving a request from framegear
    if (messageOptions?.allowFramegear) {
        if ((body as MockFrameRequest).mockFrameData) {
            return {
                isValid: true,
                message: (body as MockFrameRequest).mockFrameData,
            };
        }
    }

    // Validate the message
    const response = await neynarFrameValidation(
        body?.trustedData?.messageBytes,
        messageOptions?.neynarApiKey,
        messageOptions?.castReactionContext || true,
        messageOptions?.followContext || true,
    );
    if (response?.valid) {
        return {
            isValid: true,
            message: response,
        };
    }
    // Security best practice, don't return anything if we can't validate the frame.
    return {
        isValid: false,
        message: undefined,
    };
}



/**
 * Returns an HTML string containing metadata for a new valid frame.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
export function getFrameHtmlResponse({
    accepts = {},
    buttons,
    image,
    input,
    isOpenFrame = false,
    ogDescription,
    ogTitle,
    postUrl,
    post_url,
    refreshPeriod,
    refresh_period,
    state,
}: FrameMetadataHtmlResponse): string {
    const imgSrc = typeof image === 'string' ? image : image.src;
    const ogImageHtml = `  <meta property="og:image" content="${imgSrc}" />\n`;
    let imageHtml = `  <meta property="fc:frame:image" content="${imgSrc}" />\n`;
    if (typeof image !== 'string' && image.aspectRatio) {
        imageHtml += `  <meta property="fc:frame:image:aspect_ratio" content="${image.aspectRatio}" />\n`;
    }

    // Set the input metadata if it exists.
    const inputHtml = input
        ? `  <meta property="fc:frame:input:text" content="${input.text}" />\n`
        : '';

    // Set the state metadata if it exists.
    const stateHtml = state
        ? `  <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify(state))}" />\n`
        : '';

    // Set the button metadata if it exists.
    let buttonsHtml = '';
    if (buttons) {
        buttonsHtml = buttons
            .map((button, index) => {
                let buttonHtml = `  <meta property="fc:frame:button:${index + 1}" content="${button.label}" />\n`;
                if (button.action) {
                    buttonHtml += `  <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />\n`;
                }
                if (button.target) {
                    buttonHtml += `  <meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />\n`;
                }
                if (button.action && button.action === 'tx' && button.postUrl) {
                    buttonHtml += `  <meta property="fc:frame:button:${index + 1}:post_url" content="${button.postUrl}" />\n`;
                }
                return buttonHtml;
            })
            .join('');
    }

    // Set the post_url metadata if it exists.
    const postUrlToUse = postUrl || post_url;
    const postUrlHtml = postUrlToUse
        ? `  <meta property="fc:frame:post_url" content="${postUrlToUse}" />\n`
        : '';

    // Set the refresh_period metadata if it exists.
    const refreshPeriodToUse = refreshPeriod || refresh_period;
    const refreshPeriodHtml = refreshPeriodToUse
        ? `  <meta property="fc:frame:refresh_period" content="${refreshPeriodToUse.toString()}" />\n`
        : '';

    let ofHtml = '';
    // Set the Open Frames metadata
    if (isOpenFrame) {
        ofHtml = `  <meta property="of:version" content="vNext" />\n`;
        const ofAcceptsHtml = Object.keys(accepts)
            .map((protocolIdentifier) => {
                return `  <meta property="of:accepts:${protocolIdentifier}" content="${accepts[protocolIdentifier]}" />\n`;
            })
            .join('');
        const ofImageHtml = `  <meta property="of:image" content="${imgSrc}" />\n`;
        ofHtml += ofAcceptsHtml + ofImageHtml;
    }

    // Return the HTML string containing all the metadata.
    const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta property="og:description" content="${ogDescription || 'Frame description'}" />
    <meta property="og:title" content="${ogTitle || 'Frame title'}" />
    <meta property="fc:frame" content="vNext" />
  ${buttonsHtml}${ogImageHtml}${imageHtml}${inputHtml}${postUrlHtml}${refreshPeriodHtml}${stateHtml}${ofHtml}
  </head>
  </html>`;

    return html;
}