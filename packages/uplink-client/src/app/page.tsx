import Image from "next/image";
import weeklySub from "../../public/9999-winner.jpeg";
import TabGroup from "@/ui/TabGroup/TabGroup";
export default async function Page() {
  return (
    <>
      <div className="relative">
        <div className="flex flex-col lg:flex-row justify-center items-center ml-auto mr-auto z-10 top-6 left-0 right-0 gap-20 px-10  w-8/12">
          <div className="w-1/2">
            <h1 className="text-5xl font-bold text-white">Uplink</h1>
            <p className="py-6 text-white">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn">Get Started</button>
          </div>
          <div className="card card-compact w-64 bg-neutral text-white shadow-xl z-10">
            <figure>
              <Image src={weeklySub} alt="Shoes" />
            </figure>
            <div className="card-body grid grid-rows-2 grid-flow-col gap-2 text-white">
              <p>Artist:</p>
              <p>Contest:</p>
              <p className="text-end font-bold">Messhup</p>
              <p className="text-end font-bold">The Noun Square - 9999 PFP</p>
            </div>{" "}
          </div>
        </div>
        <div className="relative z-0 pointer-events-none">
          <svg
            className="w-full h-auto -mt-[34vw]"
            id="visual"
            viewBox="0 0 1920 1080"
            width="1920"
            height="1080"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            <path
              d="M0 733L45.7 733.8C91.3 734.7 182.7 736.3 274.2 739.7C365.7 743 457.3 748 548.8 729.3C640.3 710.7 731.7 668.3 823 645.7C914.3 623 1005.7 620 1097 635.8C1188.3 651.7 1279.7 686.3 1371.2 678.5C1462.7 670.7 1554.3 620.3 1645.8 597C1737.3 573.7 1828.7 577.3 1874.3 579.2L1920 581L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#fa7268"
            ></path>
            <path
              d="M0 737L45.7 731.5C91.3 726 182.7 715 274.2 729.2C365.7 743.3 457.3 782.7 548.8 800.3C640.3 818 731.7 814 823 813.2C914.3 812.3 1005.7 814.7 1097 811C1188.3 807.3 1279.7 797.7 1371.2 776.8C1462.7 756 1554.3 724 1645.8 712.7C1737.3 701.3 1828.7 710.7 1874.3 715.3L1920 720L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#ef5f67"
            ></path>
            <path
              d="M0 734L45.7 752.3C91.3 770.7 182.7 807.3 274.2 819.5C365.7 831.7 457.3 819.3 548.8 809.2C640.3 799 731.7 791 823 796.5C914.3 802 1005.7 821 1097 822.5C1188.3 824 1279.7 808 1371.2 814.8C1462.7 821.7 1554.3 851.3 1645.8 862C1737.3 872.7 1828.7 864.3 1874.3 860.2L1920 856L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#e34c67"
            ></path>
            <path
              d="M0 949L45.7 933.5C91.3 918 182.7 887 274.2 888.3C365.7 889.7 457.3 923.3 548.8 929.8C640.3 936.3 731.7 915.7 823 896.2C914.3 876.7 1005.7 858.3 1097 859.5C1188.3 860.7 1279.7 881.3 1371.2 885.5C1462.7 889.7 1554.3 877.3 1645.8 869.3C1737.3 861.3 1828.7 857.7 1874.3 855.8L1920 854L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#d53867"
            ></path>
            <path
              d="M0 991L45.7 981.2C91.3 971.3 182.7 951.7 274.2 953.8C365.7 956 457.3 980 548.8 992.3C640.3 1004.7 731.7 1005.3 823 1004C914.3 1002.7 1005.7 999.3 1097 999.5C1188.3 999.7 1279.7 1003.3 1371.2 995.3C1462.7 987.3 1554.3 967.7 1645.8 954.5C1737.3 941.3 1828.7 934.7 1874.3 931.3L1920 928L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#c62368"
            ></path>
          </svg>
          {/*<div className="h-16 bg-[#c62368]">test</div>*/}
        </div>
        <div className="relative flex flex-col w-7/12 mr-auto ml-auto -mt-48 backdrop-blur-md bg-white/30 text-white px-2 py-2 rounded-md">
          <div className="pb-10">
            <h1 className="text-2xl font-bold">Active Contests</h1>
          </div>

          <div className="flex flex-col p-4 gap-2">
            <div className="bg-base-100 rounded-md p-4">contest1</div>
            <div className="bg-base-100 rounded-md p-4">contest1</div>
            <div className="bg-base-100 rounded-md p-4">contest1</div>
            <div className="bg-base-100 rounded-md p-4">contest1</div>
            <div className="bg-base-100 rounded-md p-4">contest1</div>
            <div className="bg-base-100 rounded-md p-4">contest1</div>

          </div>
        </div>
      </div>

      {/*}
      <div className="hero top-0 bg-cover bg-blue-300">
        <div className="hero-content flex-col justify-evenly lg:flex-row-reverse ">
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
        <div className="w-full overflow-x-hidden">
          <svg
            className="z-0"
            id="visual"
            viewBox="0 300 1920 1080"
            width="1920"
            height="1080"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            <path
              d="M0 733L45.7 733.8C91.3 734.7 182.7 736.3 274.2 739.7C365.7 743 457.3 748 548.8 729.3C640.3 710.7 731.7 668.3 823 645.7C914.3 623 1005.7 620 1097 635.8C1188.3 651.7 1279.7 686.3 1371.2 678.5C1462.7 670.7 1554.3 620.3 1645.8 597C1737.3 573.7 1828.7 577.3 1874.3 579.2L1920 581L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#fa7268"
            ></path>
            <path
              d="M0 737L45.7 731.5C91.3 726 182.7 715 274.2 729.2C365.7 743.3 457.3 782.7 548.8 800.3C640.3 818 731.7 814 823 813.2C914.3 812.3 1005.7 814.7 1097 811C1188.3 807.3 1279.7 797.7 1371.2 776.8C1462.7 756 1554.3 724 1645.8 712.7C1737.3 701.3 1828.7 710.7 1874.3 715.3L1920 720L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#ef5f67"
            ></path>
            <path
              d="M0 734L45.7 752.3C91.3 770.7 182.7 807.3 274.2 819.5C365.7 831.7 457.3 819.3 548.8 809.2C640.3 799 731.7 791 823 796.5C914.3 802 1005.7 821 1097 822.5C1188.3 824 1279.7 808 1371.2 814.8C1462.7 821.7 1554.3 851.3 1645.8 862C1737.3 872.7 1828.7 864.3 1874.3 860.2L1920 856L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#e34c67"
            ></path>
            <path
              d="M0 949L45.7 933.5C91.3 918 182.7 887 274.2 888.3C365.7 889.7 457.3 923.3 548.8 929.8C640.3 936.3 731.7 915.7 823 896.2C914.3 876.7 1005.7 858.3 1097 859.5C1188.3 860.7 1279.7 881.3 1371.2 885.5C1462.7 889.7 1554.3 877.3 1645.8 869.3C1737.3 861.3 1828.7 857.7 1874.3 855.8L1920 854L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#d53867"
            ></path>
            <path
              d="M0 991L45.7 981.2C91.3 971.3 182.7 951.7 274.2 953.8C365.7 956 457.3 980 548.8 992.3C640.3 1004.7 731.7 1005.3 823 1004C914.3 1002.7 1005.7 999.3 1097 999.5C1188.3 999.7 1279.7 1003.3 1371.2 995.3C1462.7 987.3 1554.3 967.7 1645.8 954.5C1737.3 941.3 1828.7 934.7 1874.3 931.3L1920 928L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z"
              fill="#c62368"
            ></path>
          </svg>
        </div>
      </div>
  */}
      {/*
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
  */}
    </>
  );
}
