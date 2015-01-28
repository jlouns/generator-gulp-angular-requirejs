# generator-gulp-angular-requirejs
[![Build Status](https://travis-ci.org/jlouns/generator-gulp-angular-requirejs.svg?branch=master)](https://travis-ci.org/jlouns/generator-gulp-angular-requirejs)
[![npm version](https://badge.fury.io/js/generator-gulp-angular-requirejs.svg)](http://badge.fury.io/js/generator-gulp-angular-requirejs)
[![Coverage Status](https://coveralls.io/repos/jlouns/generator-gulp-angular-requirejs/badge.svg)](https://coveralls.io/r/jlouns/generator-gulp-angular-requirejs)
[![Dependency Status](https://david-dm.org/jlouns/generator-gulp-angular-requirejs.svg)](https://david-dm.org/jlouns/generator-gulp-angular-requirejs)

> [Yeoman](http://yeoman.io) generator for AngularJS webapps incorporating requirejs and gulp

## Usage

Install dependencies:
```
npm install -g yo bower
```

Install `generator-gulp-angular-requirejs`:
```
npm install -g generator-gulp-angular-requirejs
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo gulp-angular-requirejs`:
```
yo gulp-angular-requirejs
```

Run `gulp` for building, `gulp serve` for preview, and `gulp test` for tests.

## Features

* Gulp build process with development and production builds
* Scaffolding for requirejs with a simple angular app
* Scaffolding for LESS styles with Bootstrap
* Unit tests run by karma with code coverage output
* Integration tests run by protractor
* jQuery, lodash, and Modernizr preinstalled

## License

MIT © [Jonathan Lounsbury](https://github.com/jlouns)
