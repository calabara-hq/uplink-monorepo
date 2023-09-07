import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
import Prompt from "../Contests/ContestHeading";

export default {
  title: "ui/ContestHeading",
  component: Prompt,
  decorators: [SessionDecorator],
};

// space,
//   metadata,
//   deadlines,
//   prompt,
//   tweetId,

const Template = (args: any) => (
  <div className="bg-gray-600 grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full border border-border rounded-lg p-4">
    <Prompt {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  space: {
    space: "links",
    displayName: "links dao",
    logoUrl:
      "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W",
  },

  metadata: { category: "video" },

  deadlines: { startTime: "submitting" },
  prompt: {
    title: "zaddy ".repeat(30),
    coverUrl:
      "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W",

    body: {
      time: 1694047047181,
      blocks: [
        {
          id: "3f4JQkc6y9",
          type: "paragraph",
          data: {
            text: "this is a new test prompt".repeat(5),
          },
        },
        // {
        //   id: "2f4JQkc6y9",
        //   type: "image",
        //   data: {
        //     file: {
        //       url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        //     },
        //     caption: "Roadster // tesla.com",
        //     withBorder: false,
        //     withBackground: false,
        //     stretched: true,

        //   },
        // },
      ],
      version: "2.26.5",
    },
  },
};
