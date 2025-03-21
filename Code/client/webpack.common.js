const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const outputDir = path.resolve(__dirname, 'build');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: outputDir,
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    // Automatically generate an HTML5 file for you that includes all your webpack bundles
    new HtmlWebpackPlugin({
      title: 'handel:',
      favicon: './src/favicon.ico',
      template: './src/index.html',
    }),
    // Automatically load jQuery instead of having to import or require them everywhere
    // required for including bootstrap javascript
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    extensions: ['.mjs', '.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    // Tell webpack what directories should be searched when resolving modules.
    modules: ['node_modules'],
    mainFields: ['browser', 'module', 'main'],
    alias: {
      d3: path.resolve('./node_modules/d3'),
    },
  },
  module: {
    rules: [
      // load image
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      // load font
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      // load javascript/react components
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
