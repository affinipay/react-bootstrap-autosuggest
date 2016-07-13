import path from 'path'
import { cmdLineOptions, getBaseConfig, jsLoader, sassLoader } from './base.config.babel'

export function withOptions(options = cmdLineOptions) {
  return {
    ...getBaseConfig(options),

    entry: {
      'react-bootstrap-autosuggest': path.resolve('src/Autosuggest.js')
    },

    output: {
      path: path.resolve('dist'),
      filename: options.optimizeMinimize ? '[name].min.js' : '[name].js',
      library: 'ReactBootstrapAutosuggest',
      libraryTarget: 'umd'
    },

    module: {
      loaders: [
        {
          ...jsLoader,
          query: {
            ...jsLoader.query,
            plugins: [
              'dev-expression'
            ]
          }
        },
        sassLoader
      ]
    },

    resolve: {
      root: [
        path.resolve('src')
      ]
    },

    externals: {
      'react': {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      },
      'react-bootstrap': {
        root: 'ReactBootstrap',
        commonjs2: 'react-bootstrap',
        commonjs: 'react-bootstrap',
        amd: 'react-bootstrap'
      }
    }
  }
}

export default {
  ...withOptions(),
  withOptions
}
