define(["jquery","underscore","../js/text_to_url.js"],function($,_,t2u){
  //console.log("config");
  describe("basic", function()
  {
    //console.log("config2");
    var a;
    it("toBe", function()
    {
      //console.log("test");
      a = true;
      expect(a).toBe(true);
    });
    it("async",function(done)
    {
      expect(true).toBe(true);
      setTimeout(done,10);
    });
    it("$.param",function()
    {
      expect($.param({a:1,b:"a"})).toBe("a=1&b=a");
    });
    it("Promise",function(done)
    {
      var unit=function(x){return x;};
      var dd=Promise.resolve("x");
      dd=dd.then(function(x){
        return Promise.resolve("y").then(unit);
      });
      dd.then(function(data){
        expect(data).toBe("y");
        done();
      },function(error){
        console.log(error.message);
        expect("").toBe("y");
        done();
      });

    });
    it("karma-html",function(){
      var html=window.__html__["test/helper.html"];
      //console.log(html);

      $("body").append($(html)[0]);
      //console.log($("#test_helper").text());
      expect(0).toBe(0);
    });
  });
});
