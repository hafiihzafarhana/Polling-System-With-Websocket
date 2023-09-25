import { dirname, join } from "path";
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials")],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },

  viteFinal: async (config, { configType }) => {
    // config is storybook's vite config
    // config type is 'DEVELOPMENT'

    // configure camelCase CSS Modules
    return {
      ...config,
      css: {
        modules: {
          localsConvention: 'camelCaseOnly',
        },
      },
    };
  },

  docs: {
    autodocs: true
  }
};

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
