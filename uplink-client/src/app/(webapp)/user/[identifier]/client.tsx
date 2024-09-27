// "use client"
// import useMe from "@/hooks/useMe"
// import { ZoraAbi, getContractFromChainId } from "@/lib/abi/zoraEdition";
// import { getChainName, supportedChains } from "@/lib/chains/supportedChains";
// import { TokenContractApi } from "@/lib/contract";
// import { useSession } from "@/providers/SessionProvider";
// import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
// import { UserSubmissionDisplay } from "@/ui/Submission/SubmissionDisplay";
// import { useEffect, useState } from "react";
// import { Decimal } from 'decimal.js'
// import toast from "react-hot-toast";
// import { TbLoader2 } from "react-icons/tb";
// import Link from "next/link";
// import { AddFundsButton, SwitchNetworkButton } from "@/ui/Zora/common";
// import { Submission } from "@/types/submission";
// import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
// import { User } from "@/types/user";
// import { HiPencil } from "react-icons/hi2";
// import { FaTwitter } from "react-icons/fa";
// import { MdOutlineCancelPresentation } from "react-icons/md";
// import UplinkImage from "@/lib/UplinkImage"

// export const ManageAccountButton = ({ }) => {

// }

// const hasProfile = (user: User) => {
//     return user.userName && user.displayName
// }

// export const RewardsSkeleton = () => {
//     return (
//         <div className="flex flex-col bg-base-100 h-60 w-fit min-w-[350px] rounded-xl border border-border p-2 gap-4 m-auto md:mt-auto md:mr-0 md:ml-auto md:mb-0">
//             <div className="bg-base-200 shimmer h-4 rounded-lg w-1/3" />
//             <div className="grid grid-cols-3 space-y-4">
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-1/2 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-1/2 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-1/2 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-3/4 m-auto rounded-lg" />
//                 <div className="bg-base-200 shimmer h-4 w-1/2 m-auto rounded-lg" />
//             </div>
//             <div />
//         </div>
//     )
// }

// export const ClientUserProfile = ({ accountAddress }: { accountAddress: string }) => {
//     const { me: user, isMeLoading, isMeError } = useMe(accountAddress);
//     return (
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center md:m-auto gap-4 w-full">
//             <div className="relative w-fit pt-8 m-auto mt-0 md:mr-auto md:ml-0">
//                 <div className="absolute top-0 left-0 right-0 ml-auto mr-auto md:-left-5 md:right-full w-32 h-32 z-10">
//                     {user.profileAvatar ? (<UplinkImage
//                         src={user.profileAvatar}
//                         alt="avatar"
//                         fill
//                         className="rounded-full object-cover"
//                         sizes="10vw"
//                         quality={100}
//                     />) : (
//                         <div className="rounded-full bg-base-200 shimmer w-32 h-32" />
//                     )}
//                 </div>

//                 <div className="relative h-fit w-[300px] rounded-xl border border-border p-2 grid grid-rows-[100px_auto] md:grid-cols-[100px_auto]">
//                     <div className="" />
//                     {hasProfile(user) ? (
//                         <>
//                             <div className="h-full p-2 hidden md:flex md:flex-col" >
//                                 <p className="text-xl font-bold text-t1 text-center md:text-left">{user.displayName}</p>
//                                 <p className="text-sm text-t1 text-center md:text-left">{user.userName}</p>
//                                 <Link className="btn btn-ghost btn-sm absolute text-t2 bottom-0 right-0" href={`/user/${user.address}/settings`}>
//                                     <HiPencil className="w-5 h-5" />
//                                 </Link>

//                             </div>
//                         </>
//                     ) : (
//                         <div className="justify-center items-center hidden md:flex md:flex-col">
//                             <Link href={`/user/${user.address}/settings`} className="btn btn-primary btn-sm normal-case">Set up profile</Link>
//                         </div>
//                     )}

