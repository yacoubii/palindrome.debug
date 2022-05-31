module.exports = {
  "stories": [
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "storybook-addon-turbo-build",
      options: {
        // Please refer below tables for available options
        optimizationLevel: 1,
      },
    },
  ],
  staticDirs:['../assets'],
  features:{
    postcss:false,
  }
}