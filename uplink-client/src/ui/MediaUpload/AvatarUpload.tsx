'use client';;
import React, { useRef, useEffect } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { HiPhoto } from 'react-icons/hi2';
import OptimizedImage from "@/lib/OptmizedImage"
import { Input } from '../DesignKit/Input';
import { Label } from '../DesignKit/Label';
import { useDropzone } from 'react-dropzone';

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


    const onDrop = async (acceptedFiles: File[]) => {
        await upload(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <Label>{fieldLabel}</Label>
            <div
                {...getRootProps({
                    className:
                        'relative w-28 h-28 rounded-lg cursor-pointer flex justify-center items-center bg-base-200 hover:bg-base-300 overflow-hidden',
                })}>
                {imageObjectURL || initialData ? (
                    <OptimizedImage src={imageObjectURL || initialData} alt="space avatar" fill className="object-contain rounded-lg" />
                ) : (
                    <React.Fragment>
                        <Input {...getInputProps()} />
                        <HiPhoto className="w-8 h-8" />
                    </React.Fragment>
                )}

            </div>
            {error && (
                <Label>
                    <p className="text-error">{error}</p>
                </Label>
            )}
        </div>
    )

    // return (
    //     <div className="w-full h-full">
    //         <Input
    //             placeholder="asset"
    //             type="file"
    //             accept={acceptedFormats.join(",")}
    //             className="hidden"
    //             onChange={async (event) =>
    //                 await upload(event)
    //             }
    //             ref={imageUploader}
    //         />
    //         <Label>
    //             {fieldLabel}
    //         </Label>
    //         {/* <div className="absolute"> */}
    //         <div
    //             className="relative w-28 h-28 rounded-lg cursor-pointer flex justify-center items-center bg-base-200 hover:bg-base-300 overflow-hidden"
    //             onClick={() => imageUploader.current?.click()}
    //         >
    //             {imageObjectURL || initialData ? (
    //                 <OptimizedImage src={imageObjectURL || initialData} alt="space avatar" fill className="object-contain rounded-lg" />
    //             ) : (
    //                 <div className="flex justify-center items-center w-full h-full">
    //                     <HiPhoto className="w-8 h-8" />
    //                 </div>
    //             )}
    //         </div>
    //         {/* </div> */}
    //         {error && (
    //             <Label>
    //                 <p className="text-error">
    //                     {error}
    //                 </p>
    //             </Label>
    //         )}
    //     </div>
    // );
}
