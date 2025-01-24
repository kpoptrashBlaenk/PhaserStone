const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
require('dotenv').config()

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new Dotenv(),
  ],
}
