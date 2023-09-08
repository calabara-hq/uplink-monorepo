import { HiCheckBadge, HiPlus } from "react-icons/hi2";
import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
//import { SubmissionCard } from "../../ui/Contests/SubmissionDisplay";
import CardSubmission from "../Submission/CardSubmission";

export default {
  title: "ui/CardSubmission",
  component: CardSubmission,
  decorators: [SessionDecorator],
};

const Template = (args: any) => (
  <div className=" bg-pink-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 justify-items-evenly gap-8 lg:w-full w-full">
    <CardSubmission {...args} footerChildren={<SubmissionFooter />} />
  </div>
);

const AddToCartButton = ({ submission }) => {
  const isSelected = false;

  const setIsSelected = (x) => {};

  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <button className=" btn btn-ghost btn-sm cursor-default no-animation ml-auto">
        <HiCheckBadge className="h-6 w-6 text-black" />
      </button>
    );
  } else
    return (
      <button className=" btn btn-ghost btn-sm ml-auto" onClick={handleSelect}>
        <HiPlus className="h-6 w-6 text-black" />
      </button>
    );
};

const SubmissionFooter = ({ submission }) => {
  return (
    <div className="animate-springUp flex absolute bottom-0 left-0 items-end w-full h-8 rounded-b-lg bg-secondary">
      <AddToCartButton submission={submission} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  submission: {
    id: "25",
    contestId: "57",
    author: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
    created: "2023-08-16T18:19:47.263Z",
    type: "twitter",
    url: "https://uplink.mypinata.cloud/ipfs/QmdA92HiW612rMKTw1QwdhUqgZDHUdjhHqFEDzy4NQv8gQ",
    version: "uplink-v1",
    totalVotes: "3",
    rank: 1,
    data: {
      type: "video",
      title: "X ".repeat(50),
      thread: [
        {
          assetType: "video/mp4",
          assetSize: "5284030",
          videoAsset:
            "https://uplink.mypinata.cloud/ipfs/QmaVTkmaaDkbEBN9o5BoALAqHar9jkk29sLChnxs7nqTPc",
          previewAsset:
            "https://uplink.mypinata.cloud/ipfs/QmbukYsUaF18NipjU1XBqqWdSeNHGobVMTZyVmgjRmc96C",
          text: "This is my awesome new twitter submission, I hope you like it!!!! it's pretty cool how this works, it's based on different things like blah blahblah\n\n",
        },
      ],
    },
  },
  basePath: "",
};

export const Image = Template.bind({});
Image.args = {
  ...Default.args,
  submission: {
    id: "26",
    contestId: "57",
    author: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
    created: "2023-08-16T20:14:45.650Z",
    type: "twitter",
    url: "https://uplink.mypinata.cloud/ipfs/QmeKMS3K452zbZ6fxPWyrPLBJL8gdgwTapXe8qdnNFTRm3",
    version: "uplink-v1",
    totalVotes: "1",
    rank: null,
    data: {
      type: "image",
      title: "X ".repeat(50),
      thread: [
        {
          assetType: "image/jpeg",
          assetSize: "8875",
          previewAsset:
            "https://uplink.mypinata.cloud/ipfs/QmYGhf48svGRiys3uDtr1bD7EDUk74vyzp14RcgTWyu1tR",
          text: "a standard image submission",
        },
      ],
    },
  },
};

export const Text = Template.bind({});
Text.args = {
  ...Default.args,
  submission: {
    id: "28",
    contestId: "57",
    author: "0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1",
    created: "2023-08-17T14:02:07.591Z",
    type: "standard",
    url: "https://uplink.mypinata.cloud/ipfs/QmNVe2QcPiBhQFE9RGoaYE63oh7PUC7bvK1M2Gbqpr5i7w",
    version: "uplink-v1",
    totalVotes: "1",
    rank: null,
    data: {
      type: "text",
      title: "X ".repeat(50),
      body: {
        blocks: [
          {
            id: "3f4JQkc6y9",
            type: "paragraph",
            data: {
              text: "this is a new test prompt".repeat(10),
            },
          },
          {
            id: "2f4JQkc6y9",
            type: "image",
            data: {
              file: {
                url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
              },
              caption: "Roadster // tesla.com",
              withBorder: false,
              withBackground: false,
              stretched: true,
            },
          },
        ],
      },
    },
  },
};
