function a(data){
  postMessage("get "+JSON.stringify(data.data));
  data.data.no="a";
}
self.addEventListener("message",a);
