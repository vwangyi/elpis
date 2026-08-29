const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const packageName = require("./package.json").name;
const port = 5174;

module.exports = (_, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: path.resolve(__dirname, "src/main.js"),
    output: {
      clean: true,
      filename: "js/[name].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: isProduction ? "/" : `//localhost:${port}/`, // 编译时固定
      globalObject: "window",
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
      library: {
        name: `${packageName}-[name]`,
        type: "umd",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        vue$: "vue/dist/vue.esm-bundler.js",
      },
      extensions: [".js", ".json", ".vue"],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
      }),
    ],
    devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      allowedHosts: "all",
      historyApiFallback: true,
      hot: false,
      liveReload: true,
      port,
      client: {
        overlay: false,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
};
