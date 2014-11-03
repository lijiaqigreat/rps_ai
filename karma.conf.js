// Karma configuration
// Generated on Fri Oct 31 2014 08:14:51 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      //'vendor/underscore.js',
      //'js/object.js',
      //'test/object.test.js'
      /*
      'vendor/jquery.min.js',
      'vendor/jasmine-2.0.3/jasmine.js',
      'vendor/jasmine-2.0.3/jasmine-html.js',
      'vendor/jasmine-2.0.3/boot.js',
      */
      {pattern: 'js/**/*.js', included: false},
      {pattern: 'vendor/**/*.js', included: false},
      {pattern: 'bots/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},
      'test-main.js',
      //'test/test.js',
      //'js/tokens.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
