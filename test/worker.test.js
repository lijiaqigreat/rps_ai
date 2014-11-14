define(["../js/worker.js","./workerHelper.js"],
function(Worker,workerHelper)
{
  describe("worker", function()
  {
    beforeEach(function()
    {
      var self=this;
      self.worker=new Worker();
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
      var worker=this.worker;
      var genUnit=function(value){
        return worker.call("unit",value)
        .then(function(message){
          expect(message).toBe(value);
        });
      };
      var tmp=this.worker.call("add",5,-1.5).then(function(message)
      {
        expect(message).toBe(3.5);
      }).then(function(){
        return genUnit(0);
      }).then(function(){
        return genUnit(undefined); 
      }).then(done);
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
