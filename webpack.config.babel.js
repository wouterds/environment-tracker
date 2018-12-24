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
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: true,
                localIdentName: isProduction ? '[hash:7]' : '[name]-[local]-[hash:7]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('postcss-pseudoelements')(),
                  require('postcss-import')({
                    path: 'src/styles',
                  }),
                  require('postcss-mixins')(),
                  require('postcss-preset-env')({
                    features: {
                      'custom-properties': {
                        preserve: false,
                      },
                    },
                  }),
                  require('postcss-nested')(),
                  require('postcss-hexrgba')(),
                  require('postcss-calc')(),
                  require('postcss-custom-media')(),
                  require('cssnano')(),
                ],
              },
            },
          ],
        },
        {
          test: /\.(gif|jpe?g|png)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
            name: '[hash:7].[ext]',
          },
        },
        {
          test: /\.(ttf|otf|eot|svg|woff(2)?)$/,
          loader: 'file-loader',
          options: {
            name: '[hash:7].[ext]',
          },
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
