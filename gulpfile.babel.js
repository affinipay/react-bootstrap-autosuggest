import child_process from 'child_process'
import del from 'del'
import flow from 'flow-bin'
import gulp from 'gulp'
import babel from 'gulp-babel'
import eslint from 'gulp-eslint'
import gulpReactDocs from 'gulp-react-docs'
import gulpReplace from 'gulp-replace'
import { Server as KarmaServer } from 'karma'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'

import demoConfig from './webpack/demo.config.babel'
import webpackConfig from './webpack/webpack.config.babel'

const apidocs = './site/apidocs'
const demo = './demo'
const dist = './dist'
const lib = './lib'
const site = './site'
const src = './src'
const test = './test'

if (!Object.values) {
  Object.values = obj => Object.keys(obj).map(key => obj[key])
}

function getWebpackEntries(config) {
  const { entry } = config
  return (Array.isArray(entry) || typeof entry !== 'object') ? entry : Object.values(entry)
}

function execute(command, args, options, callback) {
  const child = child_process.spawn(command, args, options)
  child.stdout.on('data', data => process.stdout.write(data.toString()))
  child.stderr.on('data', data => process.stderr.write(data.toString()))
  child.on('close', code => {
    callback(code != 0 ? new Error(`${command} exited with code ${code}`) : null)
  })
}

gulp.task('clean', function() {
  return del([dist, lib, site])
})

gulp.task('clean-dist', function() {
  return del([dist])
})

gulp.task('clean-lib', function() {
  return del([lib])
})

gulp.task('clean-site', function() {
  return del([site])
})

gulp.task('clean-apidocs', function() {
  return del([apidocs])
})

gulp.task('clean-demo', function() {
  return del([site, '!' + apidocs])
})

gulp.task('babel', ['clean-lib'], function() {
  return gulp.src(src + '/*.js')
    .pipe(babel())
    .pipe(gulp.dest(lib))
})

gulp.task('webpack', ['clean-dist'], function() {
  return gulp.src(getWebpackEntries(webpackConfig))
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(dist))
})

gulp.task('webpack-min', ['clean-dist'], function() {
  const baseConfig = webpackConfig.withOptions({
    optimizeMinimize: true
  })
  const config = {
    ...baseConfig,
    bail: true,
    plugins: [
      ...baseConfig.plugins,
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
  return gulp.src(getWebpackEntries(webpackConfig))
    .pipe(webpackStream(config))
    .pipe(gulp.dest(dist))
})

gulp.task('default', ['babel', 'webpack', 'webpack-min'])

gulp.task('apidocs', ['clean-apidocs'], function() {
  return gulp.src('./src/Autosuggest.js')
    // react-docgen uses an old version of babylon
    // that doesn't support inferred type parameter syntax
    .pipe(gulpReplace(/<\*[^>]*>/g, ''))
    .pipe(gulpReactDocs({
      path: apidocs
    }))
    .pipe(gulpReplace('&#x27;', '\''))
    .pipe(gulpReplace(
      'From [`../../src/Autosuggest.js`](../../src/Autosuggest.js)',
      'From [`src/Autosuggest.js`](../../master/src/Autosuggest.js)'))
    .pipe(gulp.dest(apidocs))
})

gulp.task('demo-copy', ['clean-demo'], function() {
  return gulp.src([
      demo + '/*.ico',
      demo + '/*.json',
      demo + '/*.png',
      demo + '/*.svg',
      demo + '/*.xml',
      demo + '/images/*',
      demo + '/index.html'
    ], { base: demo })
    .pipe(gulp.dest(site))
})

gulp.task('demo-webpack', ['clean-demo'], function() {
  const baseConfig = demoConfig.withOptions({
    optimizeMinimize: true
  })
  const config = {
    ...baseConfig,
    bail: true,
    plugins: [
      ...baseConfig.plugins,
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
  const entries = getWebpackEntries(demoConfig)
  return gulp.src(entries[entries.length - 1])
    .pipe(webpackStream(config))
    .pipe(gulp.dest(site))
})

gulp.task('site', ['apidocs', 'demo-copy', 'demo-webpack'])

gulp.task('lint', function() {
  return gulp.src([src, test, demo].map(s => s + '/**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('flow', function(callback) {
  execute(flow, ['--color', 'always'], undefined, callback)
})

gulp.task('karma', function (callback) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, callback).start()
})

gulp.task('test', ['lint', 'flow', 'karma'])

gulp.task('all', ['default', 'site', 'test'])
