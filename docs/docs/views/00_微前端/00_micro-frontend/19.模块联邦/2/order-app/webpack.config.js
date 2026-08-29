const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const { ModuleFederationPlugin } = webpack.container;

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].[contenthash:8].js",
    chunkFilename: "assets/[name].[contenthash:8].js",
    publicPath: "auto",
    uniqueName: "retailOrderApp",
    clean: true,
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }),
    new ModuleFederationPlugin({
      name: "orderApp",
      filename: "remoteEntry.js",
      exposes: {
        "./OrderOverview": "./src/federation/OrderOverview.vue",
      },
      shared: {
        vue: { singleton: true, requiredVersion: false, eager: true },
      },
    }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 5174,
    allowedHosts: "all",
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: true,
  },
};
