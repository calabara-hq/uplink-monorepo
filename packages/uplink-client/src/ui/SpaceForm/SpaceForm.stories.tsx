import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
import SpaceForm from "./SpaceForm";
export default {
  title: "ui/SpaceForm",
  component: SpaceForm,
  decorators: [SessionDecorator],
};

const Template = (args: any) => <SpaceForm {...args} />;

export const CreateSpaceLoggedIn = Template.bind({});
CreateSpaceLoggedIn.args = {
  loggedIn: false,
  isNewSpace: true,
  initialState: {
    name: "",
    logoBlob: "",
    logoUrl: "",
    website: "",
    twitter: "",
    admins: ["you", ""],
    errors: {
      admins: [],
    },
  },
};

export const CreateSpaceLoggedOut = Template.bind({});
CreateSpaceLoggedOut.args = {
  loggedIn: true,
  isNewSpace: true,
  initialState: {
    name: "",
    logoBlob: "",
    logoUrl: "",
    website: "",
    twitter: "",
    admins: ["you", ""],
    errors: {
      admins: [],
    },
  },
};
