"use client"
import useCreateZoraEdition, { ConfigurableZoraEditionInput, ConfigurableZoraEditionOutput, flattenContractArgs, postDrop, postToMintBoard, reserveMintBoardSlot } from "@/hooks/useCreateZoraEdition"
import { useSession } from "@/providers/SessionProvider";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { RenderStandardVideoWithLoader } from "@/ui/VideoPlayer";
import { AddFundsButton, RenderMintMedia, SwitchNetworkButton } from "@/ui/Zora/common";
import { uint64MaxSafe } from "@/utils/uint64";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiPlusCircle, BiSolidCircle } from "react-icons/bi";
import { HiCamera, HiCheckBadge, HiOutlineTrash } from "react-icons/hi2";
import Decimal from "decimal.js";
import { ZoraAbi, getContractFromChainId } from "@/lib/abi/zoraEdition";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useSWRMutation from "swr/mutation";
import { nanoid } from "nanoid";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
import useLiveMintBoard from "@/hooks/useLiveMintBoard";
import { Boundary } from "@/ui/Boundary/Boundary";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import { getChainName } from "@/lib/chains/supportedChains";
import UplinkImage from "@/lib/UplinkImage"


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
                                            <UplinkImage
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
                    <UplinkImage
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




export const CreateBoardPost = ({ spaceName, displayName, chainId, referrer, templateConfig }: { spaceName: string, displayName: string, chainId: number, referrer: string, templateConfig: ConfigurableZoraEditionInput }) => {
    const { data: session, status } = useSession();
    const {
        state,
        setField,
        contractArguments,
        setContractArguments,
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
        <Boundary>

            <div className="flex flex-col gap-6 w-full m-auto mt-4 mb-16 p-4">
                <h1 className="text-3xl font-bold text-t1">Create Post</h1>

                <div className="bg-base-100 p-4 rounded-lg">
                    <p className="text-t1">Post to the {displayName} mint board and earn 0.000333 ETH for every mint!</p>
                </div>
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

                </div>
                <CreateEditionButton
                    chainId={chainId}
                    isUploading={isUploading}
                    spaceName={spaceName}
                    validate={validate}
                    contractArguments={contractArguments}
                    routeOnSuccess={`/${spaceName}/mintboard`}
                    setContractArguments={setContractArguments}
                />
            </div>
        </Boundary>

    )
}


const generateTokenIdAdjustedContractArgs = (contractArgs: ConfigurableZoraEditionOutput | null, tokenID: number | null) => {

    const appendedTokenID = tokenID ? tokenID.toString() : "";

    if (!contractArgs) {
        return null;
    }
    return {
        ...contractArgs,
        name: contractArgs.name + " " + appendedTokenID,
    }
}

