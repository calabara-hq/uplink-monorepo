import { HiCheckBadge, HiPlus } from "react-icons/hi2";
import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
//import { SubmissionCard } from "../../ui/Contests/SubmissionDisplay";
import ExpandedSubmission from "../Submission/ExpandedSubmission";

export default {
  title: "ui/ExpandedSubmission",
  component: ExpandedSubmission,
  decorators: [SessionDecorator],
};

const Template = (args: any) => (
  <div className="grid grid-cols-1 w-full gap-2 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full bg-base">
    <ExpandedSubmission {...args} />
  </div>
);

const baseSubmission = {
  id: "25",
  contestId: "57",
  author: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
  created: "2023-08-16T18:19:47.263Z",
  url: "https://uplink.mypinata.cloud/ipfs/QmdA92HiW612rMKTw1QwdhUqgZDHUdjhHqFEDzy4NQv8gQ",
  version: "uplink-v1",
};

export const TwitterText = Template.bind({});
TwitterText.args = {
  submission: {
    ...baseSubmission,
    type: "twitter",
    data: {
      type: "text",
      title: "X ".repeat(50),
      thread: [
        {
          text: "a twitter text submission",
        },
      ],
    },
  },
};

export const TwitterTextThread = Template.bind({});
TwitterTextThread.args = {
  submission: {
    ...baseSubmission,
    type: "twitter",
    data: {
      type: "text",
      title: "X ".repeat(50),
      thread: [
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
      ],
    },
  },
};

export const TwitterTextThreadWithImage = Template.bind({});
TwitterTextThreadWithImage.args = {
  submission: {
    ...baseSubmission,
    type: "twitter",
    data: {
      type: "text",
      title: "X ".repeat(50),
      thread: [
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
          assetType: "image/jpeg",
          assetSize: "8875",
          previewAsset:
            "https://uplink.mypinata.cloud/ipfs/QmYGhf48svGRiys3uDtr1bD7EDUk74vyzp14RcgTWyu1tR",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
        {
          text: "a twitter text submission",
        },
      ],
    },
  },
};

export const TwitterImage = Template.bind({});
TwitterImage.args = {
  submission: {
    ...baseSubmission,
    type: "twitter",
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

export const TwitterVideo = Template.bind({});
TwitterVideo.args = {
  submission: {
    ...baseSubmission,
    type: "twitter",
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
            "https://uplink.mypinata.cloud/ipfs/QmYGhf48svGRiys3uDtr1bD7EDUk74vyzp14RcgTWyu1tR",
          text: "This is my awesome new twitter submission, I hope you like it!!!! it's pretty cool how this works, it's based on different things like blah blahblah\n\n",
        },
      ],
    },
  },
};

