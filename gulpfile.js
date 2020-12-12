var gulp       = require('gulp');
var gulpwebpack= require('gulp-webpack');
var webpack    = require('webpack');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var del        = require('del');
var bump       = require('gulp-bump');
var pkg        = require('./package.json');

var DEST = './build';

//clear out the build directory
gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('build', function(callback) {
  webpack({
    cache: true,
    entry: './src/index.js',
    output: {
      library: 'divvyVaultClient',
      path: './build/',
      filename: [ 'divvy-vault-client-', '.js' ].join(pkg.version)
    },
    externals: {'divvy-lib': 'divvy'}
  }, callback);
});

// Bower Build Steps
gulp.task('bower-build', function(callback) {
  gulp.src('src/index.js')
    .pipe(gulpwebpack({
      cache: true,
      output: {
        library: 'divvyVaultClient'
      },
      externals: {'divvy-lib': 'divvy'}
    }))
    .pipe(rename('divvy-vault-client.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename('divvy-vault-client-min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bower-build-debug', function(callback) {
  gulp.src('src/index.js')
    .pipe(gulpwebpack({
      cache: true,
      debug: true,
      output: {
        library: 'divvyVaultClient'
      },
      externals: {'divvy-lib': 'divvy'}
    }))
    .pipe(rename('divvy-vault-client-debug.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bower-version', function() {
  gulp.src('./dist/bower.json')
  .pipe(bump({ version: pkg.version }))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('bower', ['bower-build', 'bower-build-debug', 'bower-version']);

// Watch files For Changes
gulp.task('delta', function() {
  gulp.watch('src/*.js', ['build']);
});

gulp.task('default', ['build']);
gulp.task('watch', ['delta', 'build']);
