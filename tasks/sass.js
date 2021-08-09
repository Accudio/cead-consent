const { dest, src } = require('gulp')

const sassProcessor = require('gulp-sass')(require('sass'))

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')

const csso = require('gulp-csso')

const sourcemaps = require('gulp-sourcemaps')

const isProd = process.env.NODE_ENV === 'production'

const options = {
  in: 'src/sass/*.scss',
  out: 'dist/'
}

// grab all root scss files, processes, sends them to output calculator
const sass = () => {
  let stream = src(options.in)

  // initialise sourcemaps
  if (!isProd) {
    stream = stream
      .pipe(sourcemaps.init())
  }

  // sass
  stream = stream
    .pipe(sassProcessor({
      includePaths: ['node_modules']
    }).on('error', sassProcessor.logError))

  // postcss
  stream = stream
    .pipe(postcss([
      autoprefixer()
    ]))

  // csso
  if (isProd) {
    stream = stream
      .pipe(csso())
  }

  // write sourcemaps
  if (!isProd) {
    stream = stream
      .pipe(sourcemaps.write())
  }

  return stream.pipe(dest(options.out))
}

module.exports = sass
