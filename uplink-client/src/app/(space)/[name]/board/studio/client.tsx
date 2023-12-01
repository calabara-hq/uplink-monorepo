"use client"
import useCreateZoraEdition, { ConfigurableZoraEditionInput } from "@/hooks/useCreateZoraEdition"
import { RenderStandardVideoWithLoader } from "@/ui/VideoPlayer";
import Image from "next/image";
import { useRef } from "react";
import { BiPlusCircle, BiSolidCircle } from "react-icons/bi";
import { HiCamera, HiOutlineTrash } from "react-icons/hi2";


const MediaUpload = ({
    handleFileChange,
    isUploading,
    animationBlob,
    imageBlob,
    thumbnailOptions,
    thumbnailBlobIndex,
    isVideo,
    removeMedia,
    setThumbnailBlobIndex,
}: {
    handleFileChange: any;
    isUploading: boolean;
    animationBlob: string | null;
    imageBlob: string | null;
    thumbnailOptions: string[];
    thumbnailBlobIndex: number | null;
    isVideo: boolean;
    removeMedia: () => void;
    setThumbnailBlobIndex: (val: number) => void;
}) => {
    const imageUploader = useRef<HTMLInputElement>(null);
    const thumbnailUploader = useRef<HTMLInputElement>(null);

    const Input = ({
        mode,
        children,
    }: {
        mode: "primary" | "thumbnail";
        children: React.ReactNode;
    }) => (
        <div className="w-full h-full">
            <input
                placeholder="asset"
                type="file"
                accept={mode === "primary" ? "image/*, video/mp4" : "image/*"}
                className="hidden"
                onChange={(event) =>
                    handleFileChange({ event, isVideo, mode })
                }
                ref={mode === "primary" ? imageUploader : thumbnailUploader}
            />
            {children}
        </div>
    );

    if (isVideo) {
        return (
            <div className="relative w-full m-auto">
                <label className="label">
                    <span className="label-text text-t2">Media</span>
                </label>
                <button
                    className="absolute top-5 -right-3 btn btn-error btn-sm btn-circle z-10 shadow-lg"
                    onClick={removeMedia}
                >
                    <HiOutlineTrash className="w-5 h-5" />
                </button>
                <RenderStandardVideoWithLoader
                    videoUrl={animationBlob || ""}
                    posterUrl={
                        thumbnailBlobIndex !== null
                            ? thumbnailOptions[thumbnailBlobIndex]
                            : ""
                    }
                />
                {thumbnailOptions?.length > 0 && (
                    <>
                        <label className="label">
                            <span className="label-text text-t2">Thumbnail</span>
                        </label>

                        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center bg-base-100 border border-border p-2 w-full m-auto rounded">
                            <div className="flex flex-wrap w-full gap-2">
                                {thumbnailOptions.map((thumbOp, thumbIdx) => {
                                    return (
                                        <div
                                            key={thumbIdx}
                                            className="relative cursor-pointer h-[100px] w-[100px]"
                                            onClick={() => setThumbnailBlobIndex(thumbIdx)}
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
                                <div>
                                    <Input mode="thumbnail">
                                        <div
                                            className="w-full h-full"
                                            onClick={() => thumbnailUploader.current?.click()}
                                        >
                                            <div className="w-[100px] h-[100px] bg-base-100 border border-border rounded opacity-50 hover:opacity-90 flex flex-col p-2 items-center justify-center cursor-pointer text-gray-500">
                                                <BiPlusCircle className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Input>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    } else if (imageBlob) {
        return (
            <div className="flex flex-col items-center">
                <label className="label self-start">
                    <span className="label-text text-t2">Media</span>
                </label>
                <div className="relative">
                    <button
                        className="absolute top-0 right-0 mt-[-10px] mr-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg"
                        onClick={removeMedia}
                    >
                        <HiOutlineTrash className="w-5 h-5" />
                    </button>
                    <Image
                        src={imageBlob}
                        alt="Media"
                        width={300}
                        height={300}
                        className="rounded-lg object-contain"
                    />
                </div>
            </div>
        );
    } else {
        return (
            <Input mode="primary">
                <label className="label">
                    <span className="label-text text-t2">Media</span>
                </label>
                <div
                    className="w-full h-56 cursor-pointer flex justify-center items-center hover:bg-base-100 transition-all rounded-xl border-2 border-border border-dashed"
                    onClick={() => imageUploader.current?.click()}
                >
                    <div className="flex justify-center items-center w-full h-full">
                        <HiCamera className="w-8 h-8" />
                    </div>
                </div>
            </Input>
        );
    }
};




export const CreateBoardPost = ({ referrer, templateConfig }: { referrer: string, templateConfig: ConfigurableZoraEditionInput }) => {
    const {
        state,
        setField,
        validate,
        isUploading,
        animationBlob,
        imageBlob,
        thumbnailOptions,
        thumbnailBlobIndex,
        isVideo,
        removeMedia,
        setThumbnailBlobIndex,
        handleFileChange,
    } = useCreateZoraEdition(referrer, templateConfig)

    return (
        <div className="flex flex-col gap-6 w-full md:w-8/12 m-auto mt-4 mb-16 p-4">
            <h1 className="text-3xl font-bold text-t1">Create Post</h1>
            <div className="flex flex-col gap-2">
                <MediaUpload
                    handleFileChange={handleFileChange}
                    isUploading={isUploading}
                    animationBlob={animationBlob}
                    imageBlob={imageBlob}
                    thumbnailOptions={thumbnailOptions}
                    thumbnailBlobIndex={thumbnailBlobIndex}
                    isVideo={isVideo}
                    setThumbnailBlobIndex={setThumbnailBlobIndex}
                    removeMedia={removeMedia}
                />
                {isVideo && (
                    <RenderStandardVideoWithLoader
                        videoUrl={animationBlob || ""}
                        posterUrl={
                            thumbnailBlobIndex !== null
                                ? thumbnailOptions[thumbnailBlobIndex]
                                : ""
                        }
                    />
                )}
            </div>
            <button className="btn btn-primary normal-case" disabled={isUploading} onClick={() => { }}>
                {isUploading ? "Uploading..." : "Create"}
            </button>
        </div>
    )
}