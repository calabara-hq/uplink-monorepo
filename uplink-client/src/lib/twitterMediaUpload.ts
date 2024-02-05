import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import { useState, useTransition, useEffect } from "react";
import FormData from 'form-data';

export class MediaUploadError {
    code: number;
    message: string;
    constructor({ code, message }: { code: number, message: string }) {
        this.code = code;
        this.message = message;
    }
}

export const dataURLtoBlob = (dataUrl: string) => {
    return fetch(dataUrl)
        .then(res => res.blob())
}

export const IpfsUpload = async (file: File | Blob) => {

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            // @ts-expect-error
            body: formData 
        });
    
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null
        }
    
        const responseData = await response.json();
        return `https://uplink.mypinata.cloud/ipfs/${responseData.IpfsHash}`;
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
};

const loadVideo = (file: File) =>
    new Promise((resolve, reject) => {
        try {
            let video = document.createElement('video');
            video.preload = 'metadata';

            // Create an object URL for the file
            const objectUrl = URL.createObjectURL(file);
            video.src = objectUrl;

            video.onloadedmetadata = function () {
                // Release the object URL after metadata is loaded
                URL.revokeObjectURL(objectUrl);
                resolve(this);
            }

            video.onerror = function () {
                reject("Invalid video. Please select a video file.");
            }
        } catch (e) {
            reject(e);
        }
    });

const handleMediaUpload = async (
    event: any,
    acceptedFormats: string[],
    mimeTypeCallback: (mimeType: string) => void,
    readerCallback: (data: any, mimeType: string) => void,
    ipfsCallback: (uri: string, mimeType: string) => void,
    videoThumbnailCallback?: (thumbnails: string[]) => void,
    fileSizeCallback?: (size: number) => void,
) => {

    const acceptedMimeTypes = acceptedFormats.reduce((acc: string[], format: string) => {
        if (format === 'image') {
            return [...acc, 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        }
        if (format === 'video') {
            return [...acc, 'video/mp4'];
        }
        if (format === 'svg') {
            return [...acc, 'image/svg+xml'];
        }
        return acc;
    }, []);

    const file = event.target.files[0];
    if (!file) {
        throw new MediaUploadError({ code: 1, message: 'No file selected' })
    }

    const mimeType = file.type;
    mimeTypeCallback(mimeType);
    const fileSize = file.size;
    if (fileSizeCallback) fileSizeCallback(fileSize)

    if (mimeType.includes("video")) {
        const video: any = await loadVideo(file);

        if (video.duration > 140) throw new MediaUploadError({ code: 2, message: 'Videos must be less than 140 seconds' });

        if (videoThumbnailCallback) { // if its a video and caller wants thumbnails, generate thumbnails
            const thumbnails = await generateVideoThumbnails(file, 3, 'jpeg');
            videoThumbnailCallback(thumbnails);
        }
    } else {
        if (fileSize > 5000000) throw new MediaUploadError({ code: 2, message: 'Images must be less than 5MB' });
    }

    if (!acceptedMimeTypes.includes(mimeType)) throw new MediaUploadError({ code: 3, message: 'Invalid file type.' });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        readerCallback(reader.result, mimeType);
    };
    reader.onerror = (error) => {
        throw new MediaUploadError({ code: 4, message: 'Error reading file' })
    };

    const response = await IpfsUpload(file);
    if (!response) throw new MediaUploadError({ code: 5, message: 'Error uploading to IPFS' })

    ipfsCallback(response, mimeType);
};

export default handleMediaUpload;
