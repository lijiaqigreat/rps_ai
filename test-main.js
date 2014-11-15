var tests = [];
for (var file in window.__karma__.files) {
    if (/test\.js$/.test(file)) {
        tests.push(file);
    }
}
console.log(tests);

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

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
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,//['/base/test/test.js'],

    // start test run, once Require.js is done
    callback: window.__karma__.start
});












