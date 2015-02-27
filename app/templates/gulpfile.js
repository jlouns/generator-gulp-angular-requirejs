'use strict';

var gulp = require('gulp');

var karma = require('karma').server;

var minimist = require('minimist');

// load plugins
var autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	flatten = require('gulp-flatten'),
	filter = require('gulp-filter'),
	gulpif = require('gulp-if'),
	imagemin = require('gulp-imagemin'),
	minifyHtml = require('gulp-minify-html'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	livereload = require('gulp-livereload'),
	mainBowerFiles = require('main-bower-files'),
	minifyCss = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
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

// connect server utils
var connectServerPort = 9000,
	connectServerAddress = 'http://localhost:' + connectServerPort,
	runConnectServer = function(dirs, indexes) {
		indexes = indexes || [];

		if (typeof dirs === 'string') {
			dirs = [dirs];
		}

		if (typeof indexes === 'string') {
			indexes = [indexes];
		}

		var connect = require('connect');

		var app = connect();

		if (livereload.server) {
			app.use(require('connect-livereload')({ port: 35729 }));
		}

		var serveStatic = require('serve-static');
		dirs.forEach(function(dir) {
			app.use(serveStatic(dir));
		});

		if (indexes.length > 0) {
			var serveIndex = require('serve-index');
			indexes.forEach(function(index) {
				app.use(serveIndex(index));
			});
		}

		return app.listen(connectServerPort)
			.on('listening', function () {
				console.log('Started connect web server on ' + connectServerAddress);
			});
	},
	openApp = function() {
		require('opn')(connectServerAddress);
	};

// utils for jshint
var runJshint = function(src, options) {
	return gulp.src(src)
		.pipe(jshint(options))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.pipe(jscs());
};

gulp.task('styles', function () {
	return gulp.src('app/**/*.less')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(filter('styles/main.less'))
		.pipe(less())
		.pipe(autoprefixer({ browsers: ['last 1 version'] }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('jshint', function () {
	return runJshint(['app/scripts/**/*.js', 'gulpfile.js']);
});

gulp.task('html', ['styles'], function () {
	var lazypipe = require('lazypipe');

	var assets = useref.assets({searchPath: '{.tmp,app}'});

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
		.pipe(replace, '../lib/bower/bootstrap/fonts/','../fonts/');

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

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
	return gulp.src(mainBowerFiles().concat('app/fonts/**/*'))
		.pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe(flatten())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
	return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('unit-test-jshint', function () {
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

gulp.task('e2e-test-jshint', function () {
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
	var dirs, tasks;
	if (options.env === 'prod') {
		tasks = ['build'];
		dirs = 'dist';
	} else {
		tasks = ['styles'];
		dirs = ['app', '.tmp'];
	}

	tasks.push(function(err) {
		if (err) {
			return done(err.err);
		}

		var server = runConnectServer(dirs);

		gulp.src(['test/e2e/**/*.js'])
			.pipe(protractor({
				configFile: 'test/protractor.conf'
			}))
			.on('error', function(e) {
				server.close();
				return done(e);
			})
			.on('end', function() {
				server.close();
				return done();
			});
	});

	runSequence.apply(null, tasks);
});

gulp.task('test', ['jshint', 'unit-test', 'e2e-test']);

gulp.task('connect', function () {
	var server;
	if (options.env === 'prod') {
		server = runConnectServer('dist');
	} else {
		server = runConnectServer(['app', '.tmp'], 'app');
	}
	server.on('listening', openApp);
});

gulp.task('serve', function (done) {
	if (options.env === 'prod') {
		runSequence('build', 'connect', done);
	} else {
		livereload.listen();
		runSequence('styles', 'connect', 'watch', done);
	}
});

gulp.task('watch', function () {
	// watch for changes
	gulp.watch([
		'app/*.html',
		'app/partials/**/*.html',
		'.tmp/styles/**/*.css',
		'app/scripts/**/*.js',
		'app/images/**/*'
	]).on('change', livereload.changed);

	gulp.watch('app/styles/**/*.less', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['jshint']);
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
	return gulp.src('dist/**/*').pipe(size({title: 'build', gzip: true}));
});

gulp.task('ci', function (done) {
	runSequence('test', 'build', done);
});

gulp.task('default', function (done) {
	runSequence('clean', 'build', done);
});
