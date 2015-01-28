/*global describe */
'use strict';

var testSuite = require('./base-test-suite');

describe('app:base', testSuite.bind(null, false));
describe('app:modernizr', testSuite.bind(null, true));
