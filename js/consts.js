define([],function(){
  var f= {
    randomInt:function(n)
    {
      return Math.random()*n | 0;
    },
    abbr:["r","p","s",'x'],
    result:["TIE","LOSE","WIN","UNKNOWN"],
    bottext:[
      [
        "Interesting play.",
        "Tie is not good enough!"
      ],
      [
        "I knew I would beat you!",
        "Your mind is too easy to guess.",
        "Don't be so easy on me."
      ],
      [
        "I can do better next time!",
        "I lost, that's impossible!",
        "How did I loose?"
      ],
      [
        "I'm broken... %&#$@^"
      ],
      [
        "I'm ready to play!"
      ]
    ]
  };
  var max=0;
  f.bottext.forEach(function(e){
    e.forEach(function(x){
      max=max>x.length?max:x.length;
    });
  });
  f.bottext.forEach(function(e){
    e.forEach(function(e,i,a){
      a[i]=e+Array(max-e.length+1).join(" ");
    });
  });
  return f;
});
