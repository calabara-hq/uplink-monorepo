"use client";
export const isAndroid = () => {
    return (
        typeof navigator !== 'undefined' &&
        /Android\s([0-9.]+)/.test(navigator.userAgent) // Source: https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
    );
}

export const isIOS = () => {
    return (
        typeof navigator !== 'undefined' &&
        /Version\/([0-9._]+).*Mobile.*Safari.*/.test(navigator.userAgent) // Source: https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
    );
}

export const isMobile = () => {
    return isAndroid() || isIOS();
}
