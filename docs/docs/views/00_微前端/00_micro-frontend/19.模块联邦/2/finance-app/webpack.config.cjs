const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { ModuleFederationPlugin } = webpack.container;

module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].[contenthash:8].js",
    chunkFilename: "assets/[name].[contenthash:8].js",
    publicPath: "auto",
    uniqueName: "retailFinanceApp",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-react", { runtime: "automatic", development: false }],
            ],
          },
        },
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "financeApp",
      filename: "remoteEntry.js",
      exposes: {
        "./mountSettlementOverview": "./src/federation/mountSettlementOverview.jsx",
      },
    }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 5175,
    allowedHosts: "all",
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: true,
    client: { overlay: false },
  },
};
