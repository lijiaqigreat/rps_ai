requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '',

    paths: {
        'jquery': 'vendor/jquery',
        'underscore': 'vendor/underscore',
        'Promise': 'vendor/promise-6.0.0.min',
        'jasmine': "vendor/jasmine-2.0.3/jasmine.js",
        'jasmine-html': "vendor/jasmine-2.0.3/jasmine-html.js"
    },

    shim: {
        'underscore': {
          exports: '_'
        },
        'Promise': {
          exports: 'Promise'
        },
        'jasmine': {
          exports: 'jasmine'
        }
    }

    // ask Require.js to load these files (all our tests)

    // start test run, once Require.js is done
});
var tests=[
  "test/basic.test.js",
  "test/worker.test.js",
  "test/tokens.test.js",
  "test/game.test.js",
  "test/player.test.js"
];
require(tests,function(){
  jasmine.getEnv().execute();
});
