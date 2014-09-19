/*
0: lose
1: draw
2: win

0: rock
1: paper
2: scisser
 */
var choice_names=["rock","paper","scisser"];
var choice_names2=["R","P","S"];
var human_result_names=["win","tie","lose"];
var human_result_names2=["W","T","L"];

function init(){
  for(var i=0;i<3;i++){
    choice_names[choice_names[i]]=i;
  }
}

var test_data=[8,2,3,4,6,7];
function randomInt(n){
  return (Math.random()*n) | 0;
}
function bot_random(args){
  var size=args.game.size;
  return {
    "args":args,
    "food":args.food | 0,
    "predict":randomInt(size),
    "reset":function(){
      this.predit=randomInt(this.args.game.size);
    },
    "update":function(choice1,choice2){
      this.predict=randomInt(this.args.game.size);
    }
  };
}
function bot_tree(args){
  var count_init=args.count_init;
  return {
    "args":args,
    "food":args.food | 0,
    "predict":randomInt(3),
    "last_choice":0,
    "history_begin":undefined,
    "node":{
      "count":[count_init,count_init,count_init],
      "children":Array(9)
    },
    "reset":function(){
      this.predit=randomInt(3);
    },
    "update":function(choice1,choice2){
      var size=this.args.game.size;
      var count_init=this.args.count_init;
      //relative actual choice by bot
      var choicer1=(choice1-this.last_choice+3)%3;
      var choicer2=(choice2-this.last_choice+3)%3;
      var result=(choice2-choice1+4)%3;
      var index=choicer2*3+result;
      //update counts for nodes
      var node=this.node;
      var history=this.history_begin;
      var history_index;
      while(true){
        node.count[choicer2]+=1;
        //move to next
        if(history===undefined){
          break;
        }
        history_index=history.index;
        history=history.next;
        if(node.children[history_index]===undefined){
          node.children[history_index]={
            "count":node.count.map(function(c){
              return c/(size*size)+count_init;
            }),
            "children":Array(9)
          };
        }
        node=node.children[history_index];
      }
      //update history
      this.history_begin={
        "index":index,
        "next":this.history_begin
      };
      this.last_choice=choice2;
      //find best count
      var max=-Math.log(size)-1;
      var maxc;
      node=this.node;
      history=this.history_begin;
      var tmpd=0;
      while(node!==undefined){
        tmpd+=1;
        var tmp=0;
        var sum=0;
        node.count.forEach(function(c){
          tmp+=c*Math.log(c);
          sum+=c;
        });
        tmp=tmp/sum-Math.log(sum);
        if(max<=tmp){
          max=tmp;
          maxc=node.count;
        }
        if(history===undefined){
          break;
        }
        if(tmpd>=6){
          break;
        }
        node=node.children[history.index];
        history=history.next;
      }
      //console.log(tmpd);
      this.predict=(this.last_choice+this.args.game.getWin(maxc))%3;
    },
    "evolve":function(datas,args){
      
    }
  };
}
function bot_automata(option){
  //init const
  //actual choice by bot
  var choice1=(data[i]/3) | 0;
  //choice by human
  var choice2=data%3;
  //relative actual choice by bot
  var choice=(choice1-last_choice+3)%3;
  var result=(choice2-choice1+1)%3;
  last_choice=(last_choice+choice)%3;
}
function iterate(bot,data,args){
  //actual choice by bot
  var choice1=(data/3) | 0;
  //choice by human
  var choice2=data%3;
  var result2=(bot.predict-choice2+1)%3;
  //update food
  bot.food=bot.food*args.rewardk1+result2-1;
  bot.update(choice1,choice2);
  return bot.predict;
}
init();
var rps_game={
  "size":3,
  "result":function(diff){
    return (diff+4)%3;
  },
  "getWin":function(count){
    var max=0;
    var maxi=-1;
    for(var i=0;i<this.size;i++){
      if(max<count[i]){
        max=count[i];
        maxi=i;
      }
    }
    return (maxi+1)%3;
  }
  /*
  "getWin":function(count){
    //update prediction
    var sum=0;
    count.forEach(function(c){
      sum+=c;
    });
    var tmp=Math.random()*sum;
    for(var i=0;i<this.size;i++){
      tmp-=count[i];
      if(tmp<=1e-10){
        break;
      }
    }
    return (i+1)%3;
  }
  */
};

bot_tree1=bot_tree({"game":rps_game,"count_init":1});
var count=[0,0,0];
function test(bot,choice){
  var result=(bot.predict-choice+4)%3;
  count[result]++;

  document.getElementById("notification").innerHTML="You played "+choice_names[choice]+", Bot played "+choice_names[bot.predict]+", You "+human_result_names[result]+"!";

  var textnode=document.createTextNode("("+choice_names2[choice]+" "+choice_names2[bot.predict]+" "+human_result_names2[result]+")\n");
  document.getElementById("result").appendChild(textnode);

  document.getElementById("summary").innerHTML="Wins,Ties,Loose: "+count+"\nratio:"+(count[0]+count[1]/2)/(count[0]+count[1]+count[2]);

  bot.update(bot.predict,choice);
}
