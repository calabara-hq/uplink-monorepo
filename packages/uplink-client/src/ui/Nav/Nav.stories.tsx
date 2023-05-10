import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
import Nav, { INav } from "./Nav";

export default {
  title: "ui/Nav",
  component: Nav,
  decorators: [SessionDecorator],
};

const Template = (args: any) => <Nav {...args} />;

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  loggedIn: false,
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  loggedIn: true,
};
