require('dotenv').config();
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const S3Plugin = require('webpack-s3-plugin');
const CdnizerWebpackPlugin = require('webpack-cdnizer');
const common = require('./webpack.common.js');

const cdnBaseUrl = process.env.CDN_BASE_URL;

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'scripts.[chunkhash].js',
    publicPath: `${cdnBaseUrl}/`,
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  plugins: [
    // Extract css from the bundle into a separate file.
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'styles.[name].[hash].css',
      chunkFilename: 'styles.[id].[hash].css',
    }),

    // define environment variables for production
    new webpack.DefinePlugin({
      "process.env.SENTRY_DNS": JSON.stringify("https://1f4bf702246d45d28e4f0d24d17832ca@sentry.io/264486"),
      "process.env.STRIPE_PUB_KEY": JSON.stringify(process.env.STRIPE_PUB_KEY),
      "process.env.API_URL_GCC_ADDRESS": JSON.stringify(process.env.API_URL_GCC_ADDRESS),
    }),

    // replace local file references in HTML and other files with CDN locations
    new CdnizerWebpackPlugin({
      defaultCDNBase: cdnBaseUrl,
      files: [
        '/styles.*.css',
        '/scripts.*.js',
        '/favicon.ico',
      ],
    }),

    // upload assets to S3
    new S3Plugin({
      // Exclude uploading of html
      exclude: /.*\.html$/,
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.AWS_BUCKET,
      },
    }),
  ],
  module: {
    rules: [
      // Extract css from the bundle into a separate file
      {
        test: /\.css$/,
        exclude: [
          /\.m\.css/,
        ],
        loader: [
          // extract CSS into separate files
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      // Extract css from the bundle into a separate file (for css module files only)
      {
        test: /\.m\.css$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        loader: [
          // extract CSS into separate files
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },

});
