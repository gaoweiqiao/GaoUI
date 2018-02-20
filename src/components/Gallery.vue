<template>
  <div class="gallery-container">
    <div class="gallery-item" v-for="(item,index) in items"
         :style="getStyle(index)"
         :class="{'current': maxItemIndex === index}"
         @touchstart="touchStart(index,$event)"
         @touchmove="touchMove(index,$event)"
         @touchend="touchEnd(index,$event)">
    </div>
  </div>
</template>

<script>
    export default {
      name:'Gallery',
      props:{


        defaultIndex: {
          default:0
        },
        images:Array

      },
      data() {
        return {
          itemWidth: Number,
          itemHeight: Number,
          maxItemWidth: Number,
          maxItemHeight: Number,
          maxItemIndex:0,
          lastX:0,
          animating:false,
          items:[]
        }
      },
      computed:{
        firstItem: function () {
          return this.items[0];
        },
        lastItem:function () {
          return this.items[this.items.length-1];
        },
        width:function () {
          return this.$el.clientWidth;
        }
      },
      methods:{
        getStyle:function (index) {
          var item = this.items[index];
          var style = {
            transform:'translateX('+item.midline+'px)',
            '-webkit-transform': 'translateX('+item.midline+'px)',
            width: this.itemWidth * item.ratio+'px',
            height: this.itemHeight * item.ratio+'px',
            backgroundImage:'url('+item.image+')',
            backgroundSize:'cover',
            visibility: item.visible
          };
          if(index === this.maxItemIndex){
            style.ZIndex = this.items.length+1;
          }else{
            style.ZIndex = this.items.length - Math.abs(this.maxItemIndex - index);
          }
          return style;
        },
        stopScroll:function (event) {
          event.preventDefault();
        },
        touchStart: function (index,event) {
          if(!this.animating){
            document.body.addEventListener('touchstart', this.stopScroll, false);
            var touch = event.touches[0];
            this.lastX = touch.clientX;
          }
        },
        touchMove: function (index , event) {
          if(!this.animating){
            var touch = event.touches[0];
            var distance = touch.clientX - this.lastX;
            // 判断是否划到头了,如果划到头就不让再划了
            if(this.lastItem.midline + distance < 0){
              distance = 0 - this.lastItem.midline;
            }else if(this.firstItem.midline + distance > 0){
              distance = 0 - this.firstItem.midline;
            }
            this.items.forEach(function (item,i) {
              this.moveTo(i,item.midline + distance);
              //获取最大值的index
              if(Math.abs(this.items[this.maxItemIndex].midline) > item.midline){
                this.maxItemIndex = i;
              }
            }.bind(this));
            this.lastX = touch.clientX;
          }
        },
        touchEnd: function (index,event) {
          if(!this.animating){
            document.body.removeEventListener('touchstart', this.stopScroll, false);
            var maxItem = this.items[this.maxItemIndex];
            var stepDistance = maxItem.midline/10;
            function animation() {
              this.animating = true;
              if(Math.abs(maxItem.midline) < Math.abs(stepDistance)){
                stepDistance = maxItem.midline;
              }
              this.items.forEach(function (item,i) {
                this.moveTo(i,item.midline - stepDistance);
              }.bind(this));
              if(0 !== maxItem.midline){
                setTimeout(animation.bind(this),16);
              }else{
                this.animating = false
              }
            }
            setTimeout(animation.bind(this),16);
            var lastX = 0;
          }
        },
        moveTo:function (index,targetX) {
          //如果屏幕最多显示3个,超出部分的隐藏
          var midlineShow = (this.width - this.itemWidth);
          var item = this.items[index];
          if(targetX < -midlineShow || targetX > midlineShow){
            item.visible = 'hidden';
          }else{
            item.visible = 'visible';
          }
          item.midline = targetX;
          //计算变化大小
          item.ratio = this.getRatio(targetX);

//                console.log(item.ratio);
          //
        },
        getRatio:function (targetX) {
          var totalRatioDistance = (this.width - this.itemWidth)/2;
          var deltaRatio = ((totalRatioDistance - Math.abs(targetX)) / totalRatioDistance)* (this.maxItemWidth - this.itemWidth) / this.itemWidth;
          if (deltaRatio < 0){
            deltaRatio = 0;
          }
          return deltaRatio + 1;
        }
      },
      mounted:function () {
        this.maxItemWidth = this.$el.clientWidth/2;
        this.maxItemHeight = this.$el.clientHeight;
        this.itemWidth = this.maxItemWidth / 2;
        this.itemHeight = this.maxItemHeight / 2;
        var list = [];
        this.images.forEach(function (item,i) {
          list.push({
            image:item,
            midline: 0,
            ratio: 1,
            visible: 'visible'
          });
        });
        this.$set(this,"items",list);
        this.items.forEach(function (item,i) {
          var distance = (i-this.defaultIndex) * (this.width - this.itemWidth)/2;
          this.moveTo(i,item.midline + distance);
          //获取最大值的index
          if(Math.abs(this.items[this.maxItemIndex].midline) > item.midline){
            this.maxItemIndex = i;
          }
        }.bind(this));

      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .gallery-container{
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }
  .gallery-item{
    display: block;
    width: 300px;
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    will-change: transform;
  }
</style>
