import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import HtmlwebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin'

const babelSettings = JSON.parse(fs.readFileSync('.babelrc'));


export default {
  context: path.resolve(__dirname, './'),
  entry: {
    'bundle': ['webpack-dev-server/client?http://127.0.0.1:7070/', 'webpack/hot/only-dev-server', 'babel-polyfill', './index.jsx'],
    'vendor': ['react']
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  },
  devServer: {
    port: process.env.PORT || 7070,
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    inline: true,
    proxy: {
      '*': 'http://127.0.0.1:9999'
    },
    host : '127.0.0.1'
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      BUILD_DEV: 'true'
    }),
    new HtmlwebpackPlugin({
      //template: 'index.js',
      template: require('html-webpack-template'),
      title: 'App',
      appMountId: 'app',
      inject: false
    }),
    new WebpackCleanupPlugin({
      exclude: ['package.json', 'main.js', 'index.html', 'bootstrapper.js', 'window.js'],
    })
    //new ExtractTextPlugin('style.css', { allChunks: true })
  ],
  resolve: {
    extensions: [ '*', '.js', '.jsx' ],
    modules: [
      path.resolve(__dirname, 'node_modules')
    ],
    alias: {
      lib: path.resolve(__dirname, './lib'),
      actions: path.resolve(__dirname, './actions'),
      reducers: path.resolve(__dirname, './reducers'),
      containers: path.resolve(__dirname, './containers'),
      components: path.resolve(__dirname, './components'),
      constants: path.resolve(__dirname, './constants')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 30000,
            minetype: 'application/font-woff'
          }
        }]
      },
      {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            'file-loader'
          ]
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 30000,
            name: '[name]-[hash].[ext]'
          }
        }]
      },
      {
        test: /\.(glsl|vert|frag)$/,
        use: [
          'webpack-glsl-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [ 'react-hot-loader', 'babel-loader' ],
      }
    ]
  }
}
