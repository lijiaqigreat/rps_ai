function updateBot(param,bot,botplay,result){
  //reward bot
  var result2=(result+(bot.predict-botplay)+3) % 3;
  bot.food=bot.food*param.rewardk1+result2-1;
  //auto correct
  var index=state*9+bot.predict*3+result2;
  if(Math.random()<param.correct_k1*Math.exp(-bot.food*param.correct_k2)){
    bot.rule[index]=((bot.rule[index]/3)|0)*3+((botplay-result+2)%3);
  }
  //update state
  var tmp=bot.rule[state*9+botplay*3+result];
  bot.state=(tmp/3) | 0;
  bot.predict= tmp % 3;
}
function breed(param,bots){
  bots.sort(function(b1,b2){
    return b1.food-b2.food;
  });
  n_mutate=(param.r_mutate*bots.length) | 0;
  for(var i=0;i<param.n_mutate;i++){
    bots[i]=JSON.parse(JSON.stringify(bots[randomInt(bots.length-param.n_mutate)+n_mutate]));
    mutate(param,bots[i]);
  }
}
function randomInt(n){
  return Math.random()*n | 0;
}
function mutate(param,bot){
  for(var i=0;i<param.dimention*9;i++){
    if(Math.random()>param.mutate_rate){
      bot.rule[i]=randomInt(param.dimention*3);
    }
  }
}
function initBot(param){
  rule=Array(param.dimention*9);
  for(var i=0;i<rule.length;i++){
    rule[i]=randomInt(param.dimention*3);
  }
  return {
    "predict":randomInt(3),
    "state":0,
    "food":0,
    "rule":rule
  };
}

