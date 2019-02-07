"use strict";
//  window.onload=function(){
//   console.log(window.frames["contentFrame"].document.getElementById("ifr"))
//   var ifr=window.frames["contentFrame"].document.getElementById("ifr");
//   console.log(getComputedStyle(ifr).height)
//   var ifrH=getComputedStyle(ifr).height;

  
//   document.getElementsByName("contentFrame")[0].style.height=ifrH;
//   main.style.height=ifrH;
//  }
 window.onload=function(){
   /* *****************************设置iframe和main的高 */
  //获取iframe内的document
  var ifr_document=window.frames["contentFrame"].document;
  //获取iframe内的document内的body
  var ifr_body=ifr_document.getElementById("ifr");
  
  //设置高度
  var ifrH=getComputedStyle(ifr_body).height;
  document.getElementsByName("contentFrame")[0].style.height=ifrH;
  var main =document.getElementById("main");
  var cover_iframe = document.getElementById("cover_iframe");
  main.style.height=ifrH;



  /* *************************图片懒加载 */
  var isMacWebkit = (navigator.userAgent.indexOf("Macintosh")!==-1&&
                      navigator.userAgent.indexOf("WebKit") !== -1);
  var isFirefox=(navigator.userAgent.indexOf("Gecko")!==-1);


  var header=document.getElementById("header");
  var headerH=header.offsetHeight;
  var viewH=innerHeight;
  var scrollTop = 0;
  var prevTime=0;
  
  //0  4  8  16   20
  var floorContainer=ifr_document.getElementById("floor-container");
  var imgs=floorContainer.getElementsByTagName("img");
  // console.log(imgs)
  // console.log(imgs[8].offsetParent.offsetParent.offsetParent.offsetParent.offsetParent)


  document.onwheel=ifr_document.onwheel=fn_wheelHandler;//未来浏览器
  document.onwheel=ifr_document.onmousewheel=fn_wheelHandler;//大多数当前浏览器
  if(isFirefox){//仅火狐
    ifr_document.addEventListener('DOMMouseScroll',fn_wheelHandler,false);
    document.addEventListener('DOMMouseScroll',fn_wheelHandler,false);
  }

  loadImg();
  function fn_wheelHandler(event){
    //两次滚动价格超过500ms
    var currentTime = new Date().getTime();
    if(currentTime-prevTime<500) return;
    

    var e= event || window.event;//标准 || IE
    if(isFirefox && e.type!=="DOMMouseScroll"){
      ifr_document.removeEventListener('DOMMouseScroll',fn_wheelHandler,false);
      document.removeEventListener("DOMMouseScroll",fn_wheelHandler,false);
    }
      

    loadImg()

    prevTime=new Date().getTime();


    if(e.preventDefault) e.preventDefault();//阻止默认
    if(e.stopPropagation) e.stopPropagation();//阻止冒泡
    e.cancelBubble=true;//IE 阻止冒泡
    e.returnValue=false;//IE
    return false;
  }


  function loadImg(){
    scrollTop=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    for (var img of imgs){
      let top = img.offsetTop;
      let temp = img;
      while(img = img.offsetParent){//获得图片到文档顶部的距离
        top+=img.offsetTop;
      }
      img= temp;
      if(top+headerH<=scrollTop+viewH+50){
          img.src=img.getAttribute("data-src")
      }
    }
  }
 }
 