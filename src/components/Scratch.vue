<template>
  <div style="width: 100%;height: 100%;position: relative;overflow: hidden;">
    <slot>谢谢惠顾</slot>
    <canvas style="position: absolute;top: 0;left: 0;background: transparent;"
            @touchstart.prevent="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend.prevent="onTouchEnd"></canvas>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'Scratch',
        data() {
            return {

            };
        },
        props:{

        },
        methods:{
            getPaint(){
              let canvas = this.$el.lastElementChild;
              return canvas.getContext('2d');
            },
            fillLayer(){
              let ctx = this.getPaint();
              ctx.fillStyle= '#d3d3d3';
              ctx.fillRect(0,0,canvas.width,canvas.height);
            },
            erase(x,y){

              let ctx = this.getPaint();
              ctx.globalCompositeOperation = 'destination-out';
//              ctx.fillStyle="#ffff00";
              console.log(`(${x},${y})`);
              ctx.moveTo(x,y);
              ctx.arc(x, y, 100, 0, Math.PI * 2, true);
              ctx.fill();

            },
            computeXY(touch){
              var touchX = touch.clientX;
              var touchY = touch.clientY;
              let rect = this.$el.getBoundingClientRect();
              return [touchX - rect.x,touchY - rect.y];
            },
            onTouchStart(event){
              let touch = event.changedTouches[0];
              this.erase(...this.computeXY(touch));
//              this.erase(10,10);
            },
            onTouchMove(event){
              let touch = event.changedTouches[0];
              this.erase(...this.computeXY(touch));
            },
            onTouchEnd(event){
              let percent = this.computeTransparentPercent();
              if(percent > 0.85){
                this.$el.lastElementChild.style.display='none';
              }
            },
            computeTransparentPercent(){
              let canvas = this.$el.lastElementChild;
              const ctx = this.getPaint();
              let imgData = ctx.getImageData(0, 0,canvas.width, canvas.height),
                pixles = imgData.data,
                transPixs = [];
              for (var i = 0, j = pixles.length; i < j; i += 4) {
                var a = pixles[i + 3];
                if (a < 128) {
                  transPixs.push(i);
                }
              }
              return transPixs.length / (pixles.length / 4);
            }
        },
        mounted(){
          //
          let canvas = this.$el.lastElementChild;
          canvas.width = this.$el.clientWidth;
          canvas.height = this.$el.clientHeight;
          let ctx = canvas.getContext('2d');
          ctx.fillStyle= '#d3d3d3';
          ctx.fillRect(0,0,canvas.width,canvas.height);
        }
    };
</script>

<style scoped>

</style>
