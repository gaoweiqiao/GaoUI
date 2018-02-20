<template>
  <div>
    <div>
      <label for="crop-file">点击选择图片</label>
      <input name="file" id="crop-file" type="file" style="display: none;" @change="onChange">
    </div>
    <div>
      <crop :src="image" @stop="onStop"></crop>
    </div>
    <div style="font-size:0.3rem;">下面是截取出来的结果</div>
    <img :src="result">
  </div>
</template>

<script>
    import Crop from "../components/Crop.vue";
    export default {
        name: 'CropPage',
        data() {
            return {
                image: '',
                result:'',
            };
        },
        methods:{
          onStop(rect){
            console.log(JSON.stringify(rect));
            let image = new Image();
            image.src = this.image;
            image.onload = function(){
              let canvas = document.createElement('canvas');
              let rectWidth = rect.r - rect.l;
              let rectHeight = rect.b - rect.t;
              canvas.width = rectWidth;
              canvas.height = rectHeight;
              let context = canvas.getContext('2d');
              let ratio = image.width / rect.width;
              context.drawImage(image,rect.l * ratio,rect.t * ratio,rectWidth * ratio,rectHeight * ratio,0,0,rectWidth,rectHeight);
              this.result = canvas.toDataURL("image/jpeg");
            }.bind(this);
          },
          onChange(event){
            let file = event.target.files[0];
            var reader=new FileReader();
            reader.onload=function(e){
              // 通过 reader.result 来访问生成的 DataURL
              var url=e.target.result;
              this.image = url;
            }.bind(this);

            reader.readAsDataURL(file);
          }
        },
      components:{
        'crop':Crop
      },
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
