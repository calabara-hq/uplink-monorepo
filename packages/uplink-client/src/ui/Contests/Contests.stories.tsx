;import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
import Contests from "./Contests";

export default {
  title: "ui/Contests",
  component: Contests,
  decorators: [SessionDecorator],
};

const Template = (args: any) => <div className="bg-gradient-vertical"><Contests {...args} />
</div>;

export const ContestDefualt = Template.bind({});
ContestDefualt.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "The Noun Square at Dawn Art Contest",
      body: "Create an illustration or sketch using any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: "2023-04-25T22:15:49Z",
      voteTime: "2023-04-26T22:15:49Z",
      endTime: "2023-04-27T22:15:49Z",
      snapshot: "2023-04-27T22:15:49Z",
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const PromptNoImage = Template.bind({});
PromptNoImage.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Sketch a DAO",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: "2023-04-25T22:15:49Z",
      voteTime: "2023-04-26T22:15:49Z",
      endTime: "2023-04-27T22:15:49Z",
      snapshot: "2023-04-27T22:15:49Z",
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const TitleLong = Template.bind({});
TitleLong.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "This is a long title aye".repeat(50),
      body: "Sketch a DAO",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: "2023-04-25T22:15:49Z",
      voteTime: "2023-04-26T22:15:49Z",
      endTime: "2023-04-27T22:15:49Z",
      snapshot: "2023-04-27T22:15:49Z",
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const PromptLong = Template.bind({});
PromptLong.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Sketch a DAO".repeat(200),
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: "2023-04-25T22:15:49Z",
      voteTime: "2023-04-26T22:15:49Z",
      endTime: "2023-04-27T22:15:49Z",
      snapshot: "2023-04-27T22:15:49Z",
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const ContestPending = Template.bind({});
ContestPending.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() + 0.5 * 864e5).toISOString(),
      voteTime: new Date(Date.now() + 1 * 864e5).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() + 0.5 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const ContestSubmitting = Template.bind({});
ContestSubmitting.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now()).toISOString(),
      voteTime: new Date(Date.now() + 1 * 864e5).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now()).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const ContestVoting = Template.bind({});
ContestVoting.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const SelectedSubs2 = Template.bind({});
SelectedSubs2.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "The Noun Square at Dawn Art Contest",
      body: "Create an illustration or sketch using any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
  selectedSubs: [
    {
      id: "1",
      name: "Sub1",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.",
    },
    {
      id: "2",
      name: "Sub2",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
  ],
};

export const SelectedSubs3 = Template.bind({});
SelectedSubs3.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "The Noun Square at Dawn Art Contest",
      body: "Create an illustration or sketch using any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
  selectedSubs: [
    {
      id: "1",
      name: "Sub1",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.",
    },
    {
      id: "2",
      name: "Sub2",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "3",
      name: "Sub3",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
  ],
};

export const SelectedSubs0 = Template.bind({});
SelectedSubs0.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "The Noun Square at Dawn Art Contest",
      body: "Create an illustration or sketch using any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
  selectedSubs: [

  ],
};

export const SelectedSubs1 = Template.bind({});
SelectedSubs1.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "The Noun Square at Dawn Art Contest",
      body: "Create an illustration or sketch using any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
  selectedSubs: [
    {
      id: "1",
      name: "Sub1",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.",
    },
  ],
};

export const SelectedSubsMulti = Template.bind({});
SelectedSubsMulti.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "The Noun Square at Dawn Art Contest",
      body: "Create an illustration or sketch using any or all the Nouns from 610-615. 🏆 .069 ETH for 5 Winners 🏆 Contest Closes: 2/17 @ 10pm est 🤝 Follow + Tag 🔖 @thenounsquare + some friends",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now()).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
  selectedSubs: [
    {
      id: "1",
      name: "Sub1",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.",
    },
    {
      id: "2",
      name: "Sub2",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "3",
      name: "Sub3",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "4",
      name: "Sub4",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
    {
      id: "5",
      name: "Sub5",
      image:
        "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.",
    },
  ],
};

export const ContestEnd = Template.bind({});
ContestEnd.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
      voteTime: new Date(Date.now() - 0.5 * 864e5).toISOString(),
      endTime: new Date(Date.now()).toISOString(),
      snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const OneSubReward = Template.bind({});
OneSubReward.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now()).toISOString(),
      voteTime: new Date(Date.now() + 1 * 864e5).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now()).toISOString(),
    },
    submitterRewards: [
      {
        rank: "1",
        tokenReward: {
          amount: 1,
          token: {
            type: "ETH",
            address: "0xabcd",
            symbol: "ETH",
            decimals: 18,
          },
        },
      },
    ],
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const TwoSubReward = Template.bind({});
TwoSubReward.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now()).toISOString(),
      voteTime: new Date(Date.now() + 1 * 864e5).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now()).toISOString(),
    },
    submitterRewards: [
      {
        rank: "1",
        tokenReward: {
          amount: 1,
          token: {
            type: "ETH",
            address: "0xabcd",
            symbol: "ETH",
            decimals: 18,
          },
        },
      },
      {
        rank: "1",
        tokenReward: {
          amount: 1,
          token: {
            type: "ERC20",
            address: "0xabcd1234",
            symbol: "SHARK",
            decimals: 18,
          },
        },
      },
    ],
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

export const ThreeSubReward = Template.bind({});
ThreeSubReward.args = {
  contest: {
    id: "1",
    spaceId: "1",
    prompt: {
      title: "Sketch a DAO",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
    metadata: {
      category: "art",
      type: "standard",
    },
    deadlines: {
      startTime: new Date(Date.now()).toISOString(),
      voteTime: new Date(Date.now() + 1 * 864e5).toISOString(),
      endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
      snapshot: new Date(Date.now()).toISOString(),
    },
    submitterRewards: [
      {
        rank: "1",
        tokenReward: {
          amount: 1,
          token: {
            type: "ETH",
            address: "0xabcd",
            symbol: "ETH",
            decimals: 18,
          },
        },
      },
      {
        rank: "1",
        tokenReward: {
          amount: 1,
          token: {
            type: "ERC20",
            address: "0xabcd1234",
            symbol: "SHARK",
            decimals: 18,
          },
        },
      },
      {
        rank: "1",
        tokenReward: {
          tokenId: 2,
          token: {
            type: "ERC721",
            address: "0xabcd1234",
            symbol: "NOUN",
            decimals: 28,
          },
        },
      },
    ],
  },
  space: {
    id: "1",
    displayName: "Shark DAO",
  },
};

