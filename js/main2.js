var env=function(){
  var randomInt=function(n){
    return Math.random()*n | 0;
  };
  return {
    'bots':{
      'template':{
        //no function
        'default_param':{},
        //param is passed by reference
        'init':function(param){
          if(param===undefined){
            param=this.default_param;
          }
          return {
            'predict':randomInt(3),
            'update':function(c_hum,c_bot){
              this.predict=randomInt(3);
            },
            'factory':this,
            '_private':{}
          };
        },

        'train':function(param,data){
          return this.init(param);
        },
        //everything else goes to _private
        '_private':undefined
      },
      'markov':{
        'default_param':{
          'max_level':4,
          'decay':0.9,
          'node':{
            'count':[0,0,0],
            'children':Array(9)
          }
        },
        'init':function(param){
          if(param===undefined){
            param=this.default_param;
          }
          return {
            'predict':randomInt(3),
            'update':function(c_hum,c_bot){
              c_humr=(c_hum-this._private.c_last+3)%3;
              c_botr=(c_bot-this._private.c_last+3)%3;
              var his=this._private.history;
              //update count
              var node=this._private.node;
              this._private.updateCount(node.count,c_humr);
              var tmp;
              for(var i=0;his[i]!==undefined;i++)
              {
                tmp=this._private.relativeHistory(his[i]);
                //change history
                if(node.children[tmp]===undefined){
                  node.children[tmp]=this._private.createNode(node);
                }
                node=node.children[tmp];
                this._private.updateCount(node.count,c_humr);
              }
              //console.debug('test1 i:'+i);
              //update history
              for(i=param.max_level-2;i>=0;i--)
              {
                his[i+1]=his[i];
              }
              his[0]=c_hum*3+c_bot;
              //update predict
              var tmp_get_score=function(count){
                //return Math.max.apply(undefined,count);
                var sum1=0;
                var sum2=0;
                for(var i=0;i<3;i++){
                  sum1+=count[i];
                  sum2+=count[i]*count[i];
                }
                return (sum2/3-sum1*sum1/9)/(sum1/3);
              };
              node=this._private.node;
              var tmp_debug=node.count+"\n";
              var best_count=node.count;
              var best_score=tmp_get_score(best_count);
              env.__tmp=-1;
              for(i=0;his[i]!==undefined;i++){
                tmp=this._private.relativeHistory(his[i]);
                if(node.children[tmp]===undefined){
                  node.children[tmp]=this._private.createNode(node);
                  //no need to analyze deeper nodes
                  break;
                }
                node=node.children[tmp];
                tmp_debug+=node.count+"\n";
                var score=tmp_get_score(node.count);
                if(score>best_score){
                  best_score=score;
                  best_count=node.count;
                  env.__tmp=i;
                }
              }
              this.predict=function(count){
               var max=0;
                var maxi=-1;
                for(var i=0;i<3;i++){
                  if(count[i]>max){
                    max=count[i];
                    maxi=i;
                  }
                }
                return (maxi+1)%3;
              }(best_count);
              this._private.c_last=(this._private.c_last+c_hum)%3;
              console.debug(this.predict+" "+this._private.c_last+" "+env.__tmp+"\n"+tmp_debug);
              this.predict=(this.predict+this._private.c_last)%3;
            },
            'factory':this,
            '_private':{
              'c_last':0,
              //his[i]=c_hum * 3 + c_bot relative to his[i+1]
              'history':Array(param.max_level),
              'node':param.node,
              'createNode':function(_parent){
                var tmp=Array(3);
                for(var i=0;i<3;i++){
                  //tmp[i]=_parent.count[i]*param.decay;
                  tmp[i]=0;
                }
                return {
                  'count':tmp,
                  'children':Array(9)
                };
              },
              'updateCount':function(count,c_hum){
                for(var i=0;i<3;i++){
                  count[i]*=param.decay;
                }
                count[c_hum]+=1;
              },
              'relativeHistory':function(hisi){
                return ((((hisi/3)|0)-this.c_last+3)%3)*3+((hisi-this.c_last+3)%3);
              }
            }
          };
        },
        'train':function(param,data){
          //TODO
          return this.init(param);
        },
        '_private':{
        }

      }
    }
    
  };
}();
