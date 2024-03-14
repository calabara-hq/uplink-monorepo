"use client"
import useCreateZoraEdition, { ConfigurableZoraEditionInput, ConfigurableZoraEditionOutput, flattenContractArgs, postDrop, postToMintBoard, reserveMintBoardSlot } from "@/hooks/useCreateZoraEdition"
import { useSession } from "@/providers/SessionProvider";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { AddFundsButton, RenderMintMedia, SwitchNetworkButton } from "@/ui/Zora/common";
import { uint64MaxSafe } from "@/utils/uint64";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiCheckBadge } from "react-icons/hi2";
import Decimal from "decimal.js";
import { ZoraAbi, getContractFromChainId } from "@/lib/abi/zoraEdition";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useSWRMutation from "swr/mutation";
import { nanoid } from "nanoid";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
//import useLiveMintBoard from "@/hooks/useLiveMintBoard";
import { Boundary } from "@/ui/Boundary/Boundary";
import { MediaUpload } from "@/ui/MediaUpload/MediaUpload";

export const CreateBoardPost = ({ spaceName, displayName, chainId, referrer, templateConfig }: { spaceName: string, displayName: string, chainId: number, referrer: string, templateConfig: ConfigurableZoraEditionInput }) => {
    const { data: session, status } = useSession();
    const {
        state,
        setField,
        contractArguments,
        setContractArguments,
        validate
    } = useCreateZoraEdition(referrer, templateConfig)
    const [isUploading, setIsUploading] = useState(false);
    const [ipfsImageURI, setIpfsImageUri] = useState()

    const uploadStatusCallback = (status: boolean) => {
        setIsUploading(status)
    }

    const ipfsImageCallback = (url: string) => {
        setField("imageURI", url)
    }

    const ipfsAnimationCallback = (url: string) => {
        setField("animationURI", url)
    }

    return (
        <Boundary>

            <div className="flex flex-col gap-6 w-full m-auto mt-4 mb-16 p-4">
                <h1 className="text-3xl font-bold text-t1">Create Post</h1>

                <div className="bg-base-100 p-4 rounded-lg">
                    <p className="text-t1">Post to the {displayName} mint board and earn 0.000333 ETH for every mint!</p>
                </div>
                <div className="flex flex-col gap-2">
                    <MediaUpload
                        acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'video/mp4']}
                        uploadStatusCallback={uploadStatusCallback}
                        ipfsImageCallback={ipfsImageCallback}
                        ipfsAnimationCallback={ipfsAnimationCallback}
                        maxVideoDuration={210}
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
    //const { mutateLiveBoard } = useLiveMintBoard(spaceName);
    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        //chainId: chainId,
        address: creator_contract,
        abi: ZoraAbi,
        functionName: 'createEditionWithReferral',
        args: flattenContractArgs(generateTokenIdAdjustedContractArgs(contractArguments, editionSlot)),
        enabled: true,
        onError: (err) => {
            console.log('there was an error')
            console.log(err)
        }
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
                        // mutateLiveBoard();
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
