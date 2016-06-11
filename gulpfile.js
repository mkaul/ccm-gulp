// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// sudo npm install --global gulp-cli
// npm install --save-dev gulp

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var git = require('gulp-git');
var uglifycss = require('gulp-uglifycss');
var jsonminify = require('gulp-jsonminify');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var jsdoc = require('gulp-jsdoc3');
var gutil = require('gulp-util');
var prompt = require('gulp-prompt');
var runSequence = require('run-sequence');


// we define some constants here so they can be reused
var   USER = 'mkaul';
const REPO =  'ccm-components';
const SRC  = '../' + REPO + '/';
const DEST = '../' + REPO + '-page/resources/';
const SRC2 = 'external_components';
const SERVER_URL = 'http://' + USER + '.github.io/' + REPO + '/resources/';

gulp.task('default', [ 'js', 'css', 'json', 'doc' ]);

gulp.task('doc_blank', function (folder, cb) {
  // http://usejsdoc.org
  folder = 'blank';
  jsdoc3_config.opts.destination = '../'+REPO+'-page/api/' + folder;
  gulp.src( [SRC+'/' + folder + '/*.js'], {read: false} )
    .pipe(jsdoc(jsdoc3_config, cb));
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

/**************************************
*                jsdoc3
* generate extra gulp task per ccm-component
*
*
* ************************************ */

var exclude_folders = {
  '.git': true,
  '.idea': true,
  'api': true,
  'dist': true,
  'fonts': true,
  'images': true,
  'javascripts': true,
  'libs': true,
  'stylesheets': true
};

jsdoc3_config = {
  "tags": {
    "allowUnknownTags": true
  },
  "source": {
    "excludePattern": "(^|\\/|\\\\)_"
  },
  "opts": {
    "destination": "see gulpfile.js"
  },
  "plugins": [
    "plugins/markdown"
  ],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false,
    "default": {
      "outputSourceFiles": true
    },
    "path": "ink-docstrap",
    "theme": "cerulean",
    "navType": "vertical",
    "linenums": true,
    "dateFormat": "MMMM Do YYYY, h:mm:ss a"
  }
};

var folders = getFolders(SRC);
var task_names = [];

// generate extra gulp task per ccm-component
folders.map(function(folder) {
  if ( !folder || folder.length === 0 ) return;
  // console.log('>>> ' + path.join(SRC, folder, '/*.js'));
  var sub_config = JSON.parse(JSON.stringify(jsdoc3_config)); // deep copy
  sub_config.opts.destination = '../'+REPO+'-page/api/' + folder;
  var task_name = 'doc_' + folder;
  task_names.push( task_name );
  return gulp.task( task_name, function (cb) {
    gulp.src([SRC + '/' + folder + '/*.js'], {read: false})
      .on('error', gutil.log)
      .pipe(jsdoc(sub_config, cb));
  });
});

gulp.task('doc', function (cb) {
  runSequence(task_names, cb);
});

function glob_pattern(suffix){
  return [SRC+'/*/*.'+suffix, '!'+SRC+'/*/*.min.'+suffix, SRC2+'/*/*.'+suffix, '!'+SRC2+'/*/*.min.'+suffix, '!params.json', '!'+SRC+'/api', '!'+SRC+'/fonts', '!'+SRC+'/images', '!'+SRC+'/javascripts', '!'+SRC+'/libs', '!'+SRC+'/stylesheets', '!'+SRC+'/.git', '!'+SRC+'/.idea' ];
}

function basename( file_path ){
  return file_path.substring(file_path.lastIndexOf('/') + 1);
}

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return !exclude_folders[file] && fs.statSync(path.join(dir, file)).isDirectory();
    });
}
