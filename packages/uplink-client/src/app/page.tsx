import Image from "next/image";
import weeklySub from "../../public/9999-winner.jpeg";
import TabGroup from "@/ui/TabGroup/TabGroup";
export default async function Page() {
  return (
    <>
      <div className="hero h-3/5 bg-landing bg-cover bg-center">
        <div className="hero-content flex-col justify-evenly lg:flex-row-reverse">
          <div className="card card-compact w-96 align-center rounded-2xl bg-neutral">
            <figure>
              <Image
                className="rounded-t-2xl"
                src={weeklySub}
                alt={"weekly sub"}
              />
            </figure>
            <div className="card-body grid grid-rows-2 grid-flow-col gap-2 text-white">
              <p>Artist:</p>
              <p>Contest:</p>
              <p className="text-end font-bold">Messhup</p>
              <p className="text-end font-bold">The Noun Square - 9999 PFP</p>
            </div>{" "}
          </div>
          <div className="w-1/2">
            <h1 className="text-5xl font-bold text-white">Creator Contests!</h1>
            <p className="py-6 text-white">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full p-6 text-white">
        <div className="flex-1">
          <p className="text-2xl">Active Contests</p>
        </div>
        <TabGroup />
      </div>

      <div className="h-96 w-full p-6 bg-purple-300">
        <div className="flex flex-col h-full w-full bg-pink-400">
          <div tabIndex={0} className="collapse group p-6">
            <div className="collapse-title flex flex-row items-center bg-primary rounded-2xl text-primary-content group-focus:bg-secondary group-focus:text-secondary-content">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <Image
                    src={"/noun-47.png"}
                    alt={"org avatar"}
                    height={500}
                    width={500}
                  />
                </div>
              </div>
              <p>Focus me to see content</p>
            </div>
            <div className="collapse-content bg-primary rounded-b-2xl text-primary-content group-focus:bg-secondary group-focus:text-secondary-content">
              <p>
                tabIndex={0} attribute is necessary to make the div focusable
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
