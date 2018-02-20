<template>
  <div style="width: 100%;position: relative;left: 0;top: 0;">
    <div class="img-container"

         style="">
      <img :src="src" class="img-bg"/>
      <div class="img-modal">
        <div id="confirm"></div>
      </div>
      <div class="preview"
           @touchstart="onTouchStart($event)"
           @touchmove="onTouchMove($event)"
           @touchend="onTouchEnd($event)"
           :style="previewStyle"
           ><img :src="src" class="img-preview" :style="imgPreviewStyle"></div>
    </div>
    <!--<canvas class="middle"></canvas>-->
  </div>
</template>

<script type="text/ecmascript-6">
    class Rect{
      x;
      y;
      width;
      height;
      constructor(x=0,y=0,width=100,height=100){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
      get right(){
        return this.x + this.width;
      }
      get bottom(){
        return this.y + this.height;
      }
    }
    /**
     * 事件stop,返回一个{l,t,r,b,width,height}对象
     * */
    export default {
        name: 'Crop',
        props:{
          src:String
        },
        data() {
            return {
                innerRect: new Rect(0,0,300,300),
                //单指拖动时的坐标
                lastX:0,
                lastY:0,
                //缩放时两指间的初始距离
                lastDistance:0,
                //指示是否在触摸状态
                touching:false,
                //背景图片的y轴滚动距离
                imgPreviewScrollTop:0,
                containerWidth:0,
                containerHeight:0,
            };
        },
        computed:{
          previewStyle(){
            return {
              left: this.innerRect.x+'px',
              top: this.innerRect.y + 'px',
              width: this.innerRect.width + 'px',
              height: this.innerRect.height + 'px'
            };
          },
          imgPreviewStyle(){
            return {
              width:this.containerWidth+'px',
//              height: this.containerHeight+'px',
              marginLeft: -this.innerRect.x+'px',
              marginTop: (-this.imgPreviewScrollTop-this.innerRect.y)+'px',
            };
          }
        },
        watch:{
          src(newVal){
            this.init(newVal);
          }
        },
        methods:{
          init(url){
            let imgElem = this.$el.querySelector('.img-bg');
            imgElem.src = url;

            imgElem.onload = (e)=>{
              this.containerWidth = imgElem.clientWidth;
              this.containerHeight = imgElem.clientHeight;
            };

          },
          stopScroll(e) {
            e.preventDefault();
          },
          calculateXY(deltaX,deltaY) {
            const innerRect = this.innerRect;
            const imgContainer = this.$el;
            innerRect.x += deltaX;
            innerRect.y += deltaY;
            //不允许超出边界
            if(innerRect.right > imgContainer.clientWidth){
              innerRect.x = imgContainer.clientWidth - innerRect.width;
            }else if(innerRect.x < 0){
              innerRect.x = 0;
            }
            if(innerRect.bottom > imgContainer.clientHeight){
              innerRect.y = imgContainer.clientHeight - innerRect.height;
            }else if(innerRect.y < 0){
              innerRect.y = 0;
            }
          },
          calculateScale(ratio) {
            const innerRect = this.innerRect;
            const imgContainer = this.$el;
            var width = ratio*innerRect.width;
            if(width > imgContainer.clientWidth || width > imgContainer.clientHeight){
              width = imgContainer.clientWidth < imgContainer.clientHeight ? imgContainer.clientWidth : imgContainer.clientHeight;

            }else if(width < 100){
              width = 100;
            }
            innerRect.width = width;
            innerRect.height = innerRect.width;
            this.calculateXY(0,0);
          },
          onTouchStart(e){
              const innerRect = this.innerRect;
              const stopScroll = this.stopScroll;
              var touch = e.changedTouches[0];
              var touchX = touch.clientX;
              var touchY = touch.clientY;
              document.getElementsByTagName("body")[0].addEventListener('touchstart', stopScroll, false);
              if(e.targetTouches.length == 1){
                this.lastX = touchX;
                this.lastY = touchY;
                //                    touching = true;
                console.log(`start ===> lastX is ${this.lastX} && lastY is ${this.lastY}`);
              }else if(e.targetTouches.length === 2){
                var touch1 = e.targetTouches[0];
                var touch2 = e.targetTouches[1];
                this.lastDistance = Math.sqrt(Math.pow(touch1.clientX - touch2.clientX,2)+Math.pow(touch1.clientY - touch2.clientY,2));
                let logText = "log : "+"touch1 :("+touch1.clientX+","+touch1.clientY+") and touch2 :("+touch2.clientX+","+touch2.clientY+");" ;
                console.log(logText);
              }
              this.touching = true;
          },
          onTouchMove(e){
            const innerRect = this.innerRect;
            if(this.touching) {
              if (e.targetTouches.length == 1) {
                var touch = e.changedTouches[0];
                var touchX = touch.clientX;
                var touchY = touch.clientY;
                console.log(`move ===> deltaX is ${touchX - this.lastX} && deltaY is ${touchY - this.lastY}`);
                this.calculateXY(touchX - this.lastX, touchY - this.lastY);
                this.lastX = touch.clientX;
                this.lastY = touch.clientY;

              } else if (e.targetTouches.length === 2) {
                var touch1 = e.targetTouches[0];
                var touch2 = e.targetTouches[1];
                var distance = Math.sqrt(Math.pow(touch1.clientX - touch2.clientX, 2) + Math.pow(touch1.clientY - touch2.clientY, 2));

                var ratio = distance / this.lastDistance;
                calculateScale(ratio);

                this.lastDistance = distance;
                const logText = "log2 : " + "touch1 :(" + touch1.clientX + "," + touch1.clientY + ") and touch2 :(" + touch2.clientX + "," + touch2.clientY + "); width is " + innerRect.width;
                console.log(logText)
              }
            }
          },
          onTouchEnd(e){
            const stopScroll = this.stopScroll;
            this.touching = false;
            this.$emit("stop",{
              l:this.innerRect.x,
              t:this.innerRect.y,
              r:this.innerRect.right,
              b:this.innerRect.bottom,
              width:this.containerWidth,
              height:this.containerHeight,
            });
            document.getElementsByTagName("body")[0].removeEventListener('touchstart', stopScroll, false);
          }
        },
        mounted(){


        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .preview{
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    box-sizing: border-box;
    overflow: hidden;
    /*border:2px solid #ff004e;*/
    border:1px solid #ffffff;
    box-sizing: border-box;
  }
  .img-container{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .img-modal{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.75);
    position: absolute;
    top: 0;
    left: 0;
  }
  .img-bg{
    width: 100%;
    display: block;
  }
</style>
