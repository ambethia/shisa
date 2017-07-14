const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname)
const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')
const PRODUCTION = process.env.npm_lifecycle_event === 'build'

const common = {
  entry: {
    vendor: ['react-dom', 'react'],
    app: SRC_PATH
  },
  output: {
    filename: '[name].[hash].js',
    path: BUILD_PATH
  },

  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_PATH, 'index.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: '[name].[hash].js'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [SRC_PATH],
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [require('autoprefixer')]
              }
            }
          }
        ]
      }
    ]
  }
}

const development = {
  entry: {
    vendor: ['react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080']
  },
  output: {
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8080,
    contentBase: BUILD_PATH,
    publicPath: '/',
    stats: { colors: true, chunks: false }
  },
  devtool: 'eval-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()]
}

const production = {
  plugins: [new webpack.optimize.OccurrenceOrderPlugin()]
}

module.exports = merge.smart(PRODUCTION ? production : development, common)
