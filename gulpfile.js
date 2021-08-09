const { parallel, watch } = require('gulp')

// pull in tasks
const sass = require('./tasks/sass.js')
const scripts = require('./tasks/scripts.js')

// watch files and run task when it changes
const watcher = () => {
  watch('src/js/**/*.js', { ignoreInitial: true }, scripts)
  watch('src/sass/**/*.scss', { ignoreInitial: true }, sass)
}

// default - run each task in parallel
exports.default = parallel(sass, scripts)
exports.css = sass
exports.js = scripts

// watch task
exports.watch = watcher
