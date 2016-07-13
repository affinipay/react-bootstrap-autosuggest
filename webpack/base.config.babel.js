import webpack from 'webpack'
import yargs from 'yargs'

export const cmdLineOptions = yargs
  .alias('p', 'optimize-minimize')
  .alias('d', 'debug')
  .option('host', {
    default: 'localhost',
    type: 'string'
  })
  .option('port', {
    default: '8080',
    type: 'string'
  })
  .argv

export const jsLoaderName = 'babel'
export const jsLoader = {
  test: /\.js/,
  loader: jsLoaderName,
  query: {
    cacheDirectory: true
  },
  exclude: /node_modules/
}

export const cssLoader = {
  test: /\.css$/,
  loaders: [
    'style-loader',
    'css-loader'
  ]
}

export const sassLoader = {
  test: /\.scss$/,
  loaders: [
    'style-loader',
    'css-loader',
    'sass-loader?includePaths[]=./node_modules/bootstrap-sass/assets/stylesheets'
  ]
}

export function getBaseConfig(options = cmdLineOptions) {
  return {
    entry: undefined,

    output: undefined,

    externals: undefined,

    devtool: 'source-map',

    module: {
      preLoaders: [
        { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(options.optimizeMinimize ? 'production' : 'development')
        }
      })
    ]
  }
}
