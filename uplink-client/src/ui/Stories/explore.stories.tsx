import SessionDecorator from "../../../.storybook/decorators/SessionDecorator";
import { AllSpaces } from "../../app/explore/page";

export default {
  title: "ui/explore",
  component: AllSpaces,
  decorators: [SessionDecorator],
};

const Template = (args: any) => (
  <div className="w-full bg-pink-800">
    <AllSpaces {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  spaces: [{ name: "Links Dao", logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W" }],
};

export const LongTitles = Template.bind({});
LongTitles.args = {
  spaces: [
    { name: "Society of Nounish Cartoonists", logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},
    { name: "nounsnounsnounsnounsnouns", logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},
    { name: "sharksharksharksharksharksharksharksharksharksharksharkshark", logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},
    { name: "linkslinkslinkslinkslinkslinkslinkslinkslinkslinkslinkslinkslinkslinkslinks", logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},
    { name: "a".repeat(20), logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},
    { name: "b".repeat(25), logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},
    { name: "x".repeat(300), logoUrl: "https://uplink.mypinata.cloud/ipfs/Qmf69UYsYRWGMV3jQe9YjhvzR2xeh8h3xPKhWnVVG2Z61W"},

  ],
};

