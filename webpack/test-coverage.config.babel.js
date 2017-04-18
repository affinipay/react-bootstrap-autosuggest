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
    loaders: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'babel-istanbul-loader',
        options: {
          cacheDirectory: true
        },
        include: paths.SRC,
        exclude: /node_modules/
      },
      {
        ...jsLoader,
        include: [paths.TEST]
      },
      sassLoader
    ]
  }
}
