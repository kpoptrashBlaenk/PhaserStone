const path = require('path')
require('dotenv').config()

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: process.env.PHASER_PORT || 9000,
    proxy: [
      {
        context: ['/api'],
        target: `${process.env.HOST}` || `http://localhost:${process.env.API_PORT}`,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /Legacy/],
      },
    ],
  },
  plugins: [new Dotenv()],
}
