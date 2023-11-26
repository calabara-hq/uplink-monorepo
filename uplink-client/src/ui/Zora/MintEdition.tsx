"use client";

import { ZoraAbi, getContractFromEnv } from "@/lib/abi/zoraEdition";
import { useSession } from "@/providers/SessionProvider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { AddressOrEns, UserAvatar } from "../AddressDisplay/AddressDisplay";
import { format, set } from "date-fns";
import { uint64MaxSafe } from "@/utils/uint64";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { HiCheckBadge, HiOutlineLockClosed } from "react-icons/hi2";
import { RenderMintMedia, SwitchNetworkButton } from "./common";
import { getChainName } from "@/lib/chains/supportedChains";
import { ChainLabel } from "../ContestLabels/ContestLabels";
import { TokenContractApi } from "@/lib/contract";
import { PiInfinity } from "react-icons/pi";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
import { Decimal } from "decimal.js";
import { LuMinusSquare, LuPlusSquare } from "react-icons/lu";
import { Submission } from "@/types/submission";


type FeeStructure = {
    creatorReward: bigint,
    createReward: bigint,
    mintReferral: bigint,
    zoraFee: bigint,
    firstMinterReward: bigint,
    total: bigint
} | {
    editionPrice: bigint,
    createReward: bigint,
    mintReferral: bigint,
    zoraFee: bigint,
    firstMinterReward: bigint,
    total: bigint
}

const computeEthToSpend = (publicSalePrice: string, numEditions: string) => {
    if (numEditions === '') return {
        creatorReward: BigInt(0),
        createReward: BigInt(0),
        mintReferral: BigInt(0),
        zoraFee: BigInt(0),
        firstMinterReward: BigInt(0),
        total: BigInt(0)
    };

    const bigNumEditions = BigInt(numEditions);

    // defaults
    const creatorReward = BigInt("333000000000000") * bigNumEditions;
    const createReward = BigInt("111000000000000") * bigNumEditions;
    const mintReferral = BigInt("111000000000000") * bigNumEditions;
    const zoraFee = BigInt("111000000000000") * bigNumEditions;
    const firstMinterReward = BigInt("111000000000000") * bigNumEditions;

    if (publicSalePrice === "0") { // free mint

        return {
            creatorReward,
            createReward,
            mintReferral,
            zoraFee,
            firstMinterReward,
            total: creatorReward + createReward + mintReferral + zoraFee + firstMinterReward
        }
    }
    else { // paid mint
        const editionPrice = BigInt(publicSalePrice) * bigNumEditions
        const p_createReward = createReward * BigInt(2);
        const p_mintReferral = mintReferral * BigInt(2);
        const p_zoraFee = zoraFee * BigInt(2);
        const p_firstMinterReward = firstMinterReward
        return {
            editionPrice,
            createReward: p_createReward,
            mintReferral: p_mintReferral,
            zoraFee: p_zoraFee,
            firstMinterReward,
            total: editionPrice + p_createReward + p_mintReferral + p_zoraFee + p_firstMinterReward
        }
    }

}


const formatFeeKey = (key: string) => {
    switch (key) {
        case "editionPrice":
            return "Edition Price";
        case "creatorReward":
            return "Creator Reward";
        case "createReward":
            return "Create Referral";
        case "mintReferral":
            return "Mint Referral";
        case "zoraFee":
            return "Zora Fee";
        case "firstMinterReward":
            return "First Minter";
        case "total":
            return "Total";
        default:
            return key;
    }
}


const useTotalSupply = (chainId, contractAddress) => {
    const [totalSupply, setTotalSupply] = useState<string | null>(null);
    const tokenApi = new TokenContractApi(chainId);

    const getSupply = () => {
        tokenApi.tokenGetTotalSupply({ contractAddress }).then(supply => {
            setTotalSupply(supply.toString());
        })
    }

    useEffect(() => {
        getSupply();
        const interval = setInterval(() => {
            getSupply();
        }, 10_000);

        return () => clearInterval(interval);

    }, [])

    return {
        totalSupply,
        isLoading: totalSupply === null,
    }
}


const CounterInput = ({ count, setCount, max }: { count: string, setCount: (count: string) => void, max: string }) => {

    const handleInputChange = (e) => {
        setCount(
            BigInt(e.target.value) > BigInt(max)
                ?
                max
                :
                asPositiveInt(e.target.value)
        )
    }

    return (
        <div className="flex items-center w-full">
            <button className="btn bg-base rounded-r-none border-none normal-case m-auto" disabled={count === '1' || count === ''} onClick={() => setCount((Number(count) - 1).toString())}><LuMinusSquare className="w-4 h-4" /></button>
            <div className="w-full">
                <input
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={count}
                    onChange={handleInputChange}
                    className="input w-[1px] min-w-full rounded-none focus:ring-0 focus:border-none focus:outline-none text-center"
                />
            </div>
            <button className="btn rounded-l-none bg-base border-none normal-case ml-auto" disabled={max ? Number(count) >= Number(max) : false} onClick={() => setCount((Number(count) + 1).toString())}><LuPlusSquare className="w-4 h-4" /></button>
        </div>
    )
}


