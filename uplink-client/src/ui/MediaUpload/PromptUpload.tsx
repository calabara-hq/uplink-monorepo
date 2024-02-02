'use client';
import { useRef, useEffect } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { HiPhoto } from 'react-icons/hi2';
import UplinkImage from '@/lib/UplinkImage';

export const PromptUpload = ({
    acceptedFormats,
    uploadStatusCallback,
    ipfsImageCallback,
    error,
    initialData
}: {
    acceptedFormats: Array<string>,
    uploadStatusCallback: (status: boolean) => void,
    ipfsImageCallback: (url: string) => void,
    error: string,
    initialData: string
}) => {
    const imageUploader = useRef<HTMLInputElement>(null);
    const {
        upload,
        isUploading,
        imageObjectURL,
        imageURI,
    } = useMediaUpload(acceptedFormats);

    useEffect(() => {
        uploadStatusCallback(isUploading)
    }, [isUploading])

    useEffect(() => {
        ipfsImageCallback(imageURI)
    }, [imageURI])

    return (
        <div >
            <input
                placeholder="asset"
                type="file"
                accept={acceptedFormats.join(",")}
                className="hidden"
                onChange={async (event) =>
                    await upload(event)
                }
                ref={imageUploader}
            />
            <label className="label">
                <span className="label-text">Cover Image</span>
            </label>
            <div className="avatar">
                <div
                    className="w-36 rounded-lg cursor-pointer flex justify-center items-center"
                    onClick={() => imageUploader.current?.click()}
                >
                    {imageObjectURL || initialData ? (
                        <UplinkImage
                            src={imageObjectURL || initialData}
                            alt="prompt cover image"
                            fill
                        />
                    )
                        : (
                            <div className="flex justify-center items-center w-full h-full rounded-lg bg-base-100 hover:bg-base-200 transition-all">
                                <HiPhoto className="w-10 h-10" />
                            </div>
                        )}
                </div>
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">
                        {error}
                    </span>
                </label>
            )}
        </div>
    );


}