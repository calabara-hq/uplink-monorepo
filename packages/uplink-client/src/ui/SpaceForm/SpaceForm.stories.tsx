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

export const CreateSpaceLoggedOut = Template.bind({});
CreateSpaceLoggedOut.args = {
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

export const CreateSpaceError = Template.bind({});
CreateSpaceError.args = {
  loggedIn: false,
  isNewSpace: true,
  initialState: {
    name: "",
    logoBlob: "",
    logoUrl: "",
    website: "",
    twitter: "",
    admins: ["you", "xyz1234567890", "abc1234567890", "0x02d1b331C8Ab3dDdC27Ef4EE891F264e5e3a4435", "ndodson.eth"],
    errors: {
      name: "Name is required",
      logoUrl: "Logo is required",
      website: "Website is required",
      twitter: "Twitter is required",
      admins: [null, "Invalid address", "Invalid address", null, null],
    },
  },
};
