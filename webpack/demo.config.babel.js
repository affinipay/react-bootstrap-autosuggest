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
    baseConfig.plugins.push(new webpack.NoErrorsPlugin())
    debugLoaders.push({ test: /\.js/, loader: 'react-hot', exclude: /node_modules/ })
    entryBundle.push(`webpack-dev-server/client?${webpackDevServerAddress}`)
    entryBundle.push('webpack/hot/only-dev-server')
  }
  entryBundle.push(entryFile)

  return {
    ...baseConfig,

    devtool: options.debug ? 'source-map' : null,

    entry: {
      'demo': entryBundle
    },

    output: {
      filename: '[name].js',
      path: path.resolve('site'),
      publicPath: options.debug ? `${webpackDevServerAddress}/` : '/'
    },

    devServer: {
      contentBase: path.resolve('demo')
    },

    module: {
      loaders: [
        ...debugLoaders,
        { ...jsLoader, exclude: /node_modules|examples/ },
        cssLoader,
        sassLoader,
        { test: /\.eot$|\.ttf$|\.svg$|\.woff2?$/, loader: 'file?name=[name].[ext]' }
      ]
    },

    resolve: {
      alias: {
        'react-bootstrap-autosuggest': 'Autosuggest.js'
      },
      root: [
        path.resolve('demo'),
        path.resolve('src')
      ]
    }
  }
}

export default {
  ...withOptions(),
  withOptions
}
