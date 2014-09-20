var effect=function(){
  return {
    'clearshuffle':function(parent){
      if(parent.runner!==undefined){
        window.clearInterval(parent.runner);
        parent.runner=undefined;
      }
      //add 
      while(parent.childNodes.length!==1){
        parent.removeChild(parent.childNode[0]);
      }
    },
    'shuffle':function(parent,children,time){
      this.clearshuffle(parent);
      if(time===0){
        return;
      }
      parent.replaceChild(children[0],parent.firstChild);
      parent.runner=window.setInterval(function(children){
        var tmp2=children.slice(0);
        return function(){
          parent.replaceChild(tmp2[(Math.random()*tmp2.length) | 0],parent.firstChild);
        };
      }(children),time);
        
    },
    'unshuffle':function(parent,child,time){
      this.clearshuffle(parent);
      parent.replaceChild(child,parent.firstChild);
    }
  };
}();
