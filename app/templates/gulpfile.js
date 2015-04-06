'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var karma = require('karma').server;

var minimist = require('minimist');

// load plugins
var autoprefixer = require('autoprefixer-core'),
	del = require('del'),
	flatten = require('gulp-flatten'),
	filter = require('gulp-filter'),
	gulpif = require('gulp-if'),
	imagemin = require('gulp-imagemin'),
	minifyHtml = require('gulp-minify-html'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	mainBowerFiles = require('main-bower-files'),
	minifyCss = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
	postcss = require('gulp-postcss'),
	protractor = require('gulp-protractor').protractor,
	requirejsOptimize = require('gulp-requirejs-optimize'),
	replace = require('gulp-replace'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	runSequence = require('run-sequence'),
	size = require('gulp-size'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	useref = require('gulp-useref');

// parse environment
var options = minimist(process.argv.slice(2), {
	string: 'env',
	default: {
		env: 'dev'
	}
});

// get build options for the environment
var buildOptions;
if (options.env === 'prod') {
	buildOptions = {
		tasks: ['build'],
		dirs: ['dist']
	};
} else {
	buildOptions = {
		tasks: ['styles'],
		dirs: ['app', '.tmp']
	};
}

// local server utils
var runServer = function(open, callback) {
	browserSync({
		notify: false,
		port: 9000,
		open: open,
		server: {
			baseDir: buildOptions.dirs
		}
	}, callback);
};

// utils for jshint
var runJshint = function(src, options) {
	return gulp.src(src)
		.pipe(reload({ stream: true, once: true }))
		.pipe(jshint(options))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulpif(!browserSync.active, jshint.reporter('fail')))
		.pipe(jscs());
};

gulp.task('styles', function() {
	return gulp.src('app/**/*.less')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(filter('styles/main.less'))
		.pipe(less())
		.pipe(postcss([
			autoprefixer({ browsers: ['last 1 version'] })
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.tmp'))
		.pipe(reload({ stream: true }));
});

gulp.task('jshint', function() {
	return runJshint(['app/scripts/**/*.js', 'gulpfile.js']);
});

gulp.task('html', ['styles'], function() {
	var lazypipe = require('lazypipe');

	var assets = useref.assets({ searchPath: '{.tmp,app}' });

	var jsChannel = lazypipe()
		.pipe(requirejsOptimize, {
			name: '../lib/bower/almond/almond',

			optimize: 'none',
			useStrict: true,

			mainConfigFile: 'app/scripts/config/prod-config.js',
			baseUrl: 'app/scripts',

			include: ['main'],
			insertRequire: ['main']
		})
		.pipe(uglify);

	var libChannel = lazypipe()
		.pipe(uglify);

	var cssChannel = lazypipe()
		.pipe(minifyCss)
		.pipe(replace, '../lib/bower/bootstrap/fonts/', '../fonts/');

	var htmlChannel = lazypipe()
		.pipe(minifyHtml);

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('**/scripts/main.js', jsChannel()))
		.pipe(gulpif('**/lib/*.js', libChannel()))
		.pipe(gulpif('**/*.css', cssChannel()))
		.pipe(rev())
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(revReplace())
		.pipe(gulpif('**/*.html', htmlChannel()))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
	return gulp.src('app/images/**/*')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
	return gulp.src(mainBowerFiles().concat('app/fonts/**/*'))
		.pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe(flatten())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function() {
	return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('unit-test-jshint', function() {
	var options = {
		expr: true,
		globals: {
			define: false,
			describe: false,
			it: false,
			beforeEach: false,
			afterEach: false,
			expect: false,
			module: false,
			inject: false
		}
	};

	return runJshint(['test/karma.conf.js', 'test/test-main.js', 'test/unit/**/*.js'], options);
});

gulp.task('unit-test', ['unit-test-jshint'], function(done) {
	karma.start({
		configFile: __dirname + '/test/karma.conf.js',
		singleRun: true
	}, done);
});

gulp.task('e2e-test-jshint', function() {
	var options = {
		expr: true,
		globals: {
			describe: false,
			it: false,
			beforeEach: false,
			afterEach: false,
			expect: false,
			browser: false,
			element: false,
			by: false
		}
	};

	return runJshint(['test/protractor.conf.js', 'test/e2e/**/*.js'], options);
});

gulp.task('e2e-test', ['e2e-test-jshint'], function(done) {

	var tasks = buildOptions.tasks.slice(0);

	tasks.push(function(err) {
		if (err) {
			return done(err.err);
		}

		runServer(false, function(err) {
			if (err) {
				return done(err.err);
			}

			gulp.src(['test/e2e/**/*.js'])
				.pipe(protractor({
					configFile: 'test/protractor.conf'
				}))
				.on('error', function(e) {
					browserSync.exit();
					return done(e);
				})
				.on('end', function() {
					browserSync.exit();
					return done();
				});
		});
	});

	runSequence.apply(null, tasks);
});

gulp.task('test', ['jshint', 'unit-test', 'e2e-test']);

gulp.task('serve', function(done) {

	var tasks = buildOptions.tasks.slice(0);
	tasks.push('run');

	if (options.env !== 'prod') {
		tasks.push('watch');
	}

	tasks.push(done);

	runSequence.apply(null, tasks);
});

gulp.task('run', function(done) {
	runServer(true, done);
});

gulp.task('watch', function() {
	// watch for changes
	gulp.watch([
		'app/*.html',
		'app/partials/**/*.html',
		'app/scripts/**/*.js',
		'app/images/**/*'
	]).on('change', reload);

	gulp.watch('app/styles/**/*.less', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['jshint']);
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function() {
	return gulp.src('dist/**/*').pipe(size({ title: 'build', gzip: true }));
});

gulp.task('ci', function(done) {
	runSequence('test', 'build', done);
});

gulp.task('default', function(done) {
	runSequence('clean', 'build', done);
});