//                     <div className="col-span-2 flex flex-col gap-6">
//                         {hasProfile(user) ? (
//                             <>
//                                 <div className="flex flex-col md:hidden">
//                                     <p className="text-xl font-bold text-t1 text-center md:text-left">{user.displayName}</p>
//                                     <p className="text-sm text-t1 text-center md:text-left">{user.userName}</p>
//                                 </div>
//                                 <Link className="btn btn-ghost absolute top-0 right-0 text-t2 md:hidden" href={`/user/${user.address}/settings`} draggable={false}>
//                                     <HiPencil className="w-5 h-5" />
//                                 </Link>
//                             </>
//                         ) : (
//                             <div className="flex flex-col justify-center items-center md:hidden">
//                                 <Link href={`/user/${user.address}/settings`} className="btn btn-primary btn-sm normal-case">Set up profile</Link>
//                             </div>
//                         )}

//                         {user.twitterHandle && user.visibleTwitter && (
//                             <div className="flex flex-row gap-2 items-center hover:text-blue-500 justify-center md:justify-start">
//                                 <FaTwitter className="w-4 h-4 text-t2" />
//                                 <Link
//                                     href={`https://twitter.com/${user.twitterHandle}`}
//                                     rel="noopener noreferrer"
//                                     draggable={false}
//                                     target="_blank"
//                                     className="text-blue-500 hover:underline"
//                                     prefetch={false}
//                                 >
//                                     {user.twitterHandle}
//                                 </Link>
//                             </div>
//                         )}
//                         {!hasProfile && <button className="btn normal-case mb-1">Claim Account</button>}
//                     </div>
//                 </div>
//             </div>
//             <ProtocolRewards accountAddress={accountAddress} />
//         </div >
//     )
// }

// export const UserSubmissions = ({ accountAddress, isMintableOnly }: { accountAddress: string, isMintableOnly: boolean }) => {
//     const { me, isMeLoading, isMeError } = useMe(accountAddress);
//     const filteredSubs = isMintableOnly ? me.submissions.filter((el: Submission) => el.edition) : me.submissions

//     const user: User = {
//         ...me,
//         submissions: filteredSubs
//     }

//     return <UserSubmissionDisplay user={user} />
// }

// const useClaimableBalance = (chainId: number, contractAddress: string) => {
//     const [balance, setBalance] = useState<string | null>(null);
//     const [triggerRefresh, setTriggerRefresh] = useState(0);
//     const { data: session, status } = useSession();
//     const tokenApi = new TokenContractApi(chainId);

//     const getBalance = (userAddress: string) => {
//         tokenApi.zoraGetRewardBalance({ contractAddress, userAddress }).then(balance => {
//             setBalance(balance.toString());
//         })
//     }

//     useEffect(() => {
//         if (session?.user?.address) {
//             getBalance(session?.user?.address)
//         }

//     }, [session?.user?.address, triggerRefresh])

//     return {
//         balance,
//         isLoading: balance === null,
//         triggerRefresh: () => {
//             setTriggerRefresh(triggerRefresh + 1)
//         }
//     }
// }


// const ProtocolRewards = ({ accountAddress }: { accountAddress: string }) => {
//     const { me, isUserAuthorized, isMeLoading, isMeError } = useMe(accountAddress);
//     if (isMeLoading) return <RewardsSkeleton />
//     if (!isMeLoading && !isUserAuthorized) return null;
//     return (
//         <div className="flex flex-col bg-base-100 w-fit min-w-[350px] justify-between rounded-xl border border-border p-2 gap-4 m-auto md:mt-auto md:mr-0 md:ml-auto md:mb-0">
//             <h2 className="text-t1 font-bold text-xl">Protocol Rewards</h2>
//             {supportedChains.map(chain => {
//                 return <ClaimableUserRewards key={chain.id} accountAddress={accountAddress} chainId={chain.id} />
//             })}
//         </div>
//     )
// }


