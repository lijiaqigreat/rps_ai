define([],function(){
  return {
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
      ]
    ]
  };
});
