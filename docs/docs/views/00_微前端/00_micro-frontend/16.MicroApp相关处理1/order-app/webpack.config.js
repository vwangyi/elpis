const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/app.[contenthash:8].js",
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
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new CopyWebpackPlugin({ patterns: [{ from: "public", to: "." }] }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 5174,
    allowedHosts: "all",
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: true,
  },
};
