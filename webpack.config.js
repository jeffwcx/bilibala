const webpack = require('webpack')
const path = require('path')
const meta = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const ENV = process.env.NODE_ENV
console.log('Build environment is ' + ENV)
var config = {
  entry: {
    bilibala: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'Bilibala',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ]
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new webpack.BannerPlugin(`${meta.name} v${meta.version}
author ${meta.author}`)
  ]
}

if (ENV === 'min') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: true
  }), new BundleAnalyzerPlugin())
  config.entry = {
    'bilibala.min': './src/index.js'
  }
}

module.exports = config
