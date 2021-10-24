const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const config = {
  entry: "./src/index.js",
  target: "web",
  devtool: "eval",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    watchFiles: {
      paths: ["./src/**/*"],
    },
    static: {
      directory: path.resolve(__dirname, "dist"),
      watch: true,
    },
    port: 3000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader"],
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [{ from: "src/index.html" }],
    }),
  ],
};

module.exports = config;
