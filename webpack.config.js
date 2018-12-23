let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  entry: './client/app.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
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
      template: 'client/index.html',
    }),
  ],
};
