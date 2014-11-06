define(["jquery","underscore","Promise"],function($,_,Promise){
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
    it("$.param",function(){
      expect($.param({a:1,b:"a"})).toBe("a=1&b=a");
    });
  });
});
