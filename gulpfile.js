'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var bundler = browserify('./index.js');

gulp.task('build', function () {
	return bundler.bundle()
		.on('error', showError)
		.pipe(source('dom-wrapper.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./bundle'))
		.pipe(rename('dom-wrapper.min.js'))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./bundle'));
});

gulp.task('default', ['build']);

/*Functions*/
function showError (err) {
	gutil.log(gutil.colors.red(err.message));
	this.emit('end');
}
