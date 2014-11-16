define(["../js/tokens.js","underscore"],
function(Tokens,_)
{
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
    it("can call forEach", function()
    {
      var self=this;
      var i=0;
      this.tokens.forEach(function(value,key){
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
      this.tokens.forEach(function(value,key){
        count++;
        expect(value).toBeLessThan(0.5);
      });
      expect(count).toBe(this.size);
    });
  });
});
