 /*  1.为了能够在鼠标在ul或li上依然滚动，把滚动事件绑定在了document上
        2.为了能够在滚动后鼠标如果还在li上能滚动回去，用了 
        if(isOver){
              mOverHandler.call(cLi,eV)
        }
        3.为了当鼠标移到li上即使还没有到达目标也能在到达目标后滚动到li位置，用了setTimeout 700ms
          同时700ms到达前从li上移开了，用了mouseouter clearTimeout
        4.ulT和targetT不同步，因为ulT在其他地方重新赋值了，所以下面重新给ulT赋值
        if(timeOut_overing) clearTimeout(timeOut_overing);
        timeOut_overing=setTimeout(()=>{
          ulT=parseFloat(getComputedStyle(floor).top);//为什么要重新获取？因为在wheelHandler中重新给ulT赋值了，ulT和targetT并不完全同步，但是targetT代表的是目标位置
          console.log("##################",ulT,targetT,viewH)
          if(ulT-targetT<2&&ulT-targetT>-2){//移动到目标位置后
            floor.style.cssText=`transition:none;top:${targetT}px`;
          }
        },1000)
        5. 鼠标over在li并且li不是active的时候不滚动，这样鼠标over在里上就不会一直滚动底部，可以去掉试试效果
      if(isOver&&e.target.className!='active') return;
    */
   "use strict";
   (function(){
     /* ***************************************翻屏 */
     // 判断浏览器类型
     var isMacWebkit=(navigator.userAgent.indexOf("Macintosh")!==-1&&navigator.userAgent.indexOf("WebKit")!==-1);
     var isFirefox=(navigator.userAgent.indexOf("Gecko")!==-1);
     //获取需要的节点
     var header=document.getElementById("header");
     var floor=document.getElementById("floor");
     var indicator=document.getElementById("indicator");
     var fragment=document.createDocumentFragment();
     var length=floor.querySelectorAll(".floor>li").length;
     var viewH=innerHeight;
     window.onresize=function(){
      viewH=innerHeight;
     }
 
     //动态添加指示器
     for(var i=0;i<length;i++){
       var li=document.createElement("LI");
       if(i==0) li.className="active";
       li.setAttribute("data-index",i);
       fragment.appendChild(li);
     }
     indicator.appendChild(fragment);
     var lis=indicator.getElementsByTagName("LI");
     
     
      //初始化事件处理函数参数
     var targetT=0,
         index=0,
         ulT=0,
         timeOut_wheel=null,//mousewheel
         timeOut_wheel2=null,
         timeOut_overing,//mouseover
         timeOut_overing2,
         isOver=false,//鼠标是否over
         // isWheel=false,//鼠标是否wheel
         isArrive=false,
         timeOut_isArrive=null,
         prevTargetT,
         cLi=null,//触发over事件的li
         eV=null;//触发over事件的li的event对象
         
    
     //注册事件处理函数
     document.onwheel=wheelHandler;//未来浏览器
     document.onmousewheel=wheelHandler//大多数当前浏览器
     // document.addEventListener("mousewheel",wheelHandler);
     if(isFirefox)//仅FireFox，包括FF未来
       document.addEventListener("DOMMouseScroll",wheelHandler,false);
     //注册事件处理函数
     indicator.onmouseover=mOverHandler;
     indicator.onmouseout=function(){
       var e=event || window.event;//标准或IE事件对象
       if(e.target.nodeName!=='LI') return;
       isOver=false;
       if(timeOut_overing2) clearTimeout(timeOut_overing2);
       // floor.style.cssText=`transition:none;top:${targetT}px`;
       // clearTimeout(timeOut_overing)
     }
 
     //mouseover处理函数
     function mOverHandler(event){
       var e=event || window.event;//标准或IE事件对象

       

       if(e.target.nodeName!=='LI') return;
       cLi=e.target,eV=e;
       isOver=true;
       
       // if(isWheel)return;
       
       //如果上一轮还没有滚动到目标位置，延迟滚动
       ulT=parseFloat(getComputedStyle(floor).top);
       // console.log("++++++++",index,targetT,ulT,[].indexOf.call(lis,e.target));
       var time=0;
       //如果还没到达目标位置，就再次移动，延迟500ms,让上一轮尽量靠近目标然后进行这轮移动
       if(targetT!=ulT) {
         time=600;//延迟500ms
       }
       if(timeOut_overing2) clearTimeout(timeOut_overing2);
       timeOut_overing2=setTimeout(()=>{
         
         //1000ms没有over视为停止over,移动到目标位置后将渐变去掉，问题：有可能1000ms后还没有到达目标位置，
        //导致一次性定时器没有将渐变去掉，所以1000ms要根据渐变的时间（这里1s)来设置，确保到时间后已经到达目标位置
        if(timeOut_overing) clearTimeout(timeOut_overing);
        timeOut_overing=setTimeout(()=>{
          // console.log('--------------->',floor.offsetParent,floor.offsetTop)
          ulT=parseFloat(getComputedStyle(floor).top);//为什么要重新获取？因为在wheelHandler中重新给ulT赋值了，ulT和targetT并不完全同步，但是targetT代表的是目标位置
          // console.log("##################",ulT,targetT,viewH)
          if(ulT-targetT<2&&ulT-targetT>-2){//移动到目标位置后
            // console.log("##################",ulT,targetT,index)
            // console.log('--------------->',ulT,targetT,floor.offsetTop)
            floor.style.cssText=`transition:none;top:${targetT}px`;
          }
        },1000)

         //获得上一轮的下标
         var currenteInde=index;
         //获得当前触发事件的下标
         index=[].indexOf.call(lis,e.target);
         //去掉上一轮的样式，给当前一轮添加样式
         lis[currenteInde].className="";
         lis[index].className="active";
         //计算目标位置
         targetT=ulT=-index*viewH;
        /*  if(prevTargetT!==undefined&&targetT!==prevTargetT){
           if(timeOut_isArrive) clearTimeout(timeOut_isArrive);
           timeOut_isArrive=setTimeout(()=>{
             floor.style.cssText=`transition:top 1s ease-in-out;top:${targetT}px`;
           },1000);
         }else{ */
           floor.style.cssText=`transition:top 1s ease-in-out;top:${targetT}px`;
        /*  }
         prevTargetT=targetT; */
         
         if(index==0)
           header.style.cssText="transition:background 1s;background:rgba(36, 36, 36, 0)";
         else
           header.style.cssText="transition:background 1s;background:rgb(36, 36, 36)";
       },time);
  
       
     }
 
     //事件处理函数
     function wheelHandler(event){
       //计算跨浏览器的deltaY
       var e=event || window.event;//标准或IE事件对象
      
      //鼠标over在li并且li不是active的时候不滚动，这样鼠标over在里上就不会一直滚动底部，可以去掉试试效果
       if(isOver&&e.target.className!='active') return;
 
        //鼠标停止滚动，取消渐变,这个放前面，否则被ruturn回去不执行
       if(timeOut_wheel) clearTimeout(timeOut_wheel);
       timeOut_wheel=setTimeout(function(){
         // console.log("&&&&&&&&&&&&&&--",ulT,targetT)
         // console.log('--------------->',floor.offsetParent,floor.offsetTop)
         // if(timeOut_wheel2) clearTimeout(timeOut_wheel2);
         ulT=parseFloat(getComputedStyle(floor).top);
         if(ulT==targetT){//移动到目标位置后
           // console.log("&&&&&&&&&&&&&&",ulT,targetT)
           floor.style.cssText=`transition:none;top:${targetT}px`;
         }
         // isWheel=false;
         if(isOver){
           mOverHandler.call(cLi,eV)
         }
       },1000)
 
       ulT=parseFloat(getComputedStyle(floor).top);//重新赋值，当前的ulT
       // var ulH=parseFloat(getComputedStyle(floor).height)*length;
       // console.log("-------------",index,targetT,ulT)
 
       //如果上一轮还没有滚动到目标位置，不执行这轮滚动
      //  var time=0;
       if(targetT!=ulT){
        //  time=700;
         return;
       };
       //不需要用定时器，没有意义
       // if(timeOut_wheel2) clearTimeout(timeOut_wheel2);
       // timeOut_wheel2=setTimeout(()=>{
         // isWheel=true;
         var deltaY=(e.deltaY!==null&&e.deltaY*-30)||//3级
                   (e.wheelDelta!==null&&e.wheelDelta/4)||//大部份浏览器
                   e.detail*-10||//FF
                   0;//未定义
         if(isMacWebkit){//如果是Mac,delta的值大120倍
           deltaY/=30;
         }
         //如果事件类型不是DOMMouseScroll就不再需要,因为如果FF未来版支持wheel或mousewheel会重复添加事件，需要去掉重复事件
         if(isFirefox && e.type!=="DOMMouseScroll")
           floor.removeEventListener("DOMMouseScroll",wheelHandler,false);
 
         
         if(deltaY>0){//向上滚动
           if(index==0)return;
           //滚动
           index--;
           lis[index+1].className="";
         }else{//向下滚动
           if(index==length-1) return;
           //滚动
           index++;
           lis[index-1].className="";
         }
         lis[index].className="active";
         if(index==0)
           header.style.cssText="transition:background 1s;background:rgba(36, 36, 36, 0)";
         else
           header.style.cssText="transition:background 1s;background:rgb(36, 36, 36)";
         targetT=ulT=-viewH*index;
         floor.style.cssText=`transition:top 1s ease-in-out;top:${ulT}px`;    
         
 
         //调用wheel事件上的preventDefault(),也能阻止mousewheel事件的产生
         if(e.preventDefault)e.preventDefault();
         if(e.stopPropagation)e.stopPropagation();
         e.cancelBubble=true;//IE事件  阻止冒泡
         e.returnValue=false;//IE事件
         return false;
       // },time);
     } 
     
     /* **********************************************3L轮播图 */
     var floor3_ul= document.getElementById("floor3_ul");
     var floor3_li= floor3_ul.querySelector("li");
     var prev=document.getElementById("prev");
     var next=document.getElementById("next");
     var li_mR=parseFloat(getComputedStyle(floor3_li).marginRight);
     var li_w=floor3_li.offsetWidth;
     var mW=li_mR+li_w;
     var move=0;
     var length=floor3_ul.childElementCount;
      // console.log(floor3_ul.children,getComputedStyle(floor3_li).marginRight);
     //4是显示出来的li的数量  
     // console.log(Math.ceil(parseFloat(getComputedStyle(floor3_ul.parentNode).width)/mW))
     if(length>4){
       next.style.display="block";
     }
     //不可以放这里，因为事件外面的代码只执行一次
    /*  if(move>0){
       prev.style.display="block";
     } */
     next.onclick=function(){
       //之所以取等于，是因为move++在这行判断的后面
       if(move>=length-4) return;
       move++;
       if(move>0) prev.style.display="block";
       if(move==length-4) next.style.display="none";
       var target=mW*move;
       floor3_ul.style.left=-target+"px";
     }
     prev.onclick=function(){
       if(move<0) return;
       move--;
       if(move==0) prev.style.display="none";
       if(move<length-4) next.style.display="block";
       var target=mW*move;
       floor3_ul.style.left=-target+"px";
     }
   })()