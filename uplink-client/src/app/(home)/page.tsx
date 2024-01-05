
import Image from "next/image";
import Link from "next/link";
import ArtistPfp from "@/../public/pumey_pfp.jpg";
import ArtistSubmission from "@/../public/vinnie_noggles.png";
import landingBg from "@/../public/landing-bg.svg";
import { BiPlusCircle } from "react-icons/bi";
import { HiPhoto } from "react-icons/hi2";
import UplinkImage from "@/lib/UplinkImage";
import { ContestFeatureCard, ContestSubCardA, ContestSubCardB, MintboardCard, MintboardSubCardA, MintboardSubCardB } from "./feature";

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const BannerSection = () => {
  return (
    <div className="w-full h-screen min-h-[750px] flex-grow flex flex-col bg-base-100 relative">
      <div className="grid place-items-center items-center bg-gradient-to-br">
        <div className="hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-5 lg:gap-10 lg:flex-row xl:gap-20 z-[1]">
          <div className="lg:pl-10 ">
            <div className="flex flex-col gap-2 py-4 text-left ">
              <div className="flex gap-2">
                <h1 className="mb-2 text-5xl font-[700] text-t1 w-fit">
                  Unleash your biggest fans
                </h1>
              </div>
              <h2 className="text-lg max-w-md text-t1">
                Uplink lets individuals, brands, and decentralized orgs create
                rewards systems to amplify their reach and co-create
                masterpieces with their most passionate supporters.
              </h2>
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
      <div className="flex flex-col w-11/12 md:w-8/12 m-auto gap-6">
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