const CreateEditionButton = ({
    chainId,
    spaceName,
    validate,
    contractArguments,
    setContractArguments,
    routeOnSuccess,
    isUploading
}: {
    chainId: number,
    spaceName: string,
    validate: any,
    contractArguments: ConfigurableZoraEditionOutput,
    setContractArguments: (val: ConfigurableZoraEditionOutput) => void,
    routeOnSuccess: string,
    isUploading: boolean
}) => {
    const { data: session, status } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { creator_contract, explorer } = getContractFromChainId(chainId);
    const [editionSlot, setEditionSlot] = useState<number | null>(null);
    const { mutateLiveBoard } = useLiveMintBoard(spaceName);
    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        chainId: chainId,
        address: creator_contract,
        abi: ZoraAbi,
        functionName: 'createEditionWithReferral',
        args: flattenContractArgs(generateTokenIdAdjustedContractArgs(contractArguments, editionSlot)),
        enabled: true,
    });

    const { trigger, data: postContestData, error, isMutating, reset } = useSWRMutation(
        `/api/createMintBoardPost/${spaceName}/${nanoid()}}`,
        postToMintBoard,
        {
            onError: (err) => {
                console.log(err);
                reset();
            },
        }
    );

    const { trigger: triggerReserve, data: reserveData, error: reserveError, isMutating: isReserving, reset: resetReserve } = useSWRMutation(
        `/api/reserveMintBoardSlot/${spaceName}/${nanoid()}`,
        reserveMintBoardSlot,
        {
            onError: (err) => {
                console.log(err);
                resetReserve();
            }
        }
    )
    const isInsufficientFundsError = isPrepareError ? prepareError.message.includes("insufficient funds for gas * price + value") : false;

    const {
        data,
        write,
        isLoading: isWriteLoading,
        error: writeError,
        isError: isWriteError
    } = useContractWrite({
        ...config,
        onError(err) {
            if (err.message.includes("User rejected the request")) {
                toast.error("Signature request rejected")
            }
        }
    });


    const { isLoading: isTxPending, isSuccess: isTxSuccessful } = useWaitForTransaction({
        hash: data?.hash,
        onSettled: (data, err) => {
            if (err) {
                console.log(err)
                setIsModalOpen(false);
                return toast.error('Error creating edition')
            }
            if (data) {
                const editionAddress = data.logs[0].address;
                try {
                    trigger({
                        spaceName,
                        chainId,
                        contractAddress: editionAddress,
                        dropConfig: contractArguments,
                        csrfToken: session.csrfToken,
                    }).then((response) => {
                        if (!response.success) {
                            reset();
                            resetReserve();
                        }
                        mutateLiveBoard();
                        return toast.success('Drop created!')
                    });
                } catch (e) {
                    console.log(e)
                    reset();
                    resetReserve();
                }

            }
        }
    });


    const handleSubmit = async () => {
        const result = await validate(session?.user?.address);
        if (!result.success) {
            return toast.error("Media Required")
        } else {
            setIsModalOpen(true);
        }
    }

    const handleWrite = () => {
        try {
            triggerReserve({
                spaceName,
                csrfToken: session.csrfToken,
            }).then((response) => {
                if (!response.success) {
                    resetReserve();
                }
                setEditionSlot(response.slot);
                write?.();
            });
        } catch (e) {
            console.log(e)
            resetReserve();
        }
    }

    return (
        <>
            <WalletConnectButton>
                {status === "authenticated" && (
                    <SwitchNetworkButton chainId={chainId}>
                        <button className="btn btn-primary normal-case w-auto" disabled={isModalOpen || isUploading} onClick={handleSubmit}>
                            {
                                isModalOpen ? "Creating" :
                                    isUploading ? (
                                        <div className="flex gap-2 items-center">
                                            <p className="text-sm">Uploading</p>
                                            <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                        </div>
                                    ) : "Create"
                            }
                        </button>
                    </SwitchNetworkButton>
                )}
            </WalletConnectButton>
            <EditionModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} disableClickOutside={isTxPending || isWriteLoading || isTxSuccessful}>
                {!isTxPending && !isTxSuccessful && (

                    <div className="flex flex-col gap-2 relative">
                        <div className="flex">
                            <h2 className="text-t1 text-xl font-bold">Create Drop</h2>
                            <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
                        </div>
                        <div className="p-2" />
                        {contractArguments && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black ">
                                <div className="items-center justify-center">
                                    <RenderMintMedia imageURI={contractArguments.imageURI || ""} animationURI={contractArguments.animationURI || ""} />
                                </div>
                                <div className="bg-black-200 items-start flex flex-col gap-8 relative">
                                    <div className="flex flex-col gap-2">
                                        <p className="line-clamp-3 font-bold text-lg break-all">{generateTokenIdAdjustedContractArgs(contractArguments, editionSlot).name}</p>
                                        <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1 w-fit">
                                            <UserAvatar user={session?.user} size={28} />
                                            <UsernameDisplay user={session?.user} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="grid grid-cols-3 gap-4 w-full">
                                            <div className="flex flex-col">
                                                <p className="text-t2">Mint Begins</p>
                                                <p className="font-bold text-t1">{format(new Date(parseInt(contractArguments.saleConfig.publicSaleStart) * 1000), "MMM d, h:mm aa")}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-t2">Until</p>
                                                <p className="font-bold text-t1">{contractArguments.saleConfig.publicSaleEnd === uint64MaxSafe.toString() ? "Forever" : format(new Date(parseInt(contractArguments.saleConfig.publicSaleEnd) * 1000), "MMM d, h:mm aa")}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-t2">Price</p>
                                                <p className="font-bold text-t1">{contractArguments.saleConfig.publicSalePrice === "0" ? "Free" : `${new Decimal(contractArguments.saleConfig.publicSalePrice).div(Decimal.pow(10, 18)).toString()} ETH`}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-t2">Editions</p>
                                                <p className="font-bold text-t1">{contractArguments.editionSize === "1" ? "1/1" : contractArguments.editionSize === uint64MaxSafe.toString() ? "Open" : contractArguments.editionSize}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row w-full items-end justify-end">
                            {status === "authenticated" && (
                                isInsufficientFundsError
                                    ?
                                    (<AddFundsButton chainId={chainId} />)
                                    :
                                    (
                                        <SwitchNetworkButton chainId={chainId}>
                                            <button className="btn btn-primary normal-case" disabled={!write || isWriteLoading} onClick={() => write?.()}>
                                                {isWriteLoading ?
                                                    <div className="flex gap-2 items-center">
                                                        <p className="text-sm">Awaiting signature</p>
                                                        <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                                    </div>
                                                    // :
                                                    // isReserving ? (
                                                    //     <div className="flex gap-2 items-center">
                                                    //         <p className="text-sm">Generating</p>
                                                    //         <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                                    //     </div>
                                                    // )
                                                    :
                                                    "Create"
                                                }</button>
                                        </SwitchNetworkButton>
                                    ))
                            }
                        </div>
                    </div>
                )}
                {isTxPending && (
                    <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                        <p className="text-lg text-t1 font-semibold text-center">Etching your creation into the ether</p>
                        <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        />
                    </div>
                )}
                {isTxSuccessful && (
                    <div className="animate-springUp flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                        <HiCheckBadge className="h-48 w-48 text-success" />
                        <h2 className="font-bold text-t1 text-xl">Successfully created your drop.</h2>
                        <div className="flex gap-2 items-center">
                            <a className="btn btn-ghost normal-case text-t2" href={`${explorer}/tx/${data?.hash}`} target="_blank" rel="noopener norefferer">View Tx</a>
                            <Link className="btn normal-case btn-primary" href={routeOnSuccess}>Go to MintBoard</Link>
                        </div>
                    </div>
                )}
            </EditionModal >
        </>
    )
}


const EditionModal = ({
    isModalOpen,
    children,
    onClose,
    disableClickOutside,
}: {
    isModalOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
    disableClickOutside?: boolean;
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                disableClickOutside ? null : onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, disableClickOutside]);

    if (isModalOpen) {
        return (
            <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
                <div
                    ref={modalRef}
                    className="modal-box bg-black border border-[#ffffff14] animate-springUp max-w-4xl"
                >
                    {children}
                </div>
            </div>
        );
    }
    return null;
};
