define(["../js/tokens.js","../js/worker.js","jquery","underscore","Promise","./workerHelper.js"],function(Tokens,worker,$,_,Promise,workerHelper){
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
  describe("tokens", function()
  {
    beforeEach(function()
    {
      this.size=20;
      this.tokens=new Tokens();
      this.key=Array(this.size);
      this.value=Array(this.size);
      var i;
      for(i=0;i<this.size;i++){
        this.value[i]=Math.random();
        this.key[i]=this.tokens.store(this.value[i]);
      }
    });
    it("can match key value", function()
    {
      for(var i=0;i<this.size;i++){
        expect(this.tokens[this.key[i]]).toBe(this.value[i]);
      }
    });
    it("can return uniq sorted token", function()
    {
      var key2=_.uniq(this.key);
      key2.sort(function(a,b){return a-b;});
      expect(key2.length).toEqual(this.key.length);
      expect(key2).toEqual(this.key);
    });
    it("can call all", function()
    {
      var self=this;
      var i=0;
      this.tokens.all(function(key,value){
        expect(self.key[i]).toBe(key);
        expect(self.value[i]).toBe(value);
        i++;
      });
    });
    it("can delete key", function()
    {
      var count=0;
      for(i=0;i<this.size;i++){
        if(this.value[i]>=0.5){
          delete this.tokens[this.key[i]];
          count++;
        }else{
        }
      }
      this.tokens.all(function(key,value){
        count++;
        expect(value).toBeLessThan(0.5);
      });
      expect(count).toBe(this.size);
    });
  });
  describe("worker", function()
  {
    beforeEach(function()
    {
      var self=this;
      self.worker=new worker();
      self.worker.init(workerHelper);
      //self.worker.call("a","b");
      //console.log(self.worker);
      //console.log(self.worker.worker.onmessage);
    });
    it("can log",function(done)
    {
      var tmp=this.worker.call("delay",10,"for jasmine").then(function(message)
      {
        expect(message.indexOf("for jasmine")).not.toBe(-1);
        done();
      });
    });
    it("can return",function(done)
    {
      var tmp=this.worker.call("add",5,-1.5).then(function(message)
      {
        expect(message).toBe(3.5);
        done();
      });
    });
    it("can stop",function(done)
    {
      var tmp=this.worker.call("delay",10,"for jasmine").then(function(message)
      {
        expect(message).toBeUndefined();
        done();
      },function(error){
        expect(error).not.toBeUndefined();
        done();
      });
      this.worker.stop();
    });
  });
});
