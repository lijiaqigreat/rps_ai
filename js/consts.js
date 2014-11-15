require([],function(){
  return {
    randomInt:function(n)
    {
      return Math.random()*n | 0;
    },
    abbr:["r","p","s",'_'],
    result:["TIE","LOSE","WIN","UNKNOWN"]
  };
});
