const path = require('path');
const withPlugins = require('next-compose-plugins');
const typescript = require('@zeit/next-typescript');
const css = require('@zeit/next-css');
const fonts = require('next-fonts');
const dotenv = require('dotenv-webpack');

const config = {
  distDir: '../dist/app',
};

module.exports = withPlugins([
  [typescript],
  [css],
  [fonts],
], {
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,
      new dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ];

    return config;
  },
  ...config,
});
