const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, "src", "index.tsx"),
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader,'css-loader', 'sass-loader']
     }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".scss"],
  },
  output: {
    filename: "background.js",
    path: path.resolve(__dirname, "dist"),
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Данный html будет использован как шаблон
    }),
    new MiniCssExtractPlugin()
  ],
};
