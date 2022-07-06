require("dotenv").config();
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    open: true,
    contentBase: "./dist",
    historyApiFallback: true,
    port: 3001,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  plugins: [
    // Enables Hot Module Replacement, otherwise known as HMR
    new webpack.HotModuleReplacementPlugin(),

    // define environment variables for production
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.STRIPE_PUB_KEY": JSON.stringify(process.env.STRIPE_PUB_KEY),
      "process.env.API_URL_GCC_ADDRESS": JSON.stringify(process.env.API_URL_GCC_ADDRESS),
    }),
  ],
  optimization: {
    // cause the relative path of the module to be displayed when HMR is enabled
    namedModules: true,
  },
  module: {
    rules: [
      // load css files
      {
        test: /\.css$/,
        exclude: [/\.m\.css$/],
        use: ["style-loader", "css-loader"],
      },
      // load css files with css module enabled
      {
        test: /\.m\.css$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]_[local]_[hash:base64:5]",
            },
          },
        ],
      },
    ],
  },
});
