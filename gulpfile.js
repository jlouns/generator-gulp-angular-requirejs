'use strict';

var gulp = require('gulp'),
	coveralls = require('gulp-coveralls'),
	istanbul = require('gulp-istanbul'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	runSequence = require('run-sequence');

var paths = {
	scripts: 'app/index.js',
	tests: 'test/**/*-spec.js'
};

var runJshint = function(src, jsHintOptions, jsCsOptions) {
	return gulp.src(src)
		.pipe(jshint(jsHintOptions))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.pipe(jscs(jsCsOptions));
};

gulp.task('templates-jshint', function() {
	var jsHintRc = './app/templates/jshintrc',
		jsCsRc = './app/templates/jscsrc';

	return runJshint(['app/templates/**/*.js', '!app/templates/_*/**/*.js'], jsHintRc, jsCsRc);
});

gulp.task('jshint', ['templates-jshint'], function() {
	return runJshint([paths.scripts, paths.tests, 'gulpfile.js']);
});

gulp.task('test', function(done) {
	gulp.src(paths.scripts)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function() {
			gulp.src(paths.tests)
				.pipe(mocha())
				.pipe(istanbul.writeReports())
				.on('end', done);
		});
});

gulp.task('coveralls', function() {
	return gulp.src('coverage/lcov.info')
		.pipe(coveralls());
});

gulp.task('ci', function(done) {
	runSequence('jshint', 'test', 'coveralls', done);
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['jshint', 'test']);
});

gulp.task('default', ['jshint', 'test']);