// export const ClaimableUserRewards = ({ accountAddress, chainId }: { accountAddress: string, chainId: number }) => {
//     const { data: session, status } = useSession();
//     const { rewards_contract } = getContractFromChainId(chainId);
//     const { balance, isLoading: isBalanceLoading, triggerRefresh } = useClaimableBalance(chainId, rewards_contract)
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     return (

//         <div className="grid grid-cols-3 items-center w-full">
//             <div className="flex gap-2 items-center">
//                 <p className="text-t1 ">{getChainName(chainId)}</p>
//                 <ChainLabel chainId={chainId} px={16} />
//             </div>

//             <div className="ml-auto text-left">
//                 {isBalanceLoading ?
//                     (<TbLoader2 className="w-4 h-4 text-t2 animate-spin ml-auto" />)
//                     :
//                     (<div className="text-t1 font-bold">{`${new Decimal(balance).div(Decimal.pow(10, 18)).toString()} ETH`}</div>)
//                 }
//             </div>
//             <div className="ml-auto">
//                 {!isBalanceLoading && new Decimal(balance).greaterThan(0) ? (
//                     <button className="btn btn-sm btn-primary normal-case" onClick={() => setIsModalOpen(true)}>Claim</button>
//                 ) : (
//                     <span />
//                 )}
//             </div>
//             <ClaimRewardsModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} chainId={chainId} claimableBalance={balance} rewardsContract={rewards_contract} triggerRefresh={triggerRefresh} />
//         </div>

//     )
// }




// const ClaimRewardsModal = ({ isModalOpen, onClose, chainId, claimableBalance, rewardsContract, triggerRefresh }) => {
//     const { data: session, status } = useSession();
//     const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
//         //chainId: chainId,
//         address: rewardsContract,
//         abi: ZoraAbi,
//         functionName: 'withdraw',
//         args: [session?.user?.address, BigInt(claimableBalance || '0')],
//         enabled: true,
//     });

//     const isInsufficientFundsError = isPrepareError ? prepareError.message.includes("insufficient funds for gas * price + value") : false;

//     const {
//         data,
//         write,
//         isLoading: isWriteLoading,
//         error: writeError,
//         isError: isWriteError
//     } = useContractWrite({
//         ...config,
//         onError(err) {
//             if (err.message.includes("User rejected the request")) {
//                 toast.error("Signature request rejected")
//             }
//         }
//     });

//     const { isLoading: isTxPending, isSuccess: isTxSuccessful } = useWaitForTransaction({
//         hash: data?.hash,
//         onSettled: (data, err) => {
//             if (err) {
//                 console.log(err)
//                 return toast.error('Error claiming rewards')
//             }
//             if (data) {
//                 toast.success('Successfully claimed your rewards')
//             }
//         },

//     });

//     useEffect(() => {
//         if (isTxSuccessful) {
//             triggerRefresh();
//             toast.success('Successfully claimed your rewards')
//             onClose();
//         }
//     }, [isTxSuccessful])


//     if (isModalOpen) {
//         return (
//             <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
//                 <div
//                     className="modal-box bg-black border border-border animate-springUp max-w-sm"
//                 >
//                     <div className="flex flex-col gap-4 items-center justify-center">
//                         <div className="flex items-center w-full">
//                             <h2 className="text-t1 font-bold text-xl">Claim Rewards</h2>
//                             <button className="btn btn-ghost btn-sm ml-auto" onClick={onClose}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
//                         </div>
//                         <ChainLabel chainId={chainId} px={128} />
//                         <p className="text-t1 text-center">Nice work! You have <b>{`${new Decimal(claimableBalance).div(Decimal.pow(10, 18)).toString()} ETH`}</b> in protocol rewards on {getChainName(chainId)}.</p>
//                         {isInsufficientFundsError
//                             ?
//                             (<AddFundsButton chainId={chainId} />)
//                             :
//                             <SwitchNetworkButton chainId={chainId}>
//                                 <button className="btn btn-primary normal-case w-full" disabled={isTxPending || isWriteLoading}
//                                     onClick={() => write?.()}
//                                 >
//                                     {isWriteLoading ?
//                                         <div className="flex gap-2 items-center">
//                                             <p className="text-sm">Awaiting signature</p>
//                                             <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
//                                         </div>
//                                         :
//                                         isTxPending ? (
//                                             <div className="flex gap-2 items-center">
//                                                 <p className="text-sm">Claiming</p>
//                                                 <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
//                                             </div>
//                                         ) : "Claim"
//                                     }
//                                 </button>
//                             </SwitchNetworkButton>
//                         }
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//     return null;
// }