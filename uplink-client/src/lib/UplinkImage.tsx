"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
const normalizeSrc = (src) => {
    return src.startsWith('/') ? process.env.NEXT_PUBLIC_CLIENT_URL + src : src;
};


const imageLoader = ({ src, width, quality }) => {
    const isObjectURL = !src.startsWith('http')
    const qualitySetting = quality || 'auto:best'; // default to auto:good if not specified
    const modifiers = `w_${width},q_${qualitySetting},c_limit,f_auto`; // c_fill for Cloudinary fill mode
    return isObjectURL ? src : `https://res.cloudinary.com/drrkx8iye/image/fetch/${modifiers}/${normalizeSrc(src)}`;
};


const blurLoader = ({ src, width, quality }) => {
    const isObjectURL = !src.startsWith('http')
    const adjustedWidth = width > 200 ? 200 : width
    const modifiers = `w_${adjustedWidth},q_auto:low,e_blur:2000,c_limit,f_auto`; // c_fill for Cloudinary fill mode
    return isObjectURL ? src : `https://res.cloudinary.com/drrkx8iye/image/fetch/${modifiers}/${normalizeSrc(src)}`;
};

export default function UplinkImage(props: { src: string | StaticImageData, alt: string, width?: number, height?: number, fill?: boolean, sizes?: string, className?: string, blur?: boolean, quality?: number, draggable?: boolean, priority?: boolean }) {
    const { src, sizes, alt, blur = true, className, ...rest } = props;
    const [isPlaceholderError, setIsPlaceholderError] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);



    // if (blur) {
    //     const blurredSrc = typeof src === 'string' ? blurLoader({ src, width: 200, quality: '1' }) : '';

    //     return (
    //         <>
    //             {/* {!isPlaceholderError && !hasLoaded && <Image
    //                 src={blurredSrc}
    //                 onError={() => setIsPlaceholderError(true)}
    //                 alt={alt}
    //                 sizes={sizes}
    //                 className={`${className}`}
    //                 {...rest}
    //                 unoptimized={true}

    //             />
    //             }
    //              */}

    //             {!isPlaceholderError && !hasLoaded && <Image
    //                 src={blurredSrc}
    //                 onError={() => setIsPlaceholderError(true)}
    //                 alt={alt}
    //                 sizes={sizes}
    //                 className={className}
    //                 {...rest}
    //                 unoptimized={true}

    //             />
    //             }
    //             <Image
    //                 loader={isPlaceholderError ? undefined : imageLoader}
    //                 onLoad={() => setHasLoaded(true)}
    //                 src={src}
    //                 alt={alt}
    //                 sizes={sizes}
    //                 className={`${className} ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
    //                 {...rest}
    //             />
    //         </>
    //     );
    // }


    return (
        <Image
            loader={imageLoader}
            src={src}
            alt={alt}
            sizes={sizes}
            className={className}
            {...rest}
        />
    )

}
