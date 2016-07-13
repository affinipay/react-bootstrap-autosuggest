import path from 'path'
import { getBaseConfig, jsLoader, sassLoader } from './base.config.babel'

export default {
  ...getBaseConfig(),

  // entry points and output configured by karma-webpack

  module: {
    loaders: [
      jsLoader,
      sassLoader
    ]
  },

  resolve: {
    alias: {
      'react-bootstrap-autosuggest': '../src/Autosuggest.js'
    },
    root: [
      path.resolve('src')
    ]
  }
}
