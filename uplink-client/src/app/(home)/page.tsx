
import Image from "next/image";
import Link from "next/link";
import ArtistPfp from "@/../public/pumey_pfp.jpg";
import ArtistSubmission from "@/../public/vinnie_noggles.png";
import landingBg from "@/../public/landing-bg.svg";
import UplinkImage from "@/lib/UplinkImage";
import { ContestSubCardA, FeatureCard } from "./feature";
import { Button } from "@/ui/DesignKit/Button";
import { FaCircle, FaPalette } from "react-icons/fa";
import { LuCoins } from "react-icons/lu";
import { PiInfinity } from "react-icons/pi";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import { RenderMintMedia } from "@/ui/Token/MintUtils";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import { MdAccessibility, MdDashboardCustomize, MdGroups } from "react-icons/md";

export const dynamic = 'force-static';
export const runtime = 'nodejs';



const BannerSection = () => {
  return (
    <div className="w-full h-screen min-h-[750px] flex-grow flex flex-col relative">
      <div className="w-11/12 xl:w-10/12 2xl:w-8/12 py-12 ml-auto mr-auto z-10">
        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
          <div className="flex flex-col gap-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Where communities shape culture, <span className="text-primary9">onchain</span>.
            </h1>
            {/* <p className="mt-3 text-xl text-t3">
              From crowdsourced community galleries to bounty and grant programs, uplink makes it simple,
              fun, and enjoyable for community members to create with their peers, earn rewards for their
              contributions, and shape the culture of their favorite projects.

              Use uplink to bring your communitie
            </p> */}
            {/* Buttons */}
            {/* <p className="text-t2 text-2xl">Multiplayer tools for a more fun and fair internet</p> */}
            <Link href="/spacebuilder/create?referral=home" passHref>
              <Button variant="secondary" className="w-fit" size={"lg"}>Add your organization</Button>
            </Link>

            {/* End Buttons */}
            <span className="flex items-center gap-1 z-10 mb-10">
              <p className="font-bold text-t2">Powered by</p>
              <a className="flex items-center gap-1" target="_blank" href="https://nouns.wtf">
                <div className="w-8 h-8">
                  <svg
                    width="40"
                    height="30"
                    viewBox="0 0 160 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="crispEdges"
                  >
                    <path d="M90 0H30V10H90V0Z" fill={"#D53C5E"} />
                    <path d="M160 0H100V10H160V0Z" fill={"#D53C5E"} />
                    <path d="M40 10H30V20H40V10Z" fill={"#D53C5E"} />
                    <path d="M60 10H40V20H60V10Z" fill="white" />
                    <path d="M80 10H60V20H80V10Z" fill="black" />
                    <path d="M90 10H80V20H90V10Z" fill={"#D53C5E"} />
                    <path d="M110 10H100V20H110V10Z" fill={"#D53C5E"} />
                    <path d="M130 10H110V20H130V10Z" fill="white" />
                    <path d="M150 10H130V20H150V10Z" fill="black" />
                    <path d="M160 10H150V20H160V10Z" fill={"#D53C5E"} />
                    <path d="M40 20H0V30H40V20Z" fill={"#D53C5E"} />
                    <path d="M60 20H40V30H60V20Z" fill="white" />
                    <path d="M80 20H60V30H80V20Z" fill="black" />
                    <path d="M110 20H80V30H110V20Z" fill={"#D53C5E"} />
                    <path d="M130 20H110V30H130V20Z" fill="white" />
                    <path d="M150 20H130V30H150V20Z" fill="black" />
                    <path d="M160 20H150V30H160V20Z" fill={"#D53C5E"} />
                    <path d="M10 30H0V40H10V30Z" fill={"#D53C5E"} />
                    <path d="M40 30H30V40H40V30Z" fill={"#D53C5E"} />
                    <path d="M60 30H40V40H60V30Z" fill="white" />
                    <path d="M80 30H60V40H80V30Z" fill="black" />
                    <path d="M90 30H80V40H90V30Z" fill={"#D53C5E"} />
                    <path d="M110 30H100V40H110V30Z" fill={"#D53C5E"} />
                    <path d="M130 30H110V40H130V30Z" fill="white" />
                    <path d="M150 30H130V40H150V30Z" fill="black" />
                    <path d="M160 30H150V40H160V30Z" fill={"#D53C5E"} />
                    <path d="M10 40H0V50H10V40Z" fill={"#D53C5E"} />
                    <path d="M40 40H30V50H40V40Z" fill={"#D53C5E"} />
                    <path d="M60 40H40V50H60V40Z" fill="white" />
                    <path d="M80 40H60V50H80V40Z" fill="black" />
                    <path d="M90 40H80V50H90V40Z" fill={"#D53C5E"} />
                    <path d="M110 40H100V50H110V40Z" fill={"#D53C5E"} />
                    <path d="M130 40H110V50H130V40Z" fill="white" />
                    <path d="M150 40H130V50H150V40Z" fill="black" />
                    <path d="M160 40H150V50H160V40Z" fill={"#D53C5E"} />
                    <path d="M90 50H30V60H90V50Z" fill={"#D53C5E"} />
                    <path d="M160 50H100V60H160V50Z" fill={"#D53C5E"} />
                  </svg>
                </div>
                <p className="font-bold ml-2 text-[#D53C5E]">Nouns</p>
              </a>
            </span>

          </div>
          {/* Col */}
          <div className="relative ms-4">
            <div className="rounded-lg bg-base-100 border border-border w-full max-w-[500px]">
              <div className="flex flex-row items-center gap-2 p-4 bg-base-200 rounded-lg rounded-b-none">
                <FaCircle className="text-red-500 w-4 h-4" />
                <FaCircle className="text-yellow-500 w-4 h-4" />
                <FaCircle className="text-green-500 w-4 h-4" />
              </div>
              <div className="grid grid-cols-[32px_auto] md:grid-cols-[64px_auto] p-4">
                <UplinkImage
                  src={ArtistPfp}
                  alt="swim shady"
                  width={50}
                  height={50}
                  sizes="10vw"
                  className="rounded-full"
                  blur={false}
                />
                <div className="flex-grow flex flex-col gap-2 ml-4">
                  <p className="text-t1">
                    <span className="text-primary11">@vinniehager</span> noggles!
                  </p>
                  <div className="flex-grow flex flex-col items-center">
                    <div className="relative w-full">
                      <UplinkImage
                        src={ArtistSubmission}
                        alt="twitter submission"
                        className="rounded-lg object-contain"
                        width={600}
                        priority
                        blur={false}
                      />
                    </div>
                    <div className="text-sm text-t2 italic font-[500] self-start text-left">
                      <Link
                        href="https://twitter.com/pumey_arts"
                        target="_blank"
                        className="hover:underline"
                        prefetch={false}
                        draggable={false}
                      >
                        @pumey_arts -
                      </Link>{" "}
                      Vinnie Hager x Nouns contest
                    </div>
                  </div>
                  {/* <div className="w-full h-0.5 bg-border"></div>
                  <div className="flex items-center justify-start w-full">
                    <HiPhoto className="w-5 h-5 opacity-50" />
                    <BiPlusCircle className="w-5 h-5 opacity-50 ml-auto mr-2" />
                    <button
                      className="btn btn-xs btn-primary normal-case"
                      disabled
                    >
                      Submitting
                      <div
                        className="text-xs ml-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}
      <Image
        src={landingBg}
        alt=""
        fill
        className="absolute !h-[60%] !bottom-20 !left-0 !top-auto object-cover"
      />
      <div className="absolute w-full h-28 !-bottom-4 !left-0 !top-auto bg-gradient-to-b from-[#d53867] via-[#d53867] to-base" />
      {/* <div className= */}
    </div >
  )
}


const WarpcastUserLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link className="flex items-center gap-1 text-t3 hover:underline" href={href} target="_blank">
      <svg width="16" height="16" viewBox="0 0 1000 1000" fill="#7c7a85" xmlns="http://www.w3.org/2000/svg">
        <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" fill="#7c7a85" />
        <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill="#7c7a85" />
        <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" fill="#7c7a85" />
      </svg>
      {children}
    </Link>
  )
}


export default async function Page() {
  return (
    <div className="flex flex-col w-full mb-16 gap-12">
      <BannerSection />
      <div className="flex flex-col w-11/12 xl:w-10/12 2xl:w-8/12 m-auto gap-24 mt-24 md:mt-0">

        {/*mintboard section*/}
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="order-2 lg:order-1 h-fit w-full m-auto">
              <FeatureCard>
                <div className="flex flex-col gap-2 h-full relative w-full rounded-xl p-4 shadow-base shadow-lg">
                  <h2 className="text-t1 text-xl font-bold">Mint Drop</h2>
                  <div className="p-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    <div className="items-center justify-center">
                      <RenderMintMedia imageURI="https://uplink.mypinata.cloud/ipfs/QmTzwdiWEbgo2AmRMtn1AsHQed4XyJvieYsaNwYEDY8ivP" animationURI="" />
                    </div>
                    <div className="bg-black items-start flex flex-col gap-8 relative">
                      <div className="flex flex-col gap-2">
                        <p className="line-clamp-3 font-bold text-lg break-all">Based Management</p>
                        <div className="flex items-center text-sm text-t2 bg-base rounded-lg p-1 pr-2 w-fit">
                          <div style={{ width: '28px' }}>
                            <ImageWrapper>
                              <UplinkImage src="https://uplink.mypinata.cloud/ipfs/QmP4anosdNmt4PdGTF134UxUrxcJq9TCWbTSaMy98jubPP" alt="avatar" className="rounded-lg" fill blur sizes="5vw" />
                            </ImageWrapper>
                          </div>
                          <span className="font-bold italic">LGHT</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col justify-start">
                            <p className="text-t2">Network</p>
                            <div className="flex gap-2 items-center">
                              <p className="text-t1 font-bold">Base</p>
                              <ChainLabel chainId={8453} px={16} />
                            </div>

                          </div>
                          <div className="flex flex-col justify-start m-auto">
                            <p className="text-t2">Minting</p>
                            <div className="flex gap-2 items-center">
                              <p className="font-bold text-t1">Now</p>
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-t2">Until</p>
                            <p className="font-bold text-t1">Forever</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-t2">Price</p>
                            <p className="font-bold text-t1">Free</p>
                          </div>
                          <div className="flex flex-col justify-start m-auto">
                            <p className="text-t2">Minted</p>
                            <div className="flex gap-1 items-center">
                              <p className="text-t1 font-bold">100</p>
                              <p className="text-t1">/</p>
                              <PiInfinity className="w-6 h-6 text-t1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div >
                </div >
              </FeatureCard>
            </div>
            <div className="flex flex-col gap-12 order-1 lg:order-2">
              <h1 className="text-3xl font-bold text-t2 ">
                Mintboards. A <span className="text-t1">multiplayer</span> canvas for onchain creation.
              </h1>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <Button variant="secondary" className="w-12 h-12 rounded-lg p-2.5">
                    <MdGroups className="w-10 h-10" />
                  </Button>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xl font-bold text-t1">Bring the groupchat to the blockchain</p>
                    <p className="text-lg text-t2">
                      Create a multiplayer gallery for the memes, art, and culture your community is already creating.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Button variant="secondary" className="w-12 h-12 rounded-lg p-2.5">
                    <LuCoins className="w-10 h-10" />
                  </Button>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xl font-bold text-t1">Custom fees</p>
                    <p className="text-lg text-t2">Free means free. Price mints and set protocol splits however you like.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Button variant="secondary" className="w-12 h-12 rounded-lg p-2.5">
                    <MdAccessibility className="w-10 h-10" />
                  </Button>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xl font-bold text-t1">Beginner friendly</p>
                    <p className="text-lg text-t2">Gasless posting and smart wallets make mintboards the perfect place for newcomers to get started.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-t2 auto-rows-fr ">

            <div className="grid grid-cols-[10%_90%] gap-4 border border-border bg-base-100 rounded-lg p-4 shadow-base shadow-lg">
              <div className="w-8 h-8 relative">
                <UplinkImage
                  src="https://uplink.mypinata.cloud/ipfs/QmdGYCdb3kkYXkq9vyhy9GecqycU5FVJmbUvbUxmAv15dh"
                  alt="avatar"
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col justify-between gap-2 pr-2">
                <p className="text-sm">{`Smooth as butter, wow. I've minted on mint.fun, Source, Zora & OpenSea - this was the best experience yet.`}</p>
                <WarpcastUserLink href="https://warpcast.com/greyseymour">Grey Seymour</WarpcastUserLink>
              </div>
            </div>

            <div className="grid grid-cols-[10%_90%] gap-4 border border-border bg-base-100 rounded-lg p-4 shadow-base shadow-lg">
              <div className="w-8 h-8 relative">
                <UplinkImage
                  src="https://uplink.mypinata.cloud/ipfs/QmarNQN7VJCJjf92TMboiZc7PoNAfPiXd9C9XrDyo2NvjZ"
                  alt="avatar"
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col justify-between gap-2 pr-2">
                <p className="text-sm">{`if you're a new base meme project, I recommend you mint all your memes/pics/vids on uplink. It empowers your community to create and mint while earning from their creativity. do it`}</p>
                <WarpcastUserLink href="https://warpcast.com/jessepollak">Jesse Pollak</WarpcastUserLink>
              </div>
            </div>
            <div className="grid grid-cols-[10%_90%] gap-4 border border-border bg-base-100 rounded-lg p-4 shadow-base shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#deebee]" />
              <div className="flex flex-col justify-between gap-2 pr-2">
                <p className="text-sm">Congrats on easiest minting experience on the planet. So minty.</p>
                <WarpcastUserLink href="https://warpcast.com/deebee">dee bee</WarpcastUserLink>
              </div>
            </div>
            <div className="grid grid-cols-[10%_90%] gap-4 border border-border bg-base-100 rounded-lg p-4 shadow-base shadow-lg">
              <div className="w-8 h-8 relative">
                <UplinkImage
                  src="https://uplink.mypinata.cloud/ipfs/QmNg9H3quJXkJREVgnfUgLgdc767cCiwsb34uoP9XHGngE"
                  alt="avatar"
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col justify-between gap-2 pr-2">
                <p className="text-sm">cool new experiment in collective creation, curation, and ownership</p>
                <WarpcastUserLink href="https://warpcast.com/literature">nis.eth</WarpcastUserLink>
              </div>
            </div>
          </div>
        </div>

        {/*contest section*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="flex flex-col gap-4 m-auto w-full">
            <h1 className="text-3xl font-bold text-t2 ">
              <span className="text-t1">Contests</span> to crowdsource anything.
            </h1>
            <div className="flex gap-4 items-center">
              <Button variant="secondary" className="w-12 h-12 rounded-lg p-2.5">
                <FaPalette className="w-10 h-10" />
              </Button>
              <div className="flex flex-col gap-0.5">
                <p className="text-xl font-bold text-t1">Ultimate flexibility</p>
                <p className="text-lg text-t2">for bounties, grants, hackathons, art contests and more.</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Button variant="secondary" className="w-12 h-12 rounded-lg p-2.5">
                <MdDashboardCustomize className="w-10 h-10" />
              </Button>
              <div className="flex flex-col gap-0.5">
                <p className="text-xl font-bold text-t1">Customize participation</p>
                <p className="text-lg text-t2">Keep it exclusive or open to all - set entry and voting criteria via tokens or other onchain datasources.</p>
              </div>
            </div>
            <div className="flex gap-2">

            </div>
          </div>
          <ContestSubCardA />
        </div>

        {/*protocol section*/}

        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-3xl text-t2 font-bold text-center">Powered by the <span className="text-t1">transmissions protocol.</span></h1>
          <p className="text-xl text-t2 text-center">
            Abstractions on the ERC-1155 standard to enable new forms of onchain collaboration and creativity.
          </p>
          <Link href="https://docs.transmissions.wtf" target="_blank" passHref>
            <Button variant="secondary">Learn More</Button>
          </Link>
          <div className="flex items-center gap-2">

          </div>
        </div>

        {/* <AutoplayCarousel>
          <CarouselContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(el => {
              return (
                <>
                  <CarouselItem className="basis-1/4">
                    <div className="flex flex-col gap-2 bg-base-100 rounded-lg p-2">
                      <UplinkImage
                        src={`https://uplink.mypinata.cloud/ipfs/QmQFD6r2VzjAcYTJPsCJVRomhg1g8YQoL9P1DE99mwoZNB`}
                        alt="spc"
                        width={400}
                        height={400}
                        sizes="30vw"
                        className="rounded-lg"
                        blur={false}
                      />
                      <p className="text-t2 text-sm">shark pickle cone t-shirt design - <a className="underline font-bold" href="https://warpcast.com/pip" target="_blank">pipe</a></p>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="basis-1/4">
                    <div className="flex flex-col gap-2 bg-base-100 rounded-lg p-2">
                      <UplinkImage
                        src={`https://uplink.mypinata.cloud/ipfs/QmSApHjPGCS14BPBATjEK8PYu3tQApvesFg9WH2e4cadES`}
                        alt="spc"
                        width={400}
                        height={400}
                        sizes="30vw"
                        className="rounded-lg"
                        blur={false}
                      />
                      <p className="text-t2 text-sm">Artist program round 5 - <a className="underline font-bold" href="https://warpcast.com/pip" target="_blank">Görkem Emir</a></p>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="basis-1/4">
                    <div className="flex flex-col gap-2 bg-base-100 rounded-lg p-2">
                      <UplinkImage
                        src={ArtistSubmission}
                        alt="spc"
                        width={400}
                        height={400}
                        sizes="30vw"
                        className="rounded-lg"
                        blur={false}
                      />
                      <p className="text-t2 text-sm">Vinnie Hager noggles - <a className="underline font-bold" href="https://twitter.com/pumey_arts" target="_blank">Pumey</a></p>
                    </div>
                  </CarouselItem>
                </>
              )
            })}
          </CarouselContent>
        </AutoplayCarousel> */}
        {/* <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-t2 text-center">
            <span className="text-t1">Contests</span> to reward contributors, onboard new creatives, and unlock superusers.
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
          <ContestSubCardA />

          <div className="w-full h-full min-h-[450px] flex flex-col gap-4 p-4 bg-base-100">
            <Carousel>
              <CarouselContent>
                <CarouselItem className="basis-1/3">
                  <div className="flex flex-col gap-2 bg-base-200 rounded-lg p-2">
                    <UplinkImage
                      src={`https://uplink.mypinata.cloud/ipfs/QmQFD6r2VzjAcYTJPsCJVRomhg1g8YQoL9P1DE99mwoZNB`}
                      alt="spc"
                      width={400}
                      height={400}
                      sizes="30vw"
                      className="rounded-lg"
                      blur={false}
                    />
                    <p className="text-t2 text-sm">shark pickle cone t-shirt design by <a className="underline font-bold" href="https://warpcast.com/pip" target="_blank">pipe</a></p>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/3">...</CarouselItem>
                <CarouselItem className="basis-1/3">...</CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div> */}
      </div>
      {/*
        <ContestFeatureCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContestSubCardA />
          <ContestSubCardB >
            <div className="absolute -top-10 right-0 left-0 sm:-top-16 sm:left-auto sm:-right-12 md:-top-10 md:-right-24  m-auto w-full max-w-[275px] md:max-w-[360px] animate-springUp z-10">
              <div className="mockup-window bg-base-100 border border-border">
                <div className="grid grid-cols-[32px_auto] md:grid-cols-[40px_auto] bg-base-200 p-4">
                  <UplinkImage
                    src={ArtistPfp}
                    alt="artist pfp"
                    width={50}
                    height={50}
                    sizes="5vw"
                    className="rounded-full"
                    blur={false}
                  />
                  <div className="flex-grow flex flex-col gap-2 ml-4">
                    <p className="text-t1">
                      <span className="text-primary">@vinniehager</span> noggles!
                    </p>
                    <div className="flex-grow flex flex-col items-center">
                      <div className="relative w-full">
                        <UplinkImage
                          src={ArtistSubmission}
                          alt="twitter submission"
                          className="rounded-lg object-contain"
                          width={600}
                          priority
                          blur={false}
                        />
                      </div>
                      <div className="text-sm text-t2 italic font-[500] self-start text-left">
                        <Link
                          href="https://twitter.com/pumey_arts"
                          target="_blank"
                          className="hover:underline"
                          prefetch={false}
                          draggable={false}
                        >
                          @pumey_arts -
                        </Link>{" "}
                        Vinnie Hager x Nouns contest
                      </div>
                    </div>
                    <div className="w-full h-0.5 bg-border"></div>
                    <div className="flex items-center justify-start w-full">
                      <HiPhoto className="w-5 h-5 opacity-50" />
                      <BiPlusCircle className="w-5 h-5 opacity-50 ml-auto mr-2" />
                      <button
                        className="btn btn-xs btn-primary normal-case"
                        disabled
                      >
                        Submitting
                        <div
                          className="text-xs ml-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ContestSubCardB>
        </div>
        <MintboardCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MintboardSubCardA />
          <MintboardSubCardB />
        </div>
      </div> */}
    </div >
  );
}


const TransmissionsLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="152" height="27" viewBox="0 0 152 27" fill="none">
      <path d="M0.360897 11.8757C0.885527 11.4833 1.78489 11.5082 2.22625 11.9567C3.34213 13.0905 4 14.4859 4 15.9996C4 17.5134 3.34213 18.9087 2.22625 20.0425C1.78489 20.491 0.893855 20.5159 0.360897 20.1235C-0.0887861 19.7933 -0.113768 19.2701 0.260968 18.8901C1.07014 18.048 1.50427 17.0367 1.50176 15.9996C1.50176 14.9219 1.04375 13.9252 0.260968 13.1092C-0.105441 12.7292 -0.0804586 12.2059 0.360897 11.8757Z" fill="#5699D6" />
      <path d="M4.43386 8.87733C5.06341 8.19946 6.14265 8.2425 6.67228 9.01721C8.01134 10.9755 8.80078 13.3857 8.80078 16.0004C8.80078 18.615 8.01134 21.0253 6.67228 22.9836C6.14265 23.7583 5.07341 23.8013 4.43386 23.1235C3.89424 22.5532 3.86426 21.6493 4.31394 20.993C5.28495 19.5385 5.80591 17.7917 5.80289 16.0004C5.80289 14.1389 5.25328 12.4173 4.31394 11.0078C3.87425 10.3514 3.90423 9.44761 4.43386 8.87733Z" fill="#8756D6" />
      <path d="M9.23269 6.62755C9.86224 5.73561 10.9415 5.79224 11.4711 6.8116C12.8102 9.38832 13.5996 12.5597 13.5996 16C13.5996 19.4403 12.8102 22.6117 11.4711 25.1884C10.9415 26.2078 9.87224 26.2644 9.23269 25.3724C8.69307 24.6221 8.66309 23.4328 9.11277 22.5692C10.0838 20.6554 10.6047 18.357 10.6017 16C10.6017 13.5507 10.0521 11.2855 9.11277 9.43079C8.67308 8.56717 8.70306 7.37792 9.23269 6.62755Z" fill="#5856D6" />
      <path d="M35.82 9.4C36.2333 9.48 36.54 9.62 36.74 9.82C36.9533 10.02 37.06 10.2533 37.06 10.52C37.06 10.96 36.9333 11.28 36.68 11.48C36.44 11.68 36.0533 11.76 35.52 11.72C34.32 11.6267 33.38 11.5667 32.7 11.54C32.0333 11.5 31.1533 11.4733 30.06 11.46C29.5667 13.9133 29.1133 16.38 28.7 18.86C28.5533 19.7667 28.4 20.82 28.24 22.02C28.08 23.2067 27.9733 24.1667 27.92 24.9C27.8933 25.2867 27.7333 25.5867 27.44 25.8C27.1467 26 26.7933 26.1 26.38 26.1C25.94 26.1 25.6 25.9933 25.36 25.78C25.12 25.5667 25 25.2867 25 24.94C25 24.62 25.0467 24.0933 25.14 23.36C25.2467 22.6133 25.3667 21.8333 25.5 21.02C25.6467 20.2067 25.76 19.5 25.84 18.9C25.9867 17.8867 26.1533 16.88 26.34 15.88C26.5267 14.88 26.7133 13.9333 26.9 13.04C26.94 12.84 26.9867 12.6133 27.04 12.36C27.0933 12.0933 27.1533 11.8 27.22 11.48C25.9133 11.52 24.8867 11.6267 24.14 11.8C23.3933 11.9733 22.86 12.22 22.54 12.54C22.2333 12.8467 22.08 13.2467 22.08 13.74C22.08 14.1933 22.2133 14.6267 22.48 15.04C22.5333 15.1333 22.56 15.2333 22.56 15.34C22.56 15.5933 22.4067 15.8333 22.1 16.06C21.8067 16.2733 21.5 16.38 21.18 16.38C20.9533 16.38 20.7667 16.3133 20.62 16.18C20.3533 15.9533 20.1333 15.6333 19.96 15.22C19.7867 14.7933 19.7 14.3133 19.7 13.78C19.7 12.6467 20.0667 11.74 20.8 11.06C21.5467 10.3667 22.6733 9.86 24.18 9.54C25.7 9.22 27.6467 9.06 30.02 9.06C31.4867 9.06 32.6533 9.08667 33.52 9.14C34.4 9.19333 35.1667 9.28 35.82 9.4ZM34.7198 26.1C34.2132 26.1 33.8532 25.8333 33.6398 25.3C33.4398 24.7667 33.3398 23.9133 33.3398 22.74C33.3398 21.0067 33.5865 19.36 34.0798 17.8C34.1998 17.4133 34.3932 17.1333 34.6598 16.96C34.9398 16.7733 35.3265 16.68 35.8198 16.68C36.0865 16.68 36.2732 16.7133 36.3798 16.78C36.4865 16.8467 36.5398 16.9733 36.5398 17.16C36.5398 17.3733 36.4398 17.8533 36.2398 18.6C36.1065 19.1333 35.9998 19.6 35.9198 20C35.8398 20.4 35.7732 20.8933 35.7198 21.48C36.1598 20.3333 36.6532 19.4 37.1998 18.68C37.7465 17.96 38.2798 17.4467 38.7998 17.14C39.3332 16.8333 39.8198 16.68 40.2598 16.68C41.1265 16.68 41.5598 17.1133 41.5598 17.98C41.5598 18.1533 41.4998 18.5733 41.3798 19.24C41.2732 19.7733 41.2198 20.1067 41.2198 20.24C41.2198 20.7067 41.3865 20.94 41.7198 20.94C42.0932 20.94 42.5732 20.6467 43.1598 20.06C43.3332 19.8867 43.5132 19.8 43.6998 19.8C43.8732 19.8 44.0065 19.88 44.0998 20.04C44.2065 20.1867 44.2598 20.3867 44.2598 20.64C44.2598 21.1333 44.1265 21.52 43.8598 21.8C43.4865 22.1867 43.0465 22.52 42.5398 22.8C42.0465 23.0667 41.5198 23.2 40.9598 23.2C40.2532 23.2 39.7132 23.02 39.3398 22.66C38.9798 22.3 38.7998 21.8133 38.7998 21.2C38.7998 21 38.8198 20.8 38.8598 20.6C38.8865 20.3333 38.8998 20.1533 38.8998 20.06C38.8998 19.8467 38.8265 19.74 38.6798 19.74C38.4798 19.74 38.2132 19.9667 37.8798 20.42C37.5598 20.86 37.2398 21.4467 36.9198 22.18C36.5998 22.9133 36.3398 23.6867 36.1398 24.5C35.9932 25.1267 35.8198 25.5533 35.6198 25.78C35.4332 25.9933 35.1332 26.1 34.7198 26.1ZM44.8614 26.1C44.0347 26.1 43.3747 25.8 42.8814 25.2C42.3881 24.6 42.1414 23.8133 42.1414 22.84C42.1414 21.7733 42.3881 20.7667 42.8814 19.82C43.3747 18.86 44.0281 18.0933 44.8414 17.52C45.6681 16.9333 46.5414 16.64 47.4614 16.64C47.7547 16.64 47.9481 16.7 48.0414 16.82C48.1481 16.9267 48.2347 17.1267 48.3014 17.42C48.5814 17.3667 48.8747 17.34 49.1814 17.34C49.8347 17.34 50.1614 17.5733 50.1614 18.04C50.1614 18.32 50.0614 18.9867 49.8614 20.04C49.5547 21.5733 49.4014 22.64 49.4014 23.24C49.4014 23.44 49.4481 23.6 49.5414 23.72C49.6481 23.84 49.7814 23.9 49.9414 23.9C50.1947 23.9 50.5014 23.74 50.8614 23.42C51.2214 23.0867 51.7081 22.5533 52.3214 21.82C52.4814 21.6333 52.6614 21.54 52.8614 21.54C53.0347 21.54 53.1681 21.62 53.2614 21.78C53.3681 21.94 53.4214 22.16 53.4214 22.44C53.4214 22.9733 53.2947 23.3867 53.0414 23.68C52.4947 24.36 51.9147 24.9333 51.3014 25.4C50.6881 25.8667 50.0947 26.1 49.5214 26.1C49.0814 26.1 48.6747 25.9533 48.3014 25.66C47.9414 25.3533 47.6681 24.94 47.4814 24.42C46.7881 25.54 45.9147 26.1 44.8614 26.1ZM45.5814 24.08C45.8747 24.08 46.1547 23.9067 46.4214 23.56C46.6881 23.2133 46.8814 22.7533 47.0014 22.18L47.7414 18.5C47.1814 18.5133 46.6614 18.7267 46.1814 19.14C45.7147 19.54 45.3414 20.0733 45.0614 20.74C44.7814 21.4067 44.6414 22.1133 44.6414 22.86C44.6414 23.2733 44.7214 23.58 44.8814 23.78C45.0547 23.98 45.2881 24.08 45.5814 24.08ZM53.2159 26.1C52.7093 26.1 52.3493 25.8333 52.1359 25.3C51.9359 24.7667 51.8359 23.9133 51.8359 22.74C51.8359 21.0067 52.0826 19.36 52.5759 17.8C52.6959 17.4133 52.8893 17.1333 53.1559 16.96C53.4359 16.7733 53.8226 16.68 54.3159 16.68C54.5826 16.68 54.7693 16.7133 54.8759 16.78C54.9826 16.8467 55.0359 16.9733 55.0359 17.16C55.0359 17.3733 54.9359 17.8533 54.7359 18.6C54.6026 19.1333 54.4959 19.6 54.4159 20C54.3359 20.4 54.2693 20.8933 54.2159 21.48C54.6559 20.3333 55.1493 19.4 55.6959 18.68C56.2426 17.96 56.7759 17.4467 57.2959 17.14C57.8293 16.8333 58.3159 16.68 58.7559 16.68C59.6226 16.68 60.0559 17.1133 60.0559 17.98C60.0559 18.5 59.9093 19.44 59.6159 20.8C59.3626 21.96 59.2359 22.7267 59.2359 23.1C59.2359 23.6333 59.4293 23.9 59.8159 23.9C60.0826 23.9 60.3959 23.74 60.7559 23.42C61.1293 23.0867 61.6226 22.5533 62.2359 21.82C62.3959 21.6333 62.5759 21.54 62.7759 21.54C62.9493 21.54 63.0826 21.62 63.1759 21.78C63.2826 21.94 63.3359 22.16 63.3359 22.44C63.3359 22.9733 63.2093 23.3867 62.9559 23.68C62.3826 24.3867 61.7626 24.9667 61.0959 25.42C60.4426 25.8733 59.6959 26.1 58.8559 26.1C58.1759 26.1 57.6626 25.9067 57.3159 25.52C56.9693 25.12 56.7959 24.5467 56.7959 23.8C56.7959 23.4267 56.8893 22.76 57.0759 21.8C57.2493 20.96 57.3359 20.38 57.3359 20.06C57.3359 19.8467 57.2626 19.74 57.1159 19.74C56.9426 19.74 56.6959 19.9667 56.3759 20.42C56.0693 20.86 55.7493 21.4467 55.4159 22.18C55.0959 22.9133 54.8359 23.6867 54.6359 24.5C54.4893 25.1267 54.3159 25.5533 54.1159 25.78C53.9293 25.9933 53.6293 26.1 53.2159 26.1ZM65.4378 26.54C64.7445 26.54 64.2111 26.38 63.8378 26.06C63.4778 25.74 63.2978 25.38 63.2978 24.98C63.2978 24.6333 63.4245 24.3333 63.6778 24.08C63.9311 23.8267 64.3045 23.7 64.7978 23.7C64.9711 23.7 65.1711 23.72 65.3978 23.76C65.6378 23.7867 65.8178 23.8067 65.9378 23.82C65.9245 23.4733 65.8445 23.1467 65.6978 22.84C65.5645 22.5333 65.3911 22.24 65.1778 21.96C64.9645 21.6667 64.7645 21.4133 64.5778 21.2C64.1645 21.9867 63.7511 22.64 63.3378 23.16C62.9378 23.68 62.4978 24.1733 62.0178 24.64C61.7778 24.88 61.5245 25 61.2578 25C61.0445 25 60.8711 24.9267 60.7378 24.78C60.6045 24.62 60.5378 24.4267 60.5378 24.2C60.5378 23.9333 60.6311 23.6867 60.8178 23.46L61.0778 23.14C61.8111 22.2333 62.3645 21.4867 62.7378 20.9C62.9645 20.5133 63.2311 20 63.5378 19.36C63.8445 18.7067 64.1445 18.0333 64.4378 17.34C64.6911 16.7533 65.2178 16.46 66.0178 16.46C66.3911 16.46 66.6511 16.4933 66.7978 16.56C66.9445 16.6267 67.0178 16.7333 67.0178 16.88C67.0178 16.96 66.9911 17.0867 66.9378 17.26C66.8845 17.4333 66.8111 17.6067 66.7178 17.78C66.4778 18.26 66.3578 18.6667 66.3578 19C66.3578 19.2 66.4245 19.42 66.5578 19.66C66.7045 19.9 66.9245 20.2 67.2178 20.56C67.6445 21.12 67.9645 21.6 68.1778 22C68.4045 22.3867 68.5178 22.8133 68.5178 23.28C68.5178 23.4133 68.5045 23.6 68.4778 23.84C69.1311 23.5867 69.8978 22.9133 70.7778 21.82C70.9378 21.6333 71.1178 21.54 71.3178 21.54C71.4911 21.54 71.6245 21.62 71.7178 21.78C71.8245 21.94 71.8778 22.16 71.8778 22.44C71.8778 22.9467 71.7511 23.36 71.4978 23.68C70.8311 24.5067 70.1911 25.0733 69.5778 25.38C68.9778 25.6733 68.2311 25.8333 67.3378 25.86C66.8045 26.3133 66.1711 26.54 65.4378 26.54ZM71.673 26.1C71.1663 26.1 70.8063 25.8333 70.593 25.3C70.393 24.7667 70.293 23.9133 70.293 22.74C70.293 21.0067 70.5396 19.36 71.033 17.8C71.153 17.4133 71.3463 17.1333 71.613 16.96C71.893 16.7733 72.2796 16.68 72.773 16.68C73.0396 16.68 73.2263 16.7133 73.333 16.78C73.4396 16.8467 73.493 16.9733 73.493 17.16C73.493 17.3733 73.393 17.8533 73.193 18.6C73.0596 19.1333 72.953 19.6 72.873 20C72.793 20.3867 72.7263 20.8733 72.673 21.46C73.033 20.42 73.4596 19.54 73.953 18.82C74.4596 18.1 74.973 17.5667 75.493 17.22C76.0263 16.86 76.5263 16.68 76.993 16.68C77.4596 16.68 77.7863 16.7867 77.973 17C78.173 17.2133 78.273 17.54 78.273 17.98C78.273 18.4067 78.1463 19.18 77.893 20.3C77.7863 20.78 77.713 21.14 77.673 21.38C78.3396 19.74 79.0796 18.5467 79.893 17.8C80.7063 17.0533 81.4663 16.68 82.173 16.68C83.0396 16.68 83.473 17.1133 83.473 17.98C83.473 18.5 83.3263 19.44 83.033 20.8C82.7796 21.96 82.653 22.7267 82.653 23.1C82.653 23.6333 82.8463 23.9 83.233 23.9C83.4996 23.9 83.813 23.74 84.173 23.42C84.5463 23.0867 85.0396 22.5533 85.653 21.82C85.813 21.6333 85.993 21.54 86.193 21.54C86.3663 21.54 86.4996 21.62 86.593 21.78C86.6996 21.94 86.753 22.16 86.753 22.44C86.753 22.9733 86.6263 23.3867 86.373 23.68C85.7996 24.3867 85.1796 24.9667 84.513 25.42C83.8596 25.8733 83.113 26.1 82.273 26.1C81.593 26.1 81.0796 25.9067 80.733 25.52C80.3863 25.12 80.213 24.5467 80.213 23.8C80.213 23.4267 80.3063 22.76 80.493 21.8C80.6663 20.96 80.753 20.38 80.753 20.06C80.753 19.8467 80.6796 19.74 80.533 19.74C80.3596 19.74 80.113 19.9667 79.793 20.42C79.473 20.86 79.153 21.4467 78.833 22.18C78.513 22.9133 78.253 23.6867 78.053 24.5C77.9063 25.14 77.733 25.5667 77.533 25.78C77.3463 25.9933 77.0396 26.1 76.613 26.1C76.173 26.1 75.8396 25.8933 75.613 25.48C75.3996 25.0533 75.293 24.54 75.293 23.94C75.293 23.4333 75.3596 22.7 75.493 21.74C75.5996 20.8867 75.653 20.3267 75.653 20.06C75.653 19.8467 75.5796 19.74 75.433 19.74C75.233 19.74 74.9796 19.98 74.673 20.46C74.3663 20.94 74.0663 21.5533 73.773 22.3C73.493 23.0467 73.2663 23.78 73.093 24.5C72.9463 25.1267 72.773 25.5533 72.573 25.78C72.3863 25.9933 72.0863 26.1 71.673 26.1ZM87.7558 15.36C87.1958 15.36 86.7758 15.2333 86.4958 14.98C86.2158 14.7133 86.0758 14.3467 86.0758 13.88C86.0758 13.4133 86.2558 13.0267 86.6158 12.72C86.9891 12.4 87.4491 12.24 87.9958 12.24C88.4891 12.24 88.8891 12.36 89.1958 12.6C89.5024 12.84 89.6558 13.18 89.6558 13.62C89.6558 14.1533 89.4824 14.58 89.1358 14.9C88.7891 15.2067 88.3291 15.36 87.7558 15.36ZM87.5958 26.1C86.7291 26.1 86.0958 25.7933 85.6958 25.18C85.3091 24.5667 85.1158 23.7533 85.1158 22.74C85.1158 22.14 85.1891 21.3733 85.3358 20.44C85.4958 19.4933 85.6958 18.6133 85.9358 17.8C86.0558 17.3733 86.2158 17.08 86.4158 16.92C86.6158 16.76 86.9358 16.68 87.3758 16.68C88.0558 16.68 88.3958 16.9067 88.3958 17.36C88.3958 17.6933 88.2691 18.4667 88.0158 19.68C87.6958 21.1467 87.5358 22.14 87.5358 22.66C87.5358 23.06 87.5891 23.3667 87.6958 23.58C87.8024 23.7933 87.9824 23.9 88.2358 23.9C88.4758 23.9 88.7758 23.7333 89.1358 23.4C89.4958 23.0667 89.9758 22.54 90.5758 21.82C90.7358 21.6333 90.9158 21.54 91.1158 21.54C91.2891 21.54 91.4224 21.62 91.5158 21.78C91.6224 21.94 91.6758 22.16 91.6758 22.44C91.6758 22.9733 91.5491 23.3867 91.2958 23.68C89.9758 25.2933 88.7424 26.1 87.5958 26.1ZM93.7777 26.54C93.0843 26.54 92.551 26.38 92.1777 26.06C91.8177 25.74 91.6377 25.38 91.6377 24.98C91.6377 24.6333 91.7643 24.3333 92.0177 24.08C92.271 23.8267 92.6443 23.7 93.1377 23.7C93.311 23.7 93.511 23.72 93.7377 23.76C93.9777 23.7867 94.1577 23.8067 94.2777 23.82C94.2643 23.4733 94.1843 23.1467 94.0377 22.84C93.9043 22.5333 93.731 22.24 93.5177 21.96C93.3043 21.6667 93.1043 21.4133 92.9177 21.2C92.5043 21.9867 92.091 22.64 91.6777 23.16C91.2777 23.68 90.8377 24.1733 90.3577 24.64C90.1177 24.88 89.8643 25 89.5977 25C89.3843 25 89.211 24.9267 89.0777 24.78C88.9443 24.62 88.8777 24.4267 88.8777 24.2C88.8777 23.9333 88.971 23.6867 89.1577 23.46L89.4177 23.14C90.151 22.2333 90.7043 21.4867 91.0777 20.9C91.3043 20.5133 91.571 20 91.8777 19.36C92.1843 18.7067 92.4843 18.0333 92.7777 17.34C93.031 16.7533 93.5577 16.46 94.3577 16.46C94.731 16.46 94.991 16.4933 95.1377 16.56C95.2843 16.6267 95.3577 16.7333 95.3577 16.88C95.3577 16.96 95.331 17.0867 95.2777 17.26C95.2243 17.4333 95.151 17.6067 95.0577 17.78C94.8177 18.26 94.6977 18.6667 94.6977 19C94.6977 19.2 94.7643 19.42 94.8977 19.66C95.0443 19.9 95.2643 20.2 95.5577 20.56C95.9843 21.12 96.3043 21.6 96.5177 22C96.7443 22.3867 96.8577 22.8133 96.8577 23.28C96.8577 23.4133 96.8443 23.6 96.8177 23.84C97.471 23.5867 98.2377 22.9133 99.1177 21.82C99.2777 21.6333 99.4577 21.54 99.6577 21.54C99.831 21.54 99.9643 21.62 100.058 21.78C100.164 21.94 100.218 22.16 100.218 22.44C100.218 22.9467 100.091 23.36 99.8377 23.68C99.171 24.5067 98.531 25.0733 97.9177 25.38C97.3177 25.6733 96.571 25.8333 95.6777 25.86C95.1443 26.3133 94.511 26.54 93.7777 26.54ZM102.313 26.54C101.619 26.54 101.086 26.38 100.713 26.06C100.353 25.74 100.173 25.38 100.173 24.98C100.173 24.6333 100.299 24.3333 100.553 24.08C100.806 23.8267 101.179 23.7 101.673 23.7C101.846 23.7 102.046 23.72 102.273 23.76C102.513 23.7867 102.693 23.8067 102.813 23.82C102.799 23.4733 102.719 23.1467 102.573 22.84C102.439 22.5333 102.266 22.24 102.053 21.96C101.839 21.6667 101.639 21.4133 101.453 21.2C101.039 21.9867 100.626 22.64 100.213 23.16C99.8128 23.68 99.3728 24.1733 98.8928 24.64C98.6528 24.88 98.3995 25 98.1328 25C97.9195 25 97.7461 24.9267 97.6128 24.78C97.4795 24.62 97.4128 24.4267 97.4128 24.2C97.4128 23.9333 97.5061 23.6867 97.6928 23.46L97.9528 23.14C98.6861 22.2333 99.2395 21.4867 99.6128 20.9C99.8395 20.5133 100.106 20 100.413 19.36C100.719 18.7067 101.019 18.0333 101.313 17.34C101.566 16.7533 102.093 16.46 102.893 16.46C103.266 16.46 103.526 16.4933 103.673 16.56C103.819 16.6267 103.893 16.7333 103.893 16.88C103.893 16.96 103.866 17.0867 103.813 17.26C103.759 17.4333 103.686 17.6067 103.593 17.78C103.353 18.26 103.233 18.6667 103.233 19C103.233 19.2 103.299 19.42 103.433 19.66C103.579 19.9 103.799 20.2 104.093 20.56C104.519 21.12 104.839 21.6 105.053 22C105.279 22.3867 105.393 22.8133 105.393 23.28C105.393 23.4133 105.379 23.6 105.353 23.84C106.006 23.5867 106.773 22.9133 107.653 21.82C107.813 21.6333 107.993 21.54 108.193 21.54C108.366 21.54 108.499 21.62 108.593 21.78C108.699 21.94 108.753 22.16 108.753 22.44C108.753 22.9467 108.626 23.36 108.373 23.68C107.706 24.5067 107.066 25.0733 106.453 25.38C105.853 25.6733 105.106 25.8333 104.213 25.86C103.679 26.3133 103.046 26.54 102.313 26.54ZM109.748 15.36C109.188 15.36 108.768 15.2333 108.488 14.98C108.208 14.7133 108.068 14.3467 108.068 13.88C108.068 13.4133 108.248 13.0267 108.608 12.72C108.981 12.4 109.441 12.24 109.988 12.24C110.481 12.24 110.881 12.36 111.188 12.6C111.495 12.84 111.648 13.18 111.648 13.62C111.648 14.1533 111.475 14.58 111.128 14.9C110.781 15.2067 110.321 15.36 109.748 15.36ZM109.588 26.1C108.721 26.1 108.088 25.7933 107.688 25.18C107.301 24.5667 107.108 23.7533 107.108 22.74C107.108 22.14 107.181 21.3733 107.328 20.44C107.488 19.4933 107.688 18.6133 107.928 17.8C108.048 17.3733 108.208 17.08 108.408 16.92C108.608 16.76 108.928 16.68 109.368 16.68C110.048 16.68 110.388 16.9067 110.388 17.36C110.388 17.6933 110.261 18.4667 110.008 19.68C109.688 21.1467 109.528 22.14 109.528 22.66C109.528 23.06 109.581 23.3667 109.688 23.58C109.795 23.7933 109.975 23.9 110.228 23.9C110.468 23.9 110.768 23.7333 111.128 23.4C111.488 23.0667 111.968 22.54 112.568 21.82C112.728 21.6333 112.908 21.54 113.108 21.54C113.281 21.54 113.415 21.62 113.508 21.78C113.615 21.94 113.668 22.16 113.668 22.44C113.668 22.9733 113.541 23.3867 113.288 23.68C111.968 25.2933 110.735 26.1 109.588 26.1ZM122.25 19.86C122.423 19.86 122.557 19.9467 122.65 20.12C122.743 20.2933 122.79 20.5133 122.79 20.78C122.79 21.42 122.597 21.8 122.21 21.92C121.41 22.2 120.53 22.36 119.57 22.4C119.317 23.52 118.817 24.42 118.07 25.1C117.323 25.7667 116.477 26.1 115.53 26.1C114.73 26.1 114.043 25.9067 113.47 25.52C112.91 25.1333 112.483 24.62 112.19 23.98C111.897 23.34 111.75 22.6467 111.75 21.9C111.75 20.8867 111.943 19.9867 112.33 19.2C112.717 18.4 113.25 17.78 113.93 17.34C114.61 16.8867 115.363 16.66 116.19 16.66C117.203 16.66 118.017 17.0133 118.63 17.72C119.257 18.4133 119.623 19.2733 119.73 20.3C120.357 20.26 121.103 20.1267 121.97 19.9C122.077 19.8733 122.17 19.86 122.25 19.86ZM115.69 23.98C116.117 23.98 116.483 23.8067 116.79 23.46C117.11 23.1133 117.323 22.6133 117.43 21.96C117.017 21.68 116.697 21.3133 116.47 20.86C116.257 20.4067 116.15 19.9267 116.15 19.42C116.15 19.2067 116.17 18.9933 116.21 18.78H116.11C115.577 18.78 115.13 19.04 114.77 19.56C114.423 20.0667 114.25 20.7867 114.25 21.72C114.25 22.4533 114.39 23.0133 114.67 23.4C114.963 23.7867 115.303 23.98 115.69 23.98ZM122.493 26.1C121.987 26.1 121.627 25.8333 121.413 25.3C121.213 24.7667 121.113 23.9133 121.113 22.74C121.113 21.0067 121.36 19.36 121.853 17.8C121.973 17.4133 122.167 17.1333 122.433 16.96C122.713 16.7733 123.1 16.68 123.593 16.68C123.86 16.68 124.047 16.7133 124.153 16.78C124.26 16.8467 124.313 16.9733 124.313 17.16C124.313 17.3733 124.213 17.8533 124.013 18.6C123.88 19.1333 123.773 19.6 123.693 20C123.613 20.4 123.547 20.8933 123.493 21.48C123.933 20.3333 124.427 19.4 124.973 18.68C125.52 17.96 126.053 17.4467 126.573 17.14C127.107 16.8333 127.593 16.68 128.033 16.68C128.9 16.68 129.333 17.1133 129.333 17.98C129.333 18.5 129.187 19.44 128.893 20.8C128.64 21.96 128.513 22.7267 128.513 23.1C128.513 23.6333 128.707 23.9 129.093 23.9C129.36 23.9 129.673 23.74 130.033 23.42C130.407 23.0867 130.9 22.5533 131.513 21.82C131.673 21.6333 131.853 21.54 132.053 21.54C132.227 21.54 132.36 21.62 132.453 21.78C132.56 21.94 132.613 22.16 132.613 22.44C132.613 22.9733 132.487 23.3867 132.233 23.68C131.66 24.3867 131.04 24.9667 130.373 25.42C129.72 25.8733 128.973 26.1 128.133 26.1C127.453 26.1 126.94 25.9067 126.593 25.52C126.247 25.12 126.073 24.5467 126.073 23.8C126.073 23.4267 126.167 22.76 126.353 21.8C126.527 20.96 126.613 20.38 126.613 20.06C126.613 19.8467 126.54 19.74 126.393 19.74C126.22 19.74 125.973 19.9667 125.653 20.42C125.347 20.86 125.027 21.4467 124.693 22.18C124.373 22.9133 124.113 23.6867 123.913 24.5C123.767 25.1267 123.593 25.5533 123.393 25.78C123.207 25.9933 122.907 26.1 122.493 26.1ZM134.715 26.54C134.022 26.54 133.488 26.38 133.115 26.06C132.755 25.74 132.575 25.38 132.575 24.98C132.575 24.6333 132.702 24.3333 132.955 24.08C133.208 23.8267 133.582 23.7 134.075 23.7C134.248 23.7 134.448 23.72 134.675 23.76C134.915 23.7867 135.095 23.8067 135.215 23.82C135.202 23.4733 135.122 23.1467 134.975 22.84C134.842 22.5333 134.668 22.24 134.455 21.96C134.242 21.6667 134.042 21.4133 133.855 21.2C133.442 21.9867 133.028 22.64 132.615 23.16C132.215 23.68 131.775 24.1733 131.295 24.64C131.055 24.88 130.802 25 130.535 25C130.322 25 130.148 24.9267 130.015 24.78C129.882 24.62 129.815 24.4267 129.815 24.2C129.815 23.9333 129.908 23.6867 130.095 23.46L130.355 23.14C131.088 22.2333 131.642 21.4867 132.015 20.9C132.255 20.5133 132.495 20.0533 132.735 19.52C132.988 18.9867 133.315 18.26 133.715 17.34C133.968 16.7533 134.495 16.46 135.295 16.46C135.668 16.46 135.928 16.4933 136.075 16.56C136.222 16.6267 136.295 16.7333 136.295 16.88C136.295 16.96 136.268 17.0867 136.215 17.26C136.162 17.4333 136.088 17.6067 135.995 17.78C135.755 18.26 135.635 18.6667 135.635 19C135.635 19.2 135.702 19.42 135.835 19.66C135.982 19.9 136.202 20.2 136.495 20.56C136.922 21.12 137.242 21.6 137.455 22C137.682 22.3867 137.795 22.8133 137.795 23.28C137.795 23.84 137.662 24.3733 137.395 24.88C137.142 25.3733 136.782 25.7733 136.315 26.08C135.848 26.3867 135.315 26.54 134.715 26.54Z" fill="white" />
    </svg>
  )
}