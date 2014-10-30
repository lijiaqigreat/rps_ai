describe("A suite is just a function", function() {
  var a;

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });
});
describe("round", function() {
  it("has same size for all round", function() {
    
  });
});
describe("worker",function()
{
  var workergen=require("../js/worker.js");
  var worker;
  it("basic communication",function(){
    worker=new workergen();
  });
  
  
  
  
 
});
