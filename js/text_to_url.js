define([],function(){
  var URL = window.URL || window.webkitURL;
  var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
  return function(text,type){
    if(!type){
      type="";
    }
    var blob;
    try {
        blob = new Blob([text], {type: type});
    } catch (e)  // Backwards-compatibility
    {
        //window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        blob = new BlobBuilder();
        blob.append(text);
        blob = blob.getBlob();
    }
    return URL.createObjectURL(blob);
  };
});
