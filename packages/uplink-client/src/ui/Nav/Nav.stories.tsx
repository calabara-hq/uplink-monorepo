import { ComponentStory, ComponentMeta } from "@storybook/react";
import Nav, { INav } from "./Nav";

export default {
  title: "ui/Nav",
  component: Nav,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Nav>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Nav> = (args) => {
  return <button className="btn" {...args}>hello!</button>;
};

export const Normal = Template.bind({});
