import path from 'path'
import { jsLoader, sassLoader } from './base.config.babel'
import testConfig from './test.config.babel'

const paths = {
  SRC: path.resolve('src'),
  TEST: path.resolve('test')
}

export default {
  ...testConfig,

  module: {
    preLoaders: [
      {
        test: /\.js/,
        loader: 'babel-istanbul',
        query: {
          cacheDirectory: true
        },
        include: paths.SRC,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        ...jsLoader,
        include: [paths.TEST]
      },
      sassLoader
    ]
  }
}
