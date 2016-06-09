// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// sudo npm install --global gulp-cli
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
var jsdoc = require('gulp-jsdoc3');
var gutil = require('gulp-util');

// we define some constants here so they can be reused
const USER = 'akless';
const REPO =  'ccm-developer';
const SRC  = '../' + REPO + '/';
const DEST = '../' + REPO + '-page/resources/';
const SRC2 = 'external_components';
const API  = './docs'; // in jsdoc.config
const SERVER_URL = 'http://' + USER + '.github.io/' + REPO + '/resources/';

gulp.task('default', [ 'js', 'css', 'json', 'doc' ]);

gulp.task('doc', function (cb) {
  // http://usejsdoc.org
  var config = require('./jsdoc.json');
  config.opts.destination = '../'+REPO+'-page/api/';
  var nSrc=0, nDes=0;
  gulp.src( glob_pattern('js'), {read: false} ) // TODO: sub directories...
    .on("data", function() { nSrc+=1;})
    // .pipe(changed(API)) //filter out src files not newer than dest
    .on("data", function() { nDes+=1;})
    .on("finish", function() {
      gutil.log("Results");
      gutil.log("# src files: ", nSrc);
      gutil.log("# dest files:", nDes);
    })
    .pipe(jsdoc(config, cb));
    // .pipe(gulp.dest(API));  // ToDo move API folder to the right place but callback last
});

gulp.task('js', function() {
  gulp.src(glob_pattern('js'))
    // the `changed` task needs to know the destination directory
    // upfront to be able to figure out which files changed
    .pipe(changed(DEST))
    // only files that has changed will pass through here
    .pipe(replace('./', SERVER_URL))
    .pipe(uglify())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

gulp.task('css', function () {
  gulp.src(glob_pattern('css'))
    .pipe(changed(DEST))
    .pipe(replace('./', SERVER_URL))
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
    .pipe(changed(DEST))
    .pipe(replace('./', SERVER_URL))
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
  return [SRC+'/**/*.'+suffix, '!'+SRC+'/**/*.min.'+suffix, SRC2+'/**/*.'+suffix, '!'+SRC2+'/**/*.min.'+suffix, '!params.json'];
}

function basename( file_path ){
  return file_path.substring(file_path.lastIndexOf('/') + 1);
}
