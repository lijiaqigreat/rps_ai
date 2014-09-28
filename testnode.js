wd = require('wd');
// browser capabilities
var DESIREDS = require('./desireds');

// http configuration, not needed for simple runs
wd.configureHttp( {
  timeout: 60000,
  retryDelay: 15000,
  retries: 5
});

// building desired capability
var browserKey = process.env.BROWSER || 'chrome';
var desired = DESIREDS[browserKey];
desired.name = 'example with ' + browserKey; 
desired.tags = ['tutorial'];

  var browser;
  var allPassed = true;
    var username = process.env.SAUCE_USERNAME;
    var accessKey = process.env.SAUCE_ACCESS_KEY;
    browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);
    if(true){
      // optional logging     
      browser.on('status', function(info) {
        console.log("m1: "+info.cyan);
      });
      browser.on('command', function(meth, path, data) {
        console.log(' > ' + meth.yellow, path.grey, data || '');
      });            
    }
    var tmp=browser
      .init(desired).then(function(response){
        console.log("m2 "+tmp);
        tmp=browser
          .get("http://192.168.1.8:3000")
          .title().then(function(response) {
              console.log("Yey JSON!", response);
          });
        
      });


    browser
      .quit()
      .sauceJobStatus(allPassed);

