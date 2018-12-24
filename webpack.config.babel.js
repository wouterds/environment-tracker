import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env, { mode }) => {
  return {
    context: resolve('./src'),
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },
    entry: './client/app.tsx',
    output: {
      path: resolve('./dist'),
      filename: '[name].[hash:6].js',
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
};
