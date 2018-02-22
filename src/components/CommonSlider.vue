<template>
  <div style="position: relative;width: 100%;height: 100%;top: 0;left: 0;">
    <div class="item" :style="itemStyle(0)" style="transform: translateX(-100%);" ></div>
    <div class="item" :style="itemStyle(1)"
         @touchstart.prevent="touchStart($event)"
         @touchmove.prevent="touchMove($event)"
         @touchend.prevent="touchEnd($event)"></div>
    <div class="item" :style="itemStyle(2)" style="transform: translateX(100%);" ></div>
  </div>
</template>

<script>
  /**
   * 参数:
   *     images:图片路径数组,
   *     index:当前图片位置
   *     autoRun:是否自动连播
   *     interval:自动播放的间隔:单位毫秒
   *     loop:是否循环
   *     updateDate:更新事件,用来触发index更新,因此每次传入不同的值,建议用时间戳
   * 事件:
   *     slider-tap:点击slider的事件,携带当前的index,
   *     slider-update:当slider滚动停止时的事件,携带当前的index
   * */
  export default {
      name:'CommonSlider',
      data() {
        return {
          startTime:0,
          startX:0,
          lastX:0,
          translateX:0,
          itemHeight:0,
          scrolling:false,
          timeoutId:0,
          pos:0
        }
      },
      props:{
        images:{
          type: Array,
          required: true,
          default:[]
        },
        index:{
          type: Number,
          default:0
        },
        autoRun:{
          type: Boolean,
          default:false
        },
        interval:{
          type: Number,
          default:2000
        },
        loop:{
          type: Boolean,
          default:false
        },
        updateDate:{
          type:Number,
          default:0
        },
        bgSize:{
          type:String,
          default:"contain"
        }
      },
      computed:{
        imageList:function () {
          var list = ["","",""];
          list[1] = this.images[this.pos];
          if(this.images.length === this.pos+1){
            list[2] = this.images[0];
          }else{
            list[2] = this.images[this.pos+1]
          }
          if(this.pos - 1 < 0){
            list[0] = this.images[this.images.length - 1];
          }else{
            list[0] = this.images[this.pos - 1];
          }
          return list;
        },
        itemWidth:function () {
          return this.$el.getBoundingClientRect().width;
        }
      },
      watch:{
        autoRun:function (val) {
          if(val){
            this.startRun();
          }else{
            clearTimeout(this.timeoutId);
          }
        },
        index:function (val) {
          this.pos = val;
        },
        updateDate:function (val) {
          this.pos = this.index;
        }
      },
      methods:{
        itemStyle:function (index) {
          var pos = index % this.images.length;
          return {
            backgroundPosition:"center",
            backgroundSize:this.bgSize,
            backgroundRepeat:"no-repeat",
            width:"100%",
            height:"100%",
            position:"absolute",
            left:"0",
            top:"0",

            backgroundImage:'url('+this.imageList[pos]+')'
          }
        },
        touchStart:function (event) {
          if(this.interval > 0){
            clearTimeout(this.timeoutId);
          }
          if(!this.scrolling){

            var touch = event.changedTouches[0];
            this.startTime = event.timeStamp;
            this.startX = touch.clientX;
            this.lastX = this.startX;
          }
        },
        touchMove:function (event) {
          if(!this.scrolling){
            var touch = event.changedTouches[0];
            var x = touch.clientX;
            //非循环不能右侧到达尽头不能在滑动
            if(!this.loop){
              if(0 == this.pos && x > this.lastX){
                return;
              }
              if(this.images.length - 1 == this.pos && x < this.lastX){
                return;
              }
            }

            this.moveBy(this.lastX-x);
            this.lastX = x;
          }
        },
        touchEnd:function (event) {
          var touch = event.changedTouches[0];
          var endTime = event.timeStamp;
          var endX = touch.clientX;
          if(!this.scrolling){
            if(endTime - this.startTime <300 && Math.abs(endX - this.startX )< 30){
              this.$emit("slider-tap",this.pos);
            }
            //
            if(endX < 0){
              endX = 0;
            }else if(endX > this.itemWidth){
              endX = this.itemWidth
            }
            var xdistance = endX - this.startX;
            if(endTime - this.startTime < 360){
              if(Math.abs(endX - this.startX) > 0){
                //快速滑动
                if(this.translateX < 0){
                  //向右滚动
                  this.animateTo(-this.itemWidth,function () {
                    this.increaseIndex(true);
                    if(this.autoRun){
                      this.startRun();
                    }
                  }.bind(this));
                }else if(this.translateX > 0){
                  //向左滚动
                  this.animateTo(this.itemWidth,function () {
                    this.increaseIndex(false);
                    if(this.autoRun){
                      this.startRun();
                    }
                  }.bind(this));
                }
                this.log = endX+" - "+this.startX+" = "+xdistance+" and translateX is "+this.translateX;
              }else{
                if(this.autoRun){
                  this.startRun();
                }
              }
            }else{
              //慢速滑动
              if(this.translateX < - this.itemWidth / 2){
                //向左滚动,翻篇
                this.animateTo(-this.itemWidth,function () {
                  this.increaseIndex(true);
                  if(this.autoRun){
                    this.startRun();
                  }
                }.bind(this));
              }else if(this.translateX < 0){
                //向右滚动,复位
                this.animateTo(0,function () {
                  if(this.autoRun){
                    this.startRun();
                  }
                }.bind(this));
              }else if(this.translateX > 0 && this.translateX <= this.itemWidth / 2){
                //向左滚动
                this.animateTo(0,function () {
                  if(this.autoRun){
                    this.startRun();
                  }
                }.bind(this));

              }else if(this.translateX > this.itemWidth / 2){
                this.animateTo(this.itemWidth,function () {
                  this.increaseIndex(false);
                  if(this.autoRun){
                    this.startRun();
                  }
                }.bind(this));

              }
            }
          }
        },
        moveBy:function (xdelta) {
          var items = this.$el.getElementsByClassName("item");
          this.translateX -= xdelta;
          items[0].style.transform = "translateX("+(-this.itemWidth+this.translateX)+"px)";
          items[1].style.transform = "translateX("+this.translateX+"px)";
          items[2].style.transform = "translateX("+(this.itemWidth+this.translateX)+"px)";
        },
        moveTo:function (destX) {
          var items = this.$el.getElementsByClassName("item");
          this.translateX = destX;
          items[0].style.transform = "translateX("+(-this.itemWidth+this.translateX)+"px)";
          items[1].style.transform = "translateX("+this.translateX+"px)";
          items[2].style.transform = "translateX("+(this.itemWidth+this.translateX)+"px)";
        },
        animateTo:function (destX,callback) {
          this.scrolling = true;
          var step = function () {
            if(destX != this.translateX){
              var stepDistance = Math.min(this.itemWidth / 12,Math.abs(destX - this.translateX));
              if(this.translateX < destX){
                this.moveTo(this.translateX + stepDistance);
              }else if(this.translateX > destX){
                this.moveTo(this.translateX - stepDistance);
              }
              if(destX !== this.translateX ){
                setTimeout(step,16);
              }else{
                this.scrolling = false;
                if(undefined !== callback){
                  callback();
                }
              }
            }
          }.bind(this);
          setTimeout(step,16);
        },
        increaseIndex:function (increase) {
          if(increase){
            this.pos ++;
            if(this.images.length - 1 < this.pos){
              this.pos = 0;
            }
          }else{
            this.pos --;
            if(this.pos < 0){
              this.pos = this.images.length - 1;
            }
          }
          this.moveTo(0);
          this.$emit("slider-update",this.pos);
        },

        stopScroll:function (event) {
          // event.preventDefault();
          //=======
          // 判断默认行为是否可以被禁用
          if (event.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!event.defaultPrevented) {
              event.preventDefault();
            }
          }
        },
        startRun:function () {
          if(this.interval > 0){
            var step = function () {
              if(!this.loop && this.images.length - 1 == this.pos){
                return;
              }
              this.animateTo(-this.itemWidth,function () {
                this.increaseIndex(true);
                this.timeoutId = setTimeout(step,this.interval);
              }.bind(this));
            }.bind(this);
            this.timeoutId = setTimeout(step,this.interval);
          }
        }
      },
      mounted:function () {
        // this.pos = this.datas.index;
        // this.images.splice(0,0,this.datas.images);
        if(this.autoRun){
          this.startRun();
        }
      }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
