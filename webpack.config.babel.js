import path from 'path';
import { LoaderOptionsPlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FlowBabelWebpackPlugin from 'flow-babel-webpack-plugin';

const production = process.env.NODE_ENV === 'production';

let config =  {
  entry: {
    'app': [
      'babel-polyfill',
      'react-hot-loader/patch',
      path.join(__dirname, './src/index.js'),
    ]
  },
  output: {
    path: path.join(__dirname, './public'),
    filename: production ? 'app.[hash:8].js' : 'app.js',
    sourceMapFilename: 'app.js.map',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('./src'),
      path.resolve('./resources'),
      path.resolve('./node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /src\/server/,
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: production ? '[hash:8]' : '[name]-[local]-[hash:8]',
              sourceMap: !production,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
        options: {
          publicPath: '/',
          name: 'fonts/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new FlowBabelWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: path.join(__dirname, './public/index.html'),
    }),
    new LoaderOptionsPlugin({
      minimize: production,
      sourceMap: !production,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, './public'),
    port: 8080,
  },
};

// Unwanted production plugins (flow doesn't work on arm)
if (production) {
  config.plugins = config.plugins.filter((plugin) => {
    return !(
      plugin instanceof FlowBabelWebpackPlugin
    );
  });
}

module.exports = config;
