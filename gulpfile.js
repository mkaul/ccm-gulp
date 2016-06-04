// npm install --save-dev gulp

var gulp = require('gulp');
var changed = require('gulp-changed');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var git = require('gulp-git');
var uglifycss = require('gulp-uglifycss');
var jsonminify = require('gulp-jsonminify');
var replace = require('gulp-replace');
var insert = require('gulp-insert');

// we define some constants here so they can be reused
const SRC  = '../ccm-components';
const DEST = '../ccm-components/dist';
const SERVER_URL = 'http://mkaul.github.io/ccm-components/dist/';

gulp.task('default', ['js', 'css', 'json']);

gulp.task('js', function() {
  gulp.src(glob_pattern('js'))
    .pipe(replace('../', SERVER_URL))
    .pipe(uglify())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

gulp.task('css', function () {
  gulp.src(glob_pattern('css'))
    .pipe(replace('../', SERVER_URL))
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

gulp.task('json', function () {
  return gulp.src(glob_pattern('json'))
    .pipe(replace('../', SERVER_URL))
    .pipe(insert.transform(function( contents, file ) {
      return 'ccm.callback[ "' + basename(file.path) + '" ](' + contents + ');';
    }))
    .pipe(jsonminify())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

function glob_pattern(suffix){
  return [SRC+'/**/*.'+suffix, '!'+SRC+'/**/*.min.'+suffix, '!params.json'];
}

function basename( file_path ){
  return file_path.substring(file_path.lastIndexOf('/') + 1);
}
