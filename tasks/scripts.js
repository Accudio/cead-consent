const { src, dest, parallel } = require('gulp')
const gulpEsbuild = require('gulp-esbuild')

const isProd = process.env.NODE_ENV === 'production'

// gulp options
const options = {
  in: 'src/js/',
  out: 'dist/'
}

// browser and es5 version
const browserBuild = () => {
  return src(options.in + 'browser.js')
    .pipe(gulpEsbuild({
      bundle: true,
      minify: isProd,
      sourcemap: !isProd ? 'inline' : false,
      target: [
        'es6',
        'chrome71',
        'firefox78',
        'safari12.1'
      ]
    }))
    .pipe(dest(options.out))
}

// module
const moduleBuild = () => {
  return src(options.in + 'module.js')
    .pipe(gulpEsbuild({
      bundle: false,
      minify: isProd,
      sourcemap: !isProd ? 'inline' : false,
      target: [
        'es6'
      ]
    }))
    .pipe(dest(options.out))
}

module.exports = parallel(browserBuild, moduleBuild)
