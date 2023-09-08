import { ContestCard } from '../../app/(space)/[name]/page';



export default {
    title: "ui/SpaceContestCard",
    component: ContestCard,
  };
  
  const Template = (args: any) => (
    <div className="w-2/3 m-auto bg-pink-800 grid grid-rows-1 lg:grid-cols-2 gap-4">
      <ContestCard {...args} />
    </div>
  );

//  spaceName,
//   contestId,
//   contestTitle,
//   category,
//   contestState,
//   remainingTime,

  export const Default = Template.bind({});
Default.args = {
    spaceName: "Links Dao",
    contestId: "123",
    contestTitle: "Spey Bay Art Contest",
    category: "art",
    contestState: "submitting",
    remainingTime: "1 day",
};


export const LongTitles = Template.bind({});
LongTitles.args = {
    ...Default.args,
    contestTitle: "LinksDao".repeat(15),
    category: "photography",
    contestState: "voting",
    remainingTime: "10 days",
    
};