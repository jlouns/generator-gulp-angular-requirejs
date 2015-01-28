'use strict';

var testSuite = require('./base-test-suite');

describe('app:base', testSuite.bind(this, false));
describe('app:modernizr', testSuite.bind(this, true));
