const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const { ModuleFederationPlugin } = webpack.container;

module.exports = (_env, argv) => {
  const production = argv.mode === "production";
  const orderOrigin = production ? "http://localhost:6174" : "http://localhost:5174";
  const financeOrigin = production ? "http://localhost:6175" : "http://localhost:5175";

  return {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/[name].[contenthash:8].js",
      chunkFilename: "assets/[name].[contenthash:8].js",
      publicPath: "auto",
      uniqueName: "retailMainApp",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".vue"],
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
        name: "mainApp",
        remotes: {
          orderApp: `orderApp@${orderOrigin}/remoteEntry.js`,
          financeApp: `financeApp@${financeOrigin}/remoteEntry.js`,
        },
        shared: {
          vue: { singleton: true, requiredVersion: false },
        },
      }),
      new HtmlWebpackPlugin({ template: "./index.html" }),
    ],
    devServer: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: "all",
      historyApiFallback: true,
      client: { overlay: false },
    },
  };
};
