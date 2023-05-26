import type { Preview } from "@storybook/react";
import '../src/styles/globals.css';
const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
      router: {
        basePath: '/'
      }
    },
    backgrounds: {
      default: "light",
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