export const StandardText = Template.bind({});
StandardText.args = {
  submission: {
    ...baseSubmission,
    type: "standard",
    data: {
      type: "text",
      title: "X ".repeat(50),
      body: {
        blocks: [
          {
            id: "3f4JQkc6y9",
            type: "paragraph",
            data: {
              text: "this is a new test prompt ".repeat(10),
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

const sampleBlock = {
  id: "3f4JQkc6y9",
  type: "paragraph",
  data: {
    text: "this is a new test prompt",
  },
};

export const StandardTextMultiBlock = Template.bind({});
StandardTextMultiBlock.args = {
  submission: {
    ...baseSubmission,
    type: "standard",
    data: {
      type: "text",
      title: "X ".repeat(50),
      body: {
        blocks: [
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
          sampleBlock,
        ],
      },
    },
  },
};

export const StandardTextMultiBlockWithImage = Template.bind({});
StandardTextMultiBlockWithImage.args = {
  submission: {
    ...baseSubmission,
    type: "standard",
    data: {
      type: "text",
      title: "X ".repeat(50),
      body: {
        blocks: [
          {
            id: "3f4JQkc6y9",
            type: "paragraph",
            data: {
              text: "this is a new test prompt",
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

export const StandardImage = Template.bind({});
StandardImage.args = {
  submission: {
    ...baseSubmission,
    type: "standard",
    data: {
      type: "image",
      title: "X ".repeat(50),
      previewAsset:
        "https://uplink.mypinata.cloud/ipfs/QmYGhf48svGRiys3uDtr1bD7EDUk74vyzp14RcgTWyu1tR",
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

export const StandardVideo = Template.bind({});
StandardVideo.args = {
  submission: {
    ...baseSubmission,
    type: "standard",
    data: {
      type: "video",
      title: "X ".repeat(50),
      previewAsset:
        "https://uplink.mypinata.cloud/ipfs/QmYGhf48svGRiys3uDtr1bD7EDUk74vyzp14RcgTWyu1tR",
      videoAsset:
        "https://uplink.mypinata.cloud/ipfs/QmaVTkmaaDkbEBN9o5BoALAqHar9jkk29sLChnxs7nqTPc",
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

// export const Default = Template.bind({});
// Default.args = {
//   submission: {
//     id: "25",
//     contestId: "57",
//     author: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
//     created: "2023-08-16T18:19:47.263Z",
//     type: "twitter",
//     url: "https://uplink.mypinata.cloud/ipfs/QmdA92HiW612rMKTw1QwdhUqgZDHUdjhHqFEDzy4NQv8gQ",
//     version: "uplink-v1",
//     totalVotes: "3",
//     rank: 1,
//     data: {
//       type: "video",
//       title: "X ".repeat(50),
//       thread: [
//         {
//           assetType: "video/mp4",
//           assetSize: "5284030",
//           videoAsset:
//             "https://uplink.mypinata.cloud/ipfs/QmaVTkmaaDkbEBN9o5BoALAqHar9jkk29sLChnxs7nqTPc",
//           previewAsset:
//             "https://uplink.mypinata.cloud/ipfs/QmbukYsUaF18NipjU1XBqqWdSeNHGobVMTZyVmgjRmc96C",
//           text: "This is my awesome new twitter submission, I hope you like it!!!! it's pretty cool how this works, it's based on different things like blah blahblah\n\n",
//         },
//       ],
//     },
//   },
//   basePath: "",
// };

// export const Image = Template.bind({});
// Image.args = {
//   ...Default.args,
//   submission: {
//     id: "26",
//     contestId: "57",
//     author: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
//     created: "2023-08-16T20:14:45.650Z",
//     type: "twitter",
//     url: "https://uplink.mypinata.cloud/ipfs/QmeKMS3K452zbZ6fxPWyrPLBJL8gdgwTapXe8qdnNFTRm3",
//     version: "uplink-v1",
//     totalVotes: "1",
//     rank: null,
//     data: {
//       type: "image",
//       title: "X ".repeat(50),
//       thread: [
//         {
//           assetType: "image/jpeg",
//           assetSize: "8875",
//           previewAsset:
//             "https://uplink.mypinata.cloud/ipfs/QmYGhf48svGRiys3uDtr1bD7EDUk74vyzp14RcgTWyu1tR",
//           text: "a standard image submission",
//         },
//       ],
//     },
//   },
// };

// export const Text = Template.bind({});
// Text.args = {
//   ...Default.args,
//   submission: {
//     id: "28",
//     contestId: "57",
//     author: "0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1",
//     created: "2023-08-17T14:02:07.591Z",
//     type: "standard",
//     url: "https://uplink.mypinata.cloud/ipfs/QmNVe2QcPiBhQFE9RGoaYE63oh7PUC7bvK1M2Gbqpr5i7w",
//     version: "uplink-v1",
//     totalVotes: "1",
//     rank: null,
//     data: {
//       type: "text",
//       title: "X ".repeat(50),
//       body: {
//         blocks: [
//           {
//             id: "3f4JQkc6y9",
//             type: "paragraph",
//             data: {
//               text: "this is a new test prompt".repeat(10),
//             },
//           },
//           {
//             id: "2f4JQkc6y9",
//             type: "image",
//             data: {
//               file: {
//                 url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
//               },
//               caption: "Roadster // tesla.com",
//               withBorder: false,
//               withBackground: false,
//               stretched: true,
//             },
//           },
//         ],
//       },
//     },
//   },
// };
