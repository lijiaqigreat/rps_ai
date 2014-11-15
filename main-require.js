requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '',

    paths: {
        'jquery': 'vendor/jquery',
        'underscore': 'vendor/underscore',
        'Promise': 'vendor/promise-6.0.0.min'
    },

    shim: {
        'underscore': {
          exports: '_'
        },
        'Promise': {
          exports: 'Promise'
        }
    }

    // ask Require.js to load these files (all our tests)

    // start test run, once Require.js is done
});
require(["./js/main.js"],function(){
});
