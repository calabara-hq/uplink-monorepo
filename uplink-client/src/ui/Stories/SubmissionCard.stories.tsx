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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 justify-items-evenly gap-8 lg:w-9/12 w-full m-auto">
    <CardSubmission {...args} />
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
          text: "first line",
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
          text: "first line",
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

export const StandardTextMultiBlockUneven = Template.bind({});
StandardTextMultiBlockUneven.args = {
  submission: {
    ...baseSubmission,
    type: "standard",
    data: {
      type: "text",
      title: "test",
      body: {
        blocks: [
          {
            id: "uJfLDubMuX",
            type: "paragraph",
            data: { text: "Using the format create 1 Nounish comic strip." },
          },
          {
            id: "-P09HreMO3",
            type: "paragraph",
            data: { text: "&lt;b&gt;The Format&lt;/b&gt;" },
          },
          {
            id: "Itop2v8C30",
            type: "paragraph",
            data: { text: "All comics should have the following:" },
          },
          {
            id: "0kSvsyiJpC",
            type: "paragraph",
            data: { text: "1. Comic Title" },
          },
          {
            id: "8bod9gbEIP",
            type: "paragraph",
            data: { text: "2. The Creative Team" },
          },
          {
            id: "Iw7EjfwXC7",
            type: "paragraph",
            data: { text: "3. The Date" },
          },
          {
            id: "vqwXg1neB-",
            type: "paragraph",
            data: {
              text: "The Strip format should fit within the following dimensions: &lt;br&gt;3000x850 at 72 dpi (Horizontal Format)",
            },
          },
          {
            id: "QbKiCM_jg1",
            type: "paragraph",
            data: {
              text: "The Strip may have anywhere between 1 or more panels but should fit with the specified dimensions.",
            },
          },
          {
            id: "9xHe1gtHrA",
            type: "paragraph",
            data: {
              text: "&lt;b&gt;The Strip should be submitted on Submission Posts.&lt;/b&gt; &lt;br&gt;&lt;br&gt;1. Quote tweet our announcement tweet (first tweet in thread) with your submission, then come back to Calabara and link your wallet and twitter account.",
            },
          },
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
          {
            id: "3f4JQkc6y9",
            type: "paragraph",
            data: {
              text: "this is a new test prompt",
            },
          },
          {
            id: "3f4JQkc6y9",
            type: "paragraph",
            data: {
              text: "this is a new test prompt",
            },
          },
          {
            id: "3f4JQkc6y9",
            type: "paragraph",
            data: {
              text: "this is a new test prompt",
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
