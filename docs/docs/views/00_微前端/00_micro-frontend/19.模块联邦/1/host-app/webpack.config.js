const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const { ModuleFederationPlugin } = webpack.container;

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "auto",
    uniqueName: "mfMinimalHost",
    clean: true,
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(png|jpe?g|gif|svg|woff2?)$/i, type: "asset/resource" },
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
      name: "hostApp",
      remotes: {
        vueRemote: "vueRemote@http://localhost:5301/remoteEntry.js",
        reactRemote: "reactRemote@http://localhost:5302/remoteEntry.js",
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: "3.5.41",
        },
      },
    }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 5300,
    allowedHosts: "all",
    client: { overlay: false },
  },
};