const asPositiveInt = (value: string) => {
    return value.trim() === "" ? "" : Math.abs(Math.round(Number(value))).toString();
}

const RenderFeeInfo = ({ feeStructure }: { feeStructure: FeeStructure }) => {
    const [isFeeInfoOpen, setIsFeeInfoOpen] = useState<boolean>(false);
    return (
        < div className="relative w-full" >
            <button className="flex items-center w-full"
                onClick={() => setIsFeeInfoOpen(!isFeeInfoOpen)}
            >
                <p className="text-t2">{`Fee: ${new Decimal(feeStructure.total.toString()).div(Decimal.pow(10, 18)).toString()} ETH`}</p>
                <span className="ml-auto">{isFeeInfoOpen ? <LuMinusSquare className="w-4 h-4" /> : <LuPlusSquare className="w-4 h-4" />}</span>
            </button>
            <div
                className={`w-full flex flex-col gap-2 ${isFeeInfoOpen ? "h-[200px]" : "h-0"} overflow-hidden transition-all duration-300 ease-in-out`}
            >
                {isFeeInfoOpen && <div className="w-full bg-base-100 h-[1px]" />}

                {isFeeInfoOpen && Object.entries(feeStructure).map(([key, value], idx) => {
                    const formattedKey = formatFeeKey(key);
                    return (
                        <div className="flex" key={idx}>
                            <p className="text-t2 text-sm">{formattedKey}</p>
                            <p className="text-t2 ml-auto text-sm">{`${new Decimal(value.toString()).div(Decimal.pow(10, 18)).toString()}`}</p>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

const MintEdition = ({ submission, setIsModalOpen, referrer }: { submission: Submission, setIsModalOpen: (val: boolean) => void, referrer?: string }) => {
    const dropConfig = submission.nftDrop.dropConfig ? JSON.parse(submission.nftDrop.dropConfig) : null;
    dropConfig.saleConfig.publicSaleEnd = new Date()
    const { chainId, contractAddress } = submission.nftDrop;
    const { data: session, status } = useSession();
    const [numEditions, setNumEditions] = useState<string>('1');
    const debouncedNumEditions = useDebounce(numEditions);
    const { explorer } = getContractFromEnv();
    const feeStructure = computeEthToSpend(dropConfig.saleConfig.publicSalePrice, debouncedNumEditions)
    const { isLoading: isTotalSupplyLoading, totalSupply } = useTotalSupply(chainId, contractAddress);

    const isReferralValid = referrer ? referrer.startsWith('0x') && referrer.length === 42 : false;

    const { config, error: prepareError, isError: isPrepareError, isLoading: isPrepareLoading } = usePrepareContractWrite({
        chainId: chainId,
        address: contractAddress,
        abi: ZoraAbi,
        functionName: 'mintWithRewards',
        args: [
            session?.user?.address,
            debouncedNumEditions,
            "",
            isReferralValid ? referrer : "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8"
        ],
        enabled: true,
        value: feeStructure.total.toString(),
    });

    const isInsufficientFundsError = isPrepareError ? prepareError.message.includes("insufficient funds for gas * price + value") : false;

    const {
        data,
        write,
        isLoading: isWriteLoading,
        error: writeError,
        isError: isWriteError
    } = useContractWrite(
        {
            ...config,
            onError(err) {
                if (err.message.includes("User rejected the request")) {
                    toast.error("Signature request rejected")
                }
            }
        }
    );

    const availableEditions = BigInt(dropConfig.editionSize) - BigInt(totalSupply || 0)
    const areEditionsSoldOut = availableEditions <= 0;
    const isMintPeriodOver = dropConfig.saleConfig.publicSaleEnd === uint64MaxSafe.toString() ? false : parseInt(dropConfig.saleConfig.publicSaleEnd) < Date.now() / 1000;
    const isMintDisabled = areEditionsSoldOut || isMintPeriodOver || !write || isWriteLoading


    const { isLoading: isTxPending, isSuccess: isTxSuccessful } = useWaitForTransaction({
        hash: data?.hash,
        onSettled: (data, err) => {
            if (err) {
                console.log(err)
                setIsModalOpen(false);
                return toast.error('Error minting edition')
            }
        }
    })

    const RenderTotalSupply = () => {
        if (isTotalSupplyLoading) {
            return (
                <div className="inline-block h-3 w-3 animate-spin text-t2 rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                />
            )
        }
        else {
            return (
                <p className="text-t1 font-bold">{totalSupply}</p>
            )
        }
    }

    const RenderEditionSize = () => {
        if (dropConfig.editionSize === uint64MaxSafe.toString()) {
            return (
                <PiInfinity className="w-6 h-6 text-t1" />
            )
        }
        else return (
            <p className="text-t1 font-bold">{dropConfig.editionSize}</p>
        )
    }

    return (
        <>
            {!isTxPending && !isTxSuccessful && (
                <div className="flex flex-col gap-2 relative">
                    <div className="flex">
                        <h2 className="text-t1 text-xl font-bold">Mint Drop</h2>
                        <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
                    </div>
                    <div className="p-2" />
                    {dropConfig && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black ">
                            <div className="items-center justify-center">
                                <RenderMintMedia imageURI={dropConfig.imageURI || ""} animationURI={dropConfig.animationURI || ""} />
                            </div>
                            <div className="bg-black-200 items-start flex flex-col gap-8 relative">
                                <div className="flex flex-col gap-2">
                                    <p className="line-clamp-3 font-bold text-lg break-all">{dropConfig.name}</p>
                                    <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1">
                                        <UserAvatar address={submission.author.address} size={28} />
                                        <AddressOrEns address={submission.author.address} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col justify-start">
                                            <p className="text-t2">Network</p>
                                            <div className="flex gap-2 items-center">
                                                <p className="text-t1 font-bold">{getChainName(parseInt(chainId))}</p>
                                                <ChainLabel chainId={parseInt(chainId)} px={16} />
                                            </div>

                                        </div>
                                        <div className="flex flex-col justify-start m-auto">
                                            {parseInt(dropConfig.saleConfig.publicSaleStart) > Date.now() / 1000 ? (
                                                <>
                                                    <p className="text-t2">Mint Begins</p>
                                                    <p className="font-bold text-t1">{format(new Date(parseInt(dropConfig.saleConfig.publicSaleStart) * 1000), "MMM d, h:mm aa")}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-t2">Minting</p>

                                                    <div className="flex gap-2 items-center">
                                                        {
                                                            areEditionsSoldOut
                                                                ? (<p className="font-bold text-t1">Sold Out</p>
                                                                )
                                                                :
                                                                isMintPeriodOver ? (
                                                                    <p className="font-bold text-t1">Closed</p>
                                                                ) : (
                                                                    <>
                                                                        <p className="font-bold text-t1">Now</p>
                                                                        <span className="relative flex h-3 w-3">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                                                        </span>
                                                                    </>
                                                                )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-t2">{isMintPeriodOver ? "Ended" : "Until"}</p>
                                            <p className="font-bold text-t1">{dropConfig.saleConfig.publicSaleEnd === uint64MaxSafe.toString() ? "Forever" : format(new Date(dropConfig.saleConfig.publicSaleEnd * 1000), "MMM d, h:mm aa")}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-t2">Price</p>
                                            <p className="font-bold text-t1">{dropConfig.saleConfig.publicSalePrice === "0" ? "Free" : `${dropConfig.saleConfig.publicSalePrice * 10 ** -18} ETH`}</p>
                                        </div>
                                        <div className="flex flex-col justify-start m-auto">
                                            <p className="text-t2">Minted</p>
                                            <div className="flex gap-1">
                                                <RenderTotalSupply />
                                                <p className="text-t1">/</p>
                                                <RenderEditionSize />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1" />
                                    <div className="w-full bg-base-100 h-[1px]" />

                                    {!areEditionsSoldOut && !isMintPeriodOver && <div className="flex flex-col w-full md:max-w-[250px] ml-auto gap-2">
                                        <CounterInput count={numEditions} setCount={setNumEditions} max={availableEditions.toString()} />
                                        <WalletConnectButton styleOverride="w-full">
                                            {isPrepareLoading && (
                                                <button className="btn" disabled={true}>
                                                    <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                                </button>
                                            )}
                                            {status === "authenticated" && !isPrepareLoading && (
                                                isInsufficientFundsError
                                                    ?
                                                    (<Link className="btn btn-outline btn-warning normal-case w-full" href='https://bridge.base.org/deposit' prefetch={false} target="_blank">Add Funds</Link>)
                                                    :
                                                    (
                                                        <SwitchNetworkButton chainId={parseInt(chainId)}>

                                                            <button className="btn btn-primary normal-case w-full" disabled={isMintDisabled} onClick={() => write?.()}>
                                                                {isWriteLoading ?
                                                                    <div className="flex gap-2 items-center">
                                                                        <p className="text-sm">Awaiting signature</p>
                                                                        <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                                                    </div>
                                                                    : "Mint"
                                                                }</button>
                                                        </SwitchNetworkButton>
                                                    ))}
                                        </WalletConnectButton>
                                        <RenderFeeInfo feeStructure={feeStructure} />
                                    </div>
                                    }

                                </div>
                            </div>
                        </div >
                    )}
                </div >
            )}

            <div className="p-2" />

            {
                isTxPending && (
                    <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                        <p className="text-lg text-t1 font-semibold text-center">Minting your NFT</p>
                        <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        />
                    </div>
                )
            }
            {
                isTxSuccessful && (
                    <div className="animate-springUp flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                        <HiCheckBadge className="h-48 w-48 text-success" />
                        <h2 className="font-bold text-t1 text-xl">Got it.</h2>
                        <div className="flex gap-2 items-center">
                            <a className="btn btn-ghost normal-case text-t2" href={`${explorer}/tx/${data?.hash}`} target="_blank" rel="noopener norefferer">View Tx</a>
                            <button className="btn normal-case btn-primary" onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MintEdition;