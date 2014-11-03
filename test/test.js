define(["js/tokens","js/worker","jquery","underscore"],function(Tokens,Worker,$,_){
  describe("basic", function()
  {
    var a;
    it("toBe", function()
    {
      console.log("test");
      a = true;
      expect(a).toBe(true);
    });
    it("async",function(done)
    {
      setTimeout(done,10);
    });
    it("$.param",function(){
      expect($.param({a:1,b:"a"})).toBe("a=1&b=a");
    })
    it("ajax",function(done)
    {
      $.ajax("../test/workerHelper.js",{
        success:function(text){
          expect(text[0]).toBe('v');
          done();
        },
        error:function(jqXHR,text,errorThrown){
          console.log(text);
          console.log(errorThrown);
          done();
        }
      })
    })
  });
  describe("sync tokens", function()
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
    beforeEach(function(done)
    {
    });
  });
});
