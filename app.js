const express=require("express");
const server=express();
server.listen(3000,()=>{
  console.log("服务器启动成功，监听端口3000...");
});

server.use(express.static("public"));