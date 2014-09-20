var tmp=["r","p","s"];
var image_hum=Array(3);
var image_bot=Array(3);
for(var i=0;i<3;i++){
  image_hum[i]=$("<image src=\"asset/rps_"+tmp[i]+"1.jpg\">")[0];
  image_bot[i]=$("<image src=\"asset/rps_"+tmp[i]+"2.jpg\">")[0];
}
var home={
  'bot':env.bots.markov.init()
};

function test(c_hum){
  var c_bot=home.bot.predict;
  effect.shuffle($("#dis-hum")[0],image_hum,100);
  effect.shuffle($("#dis-bot")[0],image_bot,100);
  home.bot.update(c_hum,c_bot);
  var timeout=function(parent,child){
    return function(){
      effect.clearshuffle(parent);
      parent.replaceChild(child,parent.firstChild);
    };
  };
  window.setTimeout(timeout($("#dis-hum")[0],image_hum[c_hum]),1000);
  window.setTimeout(timeout($("#dis-bot")[0],image_bot[c_bot]),1000);
}

