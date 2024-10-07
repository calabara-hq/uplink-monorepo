'use client';
import React, { useEffect } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import Image from "next/image";
import { HiOutlineTrash, HiPhoto } from 'react-icons/hi2';
import { RenderStandardVideoWithLoader } from '@/ui/VideoPlayer';
import { BiSolidCircle } from 'react-icons/bi';
import { Label } from '../DesignKit/Label';
import { Button } from '../DesignKit/Button';
import { useDropzone } from 'react-dropzone';
import { Input } from '../DesignKit/Input';


export const MediaUpload = ({
    acceptedFormats,
    uploadStatusCallback,
    ipfsImageCallback,
    ipfsAnimationCallback,
    mimeTypeCallback,
    maxVideoDuration,
    label = "Media",
}: {
    acceptedFormats: Array<string>,
    uploadStatusCallback: (status: boolean) => void,
    ipfsImageCallback: (url: string) => void,
    ipfsAnimationCallback: (url: string) => void,
    mimeTypeCallback?: (mimeType: string) => void,
    maxVideoDuration?: number
    label?: string
}) => {

    const {
        upload,
        removeMedia,
        isUploading,
        imageObjectURL,
        animationObjectURL,
        isVideo,
        thumbnailBlobIndex,
        thumbnailOptions,
        handleThumbnailChoice,
        imageURI,
        animationURI,
        mimeType,
    } = useMediaUpload(acceptedFormats, maxVideoDuration);

    const onDrop = async (acceptedFiles: File[]) => {
        await upload(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    useEffect(() => {
        uploadStatusCallback(isUploading)
    }, [isUploading])

    useEffect(() => {
        ipfsImageCallback(imageURI)
    }, [imageURI])

    useEffect(() => {
        ipfsAnimationCallback(animationURI)
    }, [animationURI])

    useEffect(() => {
        if (mimeTypeCallback) {
            mimeTypeCallback(mimeType)
        }
    }, [mimeType])

    if (isVideo) {
        return (
            <div className="relative w-full m-auto">
                <Label>{label}</Label>
                <Button
                    variant="destructive"
                    className="absolute top-5 -right-3 rounded-full z-10 shadow-lg"
                    onClick={removeMedia}
                >
                    <HiOutlineTrash className="w-5 h-5" />
                </Button>
                <RenderStandardVideoWithLoader
                    videoUrl={animationObjectURL || ""}
                    posterUrl={
                        thumbnailBlobIndex !== null
                            ? thumbnailOptions[thumbnailBlobIndex]
                            : ""
                    }
                />
                {thumbnailOptions?.length > 0 && (
                    <React.Fragment>
                        <Label>Thumbnail</Label>

                        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center bg-base-100 border border-border p-2 w-full m-auto rounded">
                            <div className="flex flex-wrap w-full gap-2">
                                {thumbnailOptions.map((thumbOp, thumbIdx) => {
                                    return (
                                        <div
                                            key={thumbIdx}
                                            className="relative cursor-pointer h-[50px] w-[50px]"
                                            onClick={() => handleThumbnailChoice(thumbIdx)}
                                        >
                                            <Image
                                                src={thumbOp}
                                                alt="Media"
                                                fill
                                                className={`hover:opacity-50 rounded aspect-square h-full w-full object-cover ${thumbnailBlobIndex === thumbIdx
                                                    ? "border border-primary"
                                                    : ""
                                                    }`}
                                            />

                                            {thumbnailBlobIndex === thumbIdx && (
                                                <BiSolidCircle className="absolute text-primary w-5 h-5 top-[-10px] right-[-10px]" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }

    else if (imageObjectURL) {
        return (
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <div className="relative">
                    <Button
                        variant="destructive"
                        className="absolute top-0 right-0 mt-[-10px] mr-[-8px] p-2 bg-base-100 rounded-full z-10 shadow-lg"
                        onClick={removeMedia}
                    >
                        <HiOutlineTrash className="w-5 h-5" />
                    </Button>
                    <Image
                        src={imageObjectURL}
                        alt="Media"
                        width={300}
                        height={300}
                        className="rounded-lg object-contain"
                    />
                </div>
            </div>
        )
    } else {
        return (
            <div className="w-full h-full flex flex-col gap-2">
                <Label>{label}</Label>
                <div
                    {...getRootProps({
                        className:
                            'w-full h-56 cursor-pointer flex justify-center items-center hover:bg-accent transition-all rounded-xl border-2 border-border border-dashed',
                    })}>
                    <Input {...getInputProps()} />
                    <HiPhoto className="w-8 h-8" />
                </div>
            </div>
        );
    }

}
