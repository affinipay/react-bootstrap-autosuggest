// Karma configuration
require('babel-register')

var webpackConfig = require('./webpack/test.config.babel').default

var isCI = process.env.CONTINUOUS_INTEGRATION === 'true'
var runCoverage = process.env.COVERAGE === 'true' || isCI
var devBrowser = process.env.PHANTOM ? 'PhantomJS' : 'Chrome'
var browsers = [ isCI ? 'PhantomJS' : devBrowser ]

var reporters = ['mocha']
if (runCoverage) {
  webpackConfig = require('./webpack/test-coverage.config.babel').default
  reporters.push('coverage')
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    // list of files / patterns to load in the browser
    files: [
      'test/**/*-test.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*-test.js': ['webpack', 'sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters,

    coverageReporter: {
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100
        }
      },
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'html',
          dir: 'coverage'
        }
      ]
    },

    plugins: [
      'karma-*'
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: isCI,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: Object.assign({}, webpackConfig, {
      devtool: 'inline-source-map',
      externals: {
        // https://github.com/airbnb/enzyme/issues/302
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      // cheerio requires json-loader
      module: Object.assign({}, webpackConfig.module, {
        loaders: webpackConfig.module.loaders.concat(
          {
            test: /\.json$/,
            loader: 'json'
          }
        )
      })
    }),

    webpackServer: {
      noInfo: true
    }
  })
}
