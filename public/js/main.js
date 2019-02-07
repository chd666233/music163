

"use strict";
(function(){
  /* **************************轮播图 */
  var carousel = document.getElementById("carousel"); 
  var carouselInner = document.getElementById("carousel-inner"); 
  var as=carouselInner.getElementsByTagName("a");
  var imgs=carouselInner.getElementsByTagName("img");
  var indicator=document.getElementById("indicator");
  var lis=indicator.getElementsByTagName("li");
  var length=indicator.childElementCount;
  var index=0;
  var timeOut_as=null;
  var timeOut_click=null;
  var prev =document.getElementById("prev");
  var next =document.getElementById("next");
  var isLoad=false;
  // var bgs=[];

  /* for(var img of imgs){
    bgs.push(img.getAttribute("data-bg"));
  }
  console.log(bgs) */
  as[0].className="carousel-item zIndex";
  imgs[0].src=imgs[index].getAttribute("data-src");
  // imgs[0].className="";//图片加载出来前就去掉loading样式，有点早了，但是不这样图片一加载出来是50px*50px的
  imgs[0].onload=function(){
    imgs[0].className="";//图片加载出来后去掉loading
    as[0].className="carousel-item active";//图片加载出来后a渐变显示出来
    if(timeOut_as) clearInterval(timeOut_as);
    timeOut_as=setInterval(fn_carousel,3999);
    isLoad=true;
  }
  
  
  /* *********************轮播图自动滚动 */

  function fn_carousel(){
    //取消图片加载直到图片加载出来后才加载下一张图片，如果不这样，那么1000毫秒后再次加载图片，再1000毫秒后再次
    //加载下一张图片，以此类推，问题：图片加载完毕并不是按顺序来的，可能下一张加载完了上一张还没加载出来
    //在slow 3g下能看出轮播图的显示有点小问题，解决：取消timeOut_as然后在Onload中恢复
    if(timeOut_as) clearInterval(timeOut_as);
    //去掉上一轮的样式
    as[index].className="carousel-item";
    lis[index].className="";
    
    index++;
    index%=8;

    isLoad=false;
    // as[index].className="carousel-item activing";
    // carousel.className="carousel activing";
    // if(/load/.test(imgs[index].src)){
      //加载图片
      imgs[index].src=imgs[index].getAttribute("data-src");
      
      as[index].className="carousel-item zIndex";//图片加载出来前，图片容器先出现在顶层
      lis[index].className="active";//图片加载出来前，指示器先指向当前位置
      imgs[index].onload=function(){
      // setTimeout(()=>{
        
        timeOut_as=setInterval(fn_carousel,3999);
        imgs[index].className="";//图片加载出来后去掉loading样式
        as[index].className="carousel-item active";//图片加载出来后a渐变显示出来
        //更换背景
        carousel.className="carousel active";//图片加载出来后背景渐变显示出来
        carousel.style.backgroundImage=`url(${imgs[index].getAttribute("data-bg")})`;

        isLoad=true;
         // carousel.style.backgroundImage=`url(${bgs[index]})`;
        // carousel.style.cssText=`background:url(${imgs[index].getAttribute("bg-src")}) repeat-x;transition:background 1s ease-out;`;
      // },500)
      }
    // }else{
    //   as[index].className="carousel-item active";
    //   carousel.className="carousel active";
    //   carousel.style.backgroundImage=`url(${imgs[index].getAttribute("bg-src")}`;
    //   lis[index].className="active";
    // }
  }
/* ******************点击滚动 */
  next.onclick=function(){
    fn_cli(+1)
  }
  prev.onclick=function(){
    fn_cli(-1);
  }
/* ********************点击指示器 */
  indicator.onclick=function(event){
    var e= event || window.event;//标准或IE事件对象
    if(e.target.nodeName!=='LI') return;
    var target_i=[].indexOf.call(lis,e.target);
    fn_cli(target_i-index);
  }

  function fn_cli(i){
    //取消timeOut_as
    if(timeOut_as) clearInterval(timeOut_as);
    //如果图片没有加载出来，不能点击，这种方式不管是点击前进后退还是点指示器都有效
    if(!isLoad)return;
    // 放在前面而不是最后面，防止事件被return回去后timeOut_as被取消后没有再次被激活
    //比如：点击到最后一张图片了，还不断的点击这时候执行了clearInterval但是没有回复，导致
    //图片不再自动轮播。解决：把恢复放到return前面。
    //问题：1000毫秒后图片不一定加载出来了。解决：前面加一个isLoad.
    //问题：结束点击后1000毫秒timeOut_as会恢复，然后继续点击timeOut_as被第一行取消，同时图片还没加载出来
    //被第二行return,于是timeOut_as没有恢复。解决：在onload添加一个恢复
    if(timeOut_click) clearTimeout(timeOut_click);
    timeOut_click=setTimeout(()=>{
      timeOut_as=setInterval(fn_carousel,3999);
    },1000);
    //i>0表示加 ，i<0表示减， 下面两个判断表示不能再加了，不能再减了
    if(i>0&&index>=length-1)return;
    if(i<0&&index<=0) return;

    isLoad=false;
    //把这个取消样式放在index+=i的前面，很好的避免了使用as[index-1]带来的问题，因为上一个不一定是index-1，
    //这里上一个是index-i
    as[index].className="carousel-item";
    lis[index].className="";
    carousel.className="carousel";

    index+=i;
    
    imgs[index].src=imgs[index].getAttribute("data-src");
    as[index].className="carousel-item zIndex";//图片加载出来之前容器放在顶层
    lis[index].className="active";//图片加载出来前，指示器先指向当前位置
    imgs[index].onload=function(){
      as[index].className="carousel-item click";
      imgs[index].className="";//图片加载成功去掉loading样式
      // carousel.className="carousel click";
      carousel.style.backgroundImage=`url(${imgs[index].getAttribute("data-bg")})`;
      
      if(timeOut_click) clearTimeout(timeOut_click);
      timeOut_click=setTimeout(()=>{
        timeOut_as=setInterval(fn_carousel,3999);
      },1000);
      isLoad=true;
    }
  }

  /* *****************************新碟上架  轮播图 */
  var carousel_ul_1=document.getElementById("carousel_ul_1");
  var carousel_ul_2=document.getElementById("carousel_ul_2");
  var f2W=carousel_ul_1.offsetWidth;
  var f2_prev=document.getElementById("f2_prev");
  var f2_next=document.getElementById("f2_next");
  var prevTime=0;
  
  console.log()
  f2_prev.onclick=function(){
    fn_f2_cli(-1)
  }
  f2_next.onclick=function(){
    fn_f2_cli(+1)
  }
 
  function fn_f2_cli(i){
    
    if(new Date().getTime()-prevTime<=500)return;
    // console.log("0-------------")
    var c1L=parseInt(getComputedStyle(carousel_ul_1).left);
    var c2L=parseInt(getComputedStyle(carousel_ul_2).left);
   
    //调整位置，把left不等于0的放到前面或后面
    if(c1L!=0){
      carousel_ul_1.style.cssText=`left:${i*f2W}px;transition:none`;
    }else{
      carousel_ul_2.style.cssText=`left:${i*f2W}px;transition:none`;
    }

    //问题：由于过渡需要时间，所以上面位置调整的时候还没到达指定位置，下面就马上调整到目标位置，导致位置不正确
    //解决：去掉调整位置的过渡，这样调整位置就能马上到达目标位置。同时限制两次点击的时间间隔，双保险。
    // setTimeout(()=>{//一开始没有取消调整位置的过渡，需要使用定时器延迟让位置调整完毕再执行，这种方式不好，有延迟
      c1L=parseInt(getComputedStyle(carousel_ul_1).left);
      c2L=parseInt(getComputedStyle(carousel_ul_2).left);
      carousel_ul_1.style.cssText=`left:${c1L-i*f2W}px;transition:.5s`;
      carousel_ul_2.style.cssText= `left:${c2L-i*f2W}px;transition:.5s`;
    // },500)
    prevTime=new Date().getTime();

    
  }


  



 })()