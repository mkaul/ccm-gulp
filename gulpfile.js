// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// sudo npm install --global gulp-cli
// npm install --save-dev gulp

// Please edit config.json before starting
const config = require('./config.json');

// load npm modules and gulp plugins
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var git = require('gulp-git');
var uglifycss = require('gulp-uglifycss');
var jsonminify = require('gulp-jsonminify');
// var replace = require('gulp-replace');
var replace = require('gulp-replace-task');
var insert = require('gulp-insert');
var jsdoc = require('gulp-jsdoc3');
var gutil = require('gulp-util');
var prompt = require('gulp-prompt');
var runSequence = require('run-sequence');

// define constants for global use
const USER = config.gulp.user;
const REPO = config.gulp.repo;
const SRC  = path.join( '..', REPO );
const DEST = path.join( '..', REPO + config.gulp.repo_suffix, config.gulp.destination );
const SRC2 = config.gulp.external_components;
const SERVER_URL = param_replace( config.gulp.server_url, {'user': USER, 'repo': REPO } );

gulp.task('default', [ 'js', 'css', 'json', 'doc', 'api' ]);

// remotify JavaScript files by replacing local paths by remote paths
// minify JavaScript files after remotifying
gulp.task('js', function() {
  return gulp.src(glob_pattern('js'))
    // the `changed` task needs to know the destination directory
    // upfront to be able to figure out which files changed
    // .pipe(changed(DEST))
    // only files that has changed will pass through here
    // replace local paths by remote paths
    // .pipe(replace('../', SERVER_URL))
    .pipe(replace({
      patterns: [
        {
          match: /\.\.\//g,
          replacement: SERVER_URL
        }
      ]
    }))
    .pipe(uglify())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

// minify CSS files
gulp.task('css', function () {
  return gulp.src(glob_pattern('css'))
    // .pipe(changed(DEST))
    // .pipe(replace('../', SERVER_URL))
    .pipe(replace({
      patterns: [
        {
          match: /\.\.\//g,
          replacement: SERVER_URL
        }
      ]
    }))
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

// minify JSON files
gulp.task('json', function () {
  return gulp.src(glob_pattern('json'))
    // .pipe(changed(DEST))
    // .pipe(replace('../', SERVER_URL))
    .pipe(replace({
      patterns: [
        {
          match: /\.\.\//g,
          replacement: SERVER_URL
        }
      ]
    }))
    .pipe(insert.transform(function( contents, file ) {
      return 'ccm.callback[ "' + basename(file.path) + '" ](' + contents + ');';
    }))
    .pipe(jsonminify())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(DEST));
});

/* **************************************
*              doc
* generate jsdoc3 API documents from comments inside JavaScript files
* using jsdoc3
* generate extra gulp task per ccm-component
* for generating extra API documents per ccm-component
* ************************************ */

// remember list of task names
var folders = getFolders(SRC);
var task_names = [];

// iterate over all folders in REPO
folders.map(function(folder) {
  if ( !folder || folder.length === 0 ) return;
  var sub_config = JSON.parse(JSON.stringify(config)); // separate deep copy for each folder
  sub_config.opts.destination = path.join('..', REPO + config.gulp.repo_suffix, config.gulp.api_dirname, folder);
  var task_name = 'doc_' + folder;
  task_names.push( task_name );

  // generate extra gulp task per ccm-component, e.g. doc_blank
  return gulp.task( task_name, function (cb) {
    gulp.src( [ path.join(SRC, folder, '*.js') ], {read: false} )
      .on('error', gutil.log)
      .pipe(jsdoc( sub_config, cb ));
  });
});

gulp.task('doc', function (done) {
  runSequence(task_names, function () { // TODO runSequence to be replaced in gulp 4
    console.log('=== doc task ready ===');
    done();
  });
});

// write api index into index.html file of github.io home page
gulp.task('api', function (done) {
  var index_dir = SRC + config.gulp.repo_suffix;
  return gulp.src( path.join( index_dir, config.gulp.index_file )  )
    .pipe(replace({
      patterns: [
        {
          match: /<!-- api_begin -->.*?<!-- api_end -->/im,
          replacement: folders.reduce(function( list, component ) {
            return list + '<li><a href="api/' + component +
              '/' + config.gulp.index_file + '" target="_blank">' + component +
              ' API</a>' +
              '</li>';
          }, '<!-- api_begin -->') + '<!-- api_end -->'
        }
      ]
    }))
    .pipe(gulp.dest( index_dir ));
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
      return ! config.gulp.exclude_folders[ file ] && fs.statSync(path.join( dir, file )).isDirectory();
    });
}

function param_replace( param_string, replace_object ) {
  return param_string.replace(/\{(.*?)\}/g, function(match, param) {
    return param in replace_object ? replace_object[param] : match;
  });
}