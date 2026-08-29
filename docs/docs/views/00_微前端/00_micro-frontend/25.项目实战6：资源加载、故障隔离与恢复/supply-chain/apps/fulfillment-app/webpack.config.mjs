import path from 'node:path'
import { fileURLToPath } from 'node:url'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'

const appDirectory = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('webpack').Configuration} */
const config = {
  entry: path.resolve(appDirectory, 'src/main.ts'),
  output: {
    path: path.resolve(appDirectory, 'dist'),
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[contenthash:8].js',
    publicPath: '/',
    clean: true,
    library: 'fulfillmentApp',
    libraryTarget: 'umd',
    chunkLoadingGlobal: 'webpackJsonp_fulfillmentApp',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(appDirectory, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|webp|gif|woff2?)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/media/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'index.html'),
    }),
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 5174,
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
      },
    ],
  },
}

export default config
