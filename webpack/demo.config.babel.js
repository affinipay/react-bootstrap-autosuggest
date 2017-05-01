import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import { cmdLineOptions, getBaseConfig, jsLoader, cssLoader, sassLoader } from './base.config.babel'

export function withOptions(options = cmdLineOptions) {
  const webpackDevServerAddress = `http://${options.host}:${options.port}`
  const entryFile = path.resolve('demo/demo.js')

  const baseConfig = getBaseConfig(options)
  const debugLoaders = []
  const entryBundle = []
  if (options.debug) {
    baseConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    baseConfig.plugins.push(new webpack.NamedModulesPlugin())
    baseConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    entryBundle.push('react-hot-loader/patch'),
    entryBundle.push(`webpack-dev-server/client?${webpackDevServerAddress}`)
    entryBundle.push('webpack/hot/only-dev-server')
  }
  entryBundle.push(entryFile)

  return {
    ...baseConfig,

    devtool: options.debug ? 'source-map' : false,

    entry: {
      'demo': entryBundle
    },

    output: {
      filename: '[name].js',
      path: path.resolve('site'),
      publicPath: options.debug ? `${webpackDevServerAddress}/` : '/react-bootstrap-autosuggest/'
    },

    devServer: {
      contentBase: path.resolve('demo'),
      host: options.host,
      port: options.port
    },

    module: {
      loaders: [
        ...debugLoaders,
        { ...jsLoader, exclude: /node_modules|examples/ },
        cssLoader,
        sassLoader,
        { test: /\.eot$|\.ttf$|\.svg$|\.woff2?$/, loader: 'file-loader?name=[name].[ext]' }
      ]
    },

    plugins: [
      ...baseConfig.plugins,
      new HtmlWebpackPlugin({
        title: 'react-bootstrap-autosuggest',
        template: 'demo/index.ejs'
      })
    ],

    resolve: {
      alias: {
        'react-bootstrap-autosuggest': 'Autosuggest.js'
      },
      modules: [
        path.resolve('demo'),
        path.resolve('src'),
        'node_modules'
      ]
    }
  }
}

export default withOptions()
