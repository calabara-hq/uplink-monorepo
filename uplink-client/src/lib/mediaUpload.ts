import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
//import generateVideoThumbnails from "./generateVideoThumbnails";

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

// This function is used to upload images to the ipfs network
// the function takes a File object as input

export const IpfsUpload = async (file: File | Blob) => {

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/media/upload?filesize=${file.size}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        console.error('Error uploading file:', response.statusText);
        return null;
    }

    const data = await response.json();
    return `https://uplink.mypinata.cloud/ipfs/${data.IpfsHash}`;
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
    readerCallback: (data: any) => void,
    ipfsCallback: (uri: string) => void,
    videoThumbnailCallback?: (thumbnails: string[]) => void,
    fileSizeCallback?: (size: string) => void,
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
        if (fileSize > 15000000) throw new MediaUploadError({ code: 2, message: 'Images must be less than 15MB' });
    }

    if (!acceptedMimeTypes.includes(mimeType)) throw new MediaUploadError({ code: 3, message: 'Invalid file type.' });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        readerCallback(reader.result);
    };
    reader.onerror = (error) => {
        throw new MediaUploadError({ code: 4, message: 'Error reading file' })
    };

    /*
    const preUploadResponse = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/media/preupload?filesize=${fileSize}`, {
        method: 'GET',
        credentials: 'include'
    });

    console.log(preUploadResponse);
    */
    const response = await IpfsUpload(file);
    if (!response) throw new MediaUploadError({ code: 5, message: 'Error uploading to IPFS' })

    ipfsCallback(response);
};

export default handleMediaUpload;
