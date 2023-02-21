import Image from "next/image";

export default async function Page() {
  return (
    <>
      <div className="hero bg-landing bg-center bg-scroll">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex flex-col">
            <Image
              src={"/9999-winner.jpeg"}
              alt={"weekly sub"}
              height={500}
              width={500}
            />
            <p>dadddy</p>
          </div>
          <div>
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

      <div className="flex flex-row h-fit w-full p-6 bg-neutral">
        <div className="flex-1">
          <p className="text-2xl">Active Contests</p>
        </div>
        <div tabIndex={0} className="tabs tabs-boxed">
          <a className="tab">Submitting</a>
          <a className="tab tab-active">All Active</a>
          <a className="tab">Voting</a>
        </div>
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
