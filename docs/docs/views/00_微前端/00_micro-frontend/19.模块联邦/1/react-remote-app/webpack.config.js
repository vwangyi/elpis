const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { ModuleFederationPlugin } = webpack.container;

module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "auto",
    uniqueName: "mfReactRemote",
    clean: true,
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
      { test: /\.(png|jpe?g|gif|svg|woff2?)$/i, type: "asset/resource" },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "reactRemote",
      filename: "remoteEntry.js",
      exposes: {
        "./HelloCard": "./src/mountHelloCard.jsx",
      },
    }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 5302,
    allowedHosts: "all",
    headers: { "Access-Control-Allow-Origin": "*" },
    client: { overlay: false },
  },
};
