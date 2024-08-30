
import Image from "next/image";
import Link from "next/link";
import ArtistPfp from "@/../public/pumey_pfp.jpg";
import ArtistSubmission from "@/../public/vinnie_noggles.png";
import landingBg from "@/../public/landing-bg.svg";
import { BiPlusCircle } from "react-icons/bi";
import { HiPhoto } from "react-icons/hi2";
import UplinkImage from "@/lib/UplinkImage";
import { ContestFeatureCard, ContestSubCardA, ContestSubCardB, MintboardCard, MintboardSubCardA, MintboardSubCardB } from "./feature";
import Noggles from "@/ui/Noggles/Noggles";

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const BannerSection = () => {
  return (
    <div className="w-full h-screen min-h-[750px] flex-grow flex flex-col relative">
      <div className="stars">
        <div className="small"></div>
        <div className="medium"></div>
        <div className="big"></div>
      </div>
      <div className="grid place-items-center items-center bg-gradient-to-br">
        <div className="hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-5 lg:gap-10 lg:flex-row xl:gap-20 z-[1] ">
          <div className="lg:pl-10 ">
            <div className="flex flex-col gap-2 py-4 text-center items-center lg:items-start lg:text-left">
              <h1 className="mb-2 text-5xl font-[700] text-t1 w-fit">
                {`Let's Create`}
              </h1>
              <h2 className="text-lg max-w-md text-t2 m-auto lg:m-0">
                Join individuals, brands, and decentralized orgs using Uplink to organize onchain and co-create masterpieces with their most passionate supporters.
              </h2>
              <div className="flex flex-row gap-2 items-center">
                <a
                  className="btn secondary-btn normal-case m-auto lg:ml-0 lg:mr-auto"
                  href={"https://docs.uplink.wtf"}
                  target="_blank"
                  draggable={false}
                >
                  Docs
                </a>
                <Link
                  className="btn primary-btn normal-case m-auto lg:ml-0 lg:mr-auto"
                  href={"/explore"}
                  draggable={false}
                >
                  Explore
                </Link>
              </div>
              <span className="flex items-center gap-1 z-10 mb-10">
                <p className="font-bold text-t2">A public good from</p>
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
          </div>
          <div className="m-auto w-full max-w-[300px] sm:max-w-sm lg:max-w-lg animate-springUp">
            <div className="mockup-window bg-base-100 border border-border">
              <div className="grid grid-cols-[32px_auto] md:grid-cols-[64px_auto] bg-base-200 p-4">
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
        </div>
      </div>
      <Image
        src={landingBg}
        alt=""
        fill
        className="absolute !h-[70%] !-bottom-4 !left-0 !top-auto object-cover"
      />
    </div>
  );
};

export default async function Page() {
  return (
    <div className="flex flex-col w-full mb-16 gap-12">
      <BannerSection />
      <div className="flex flex-col w-11/12 md:w-10/12 xl:w-8/12 m-auto gap-6">
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
        {/* <ActiveContests />
        <PopularSubmissions />
        <div className="w-full px-4 lg:px-12">
          <ContestBanner />
        </div> */}
      </div>
    </div>
  );
}
