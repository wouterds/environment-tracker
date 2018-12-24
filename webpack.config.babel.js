import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default (env, { mode }) => {
  const isProduction = mode === 'production';

  const config = {
    context: resolve('./src'),
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },
    entry: './client/app.tsx',
    output: {
      path: resolve('./dist'),
      filename: '[name].[hash:7].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    devServer: {
      noInfo: true,
      disableHostCheck: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './client/index.html',
      }),
    ],
  };

  // Production specific
  if (isProduction) {
    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: resolve('./dist/report.html'),
      openAnalyzer: false,
    }));
  }

  return config;
};
