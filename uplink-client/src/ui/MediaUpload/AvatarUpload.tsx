'use client';
import { useRef, useEffect } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import Image from "next/image";
import { HiUser } from 'react-icons/hi2';
import UplinkImage from "@/lib/UplinkImage"

export const AvatarUpload = ({
    fieldLabel,
    initialData,
    acceptedFormats,
    uploadStatusCallback,
    ipfsImageCallback,
    error
}: {
    fieldLabel: string,
    initialData: string,
    acceptedFormats: Array<string>,
    uploadStatusCallback: (status: boolean) => void,
    ipfsImageCallback: (url: string) => void,
    error?: string
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
        <div className="w-full h-full">
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
                <span className="label-text">{fieldLabel}</span>
            </label>
            <div className="avatar">
                <div
                    className="relative w-28 h-28 rounded-full cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all"
                    onClick={() => imageUploader.current?.click()}
                >
                    {imageObjectURL || initialData ? (
                        <UplinkImage src={imageObjectURL || initialData} alt="space avatar" fill />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <HiUser className="w-8 h-8" />
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
