<template>
  <div style="width: 100%;height: 3.6rem;">
    <common-slider :images="imageList"
                   :index="0"
                   :autoRun="true"
                   :interval="5000"
                   :loop="true"></common-slider>
  </div>
</template>

<script type="text/ecmascript-6">
    import CommonSlider from '../components/CommonSlider.vue';
    export default {
        name: 'SliderPage',
        data() {
          return {
            imageList:[
              'https://appios.tengqingyang.com/Uploads/ad/5a72b10ddd68f.jpg',
              'https://appios.tengqingyang.com/Uploads/ad/5a74031ab385f.jpg',
              'https://appios.tengqingyang.com/Uploads/ad/5a7ad2c63fb94.jpg',
              'https://appios.tengqingyang.com/Uploads/ad/5a7d5d6a5ccde.jpg',
              'https://appios.tengqingyang.com/Uploads/ad/5a59de4bbc564.png'
            ],
            itemWidth:0,
            itemHeight:0,
            maxItemWidth:0,
            maxItemHeight:0
          };
        },
        components:{
          'common-slider':CommonSlider,
        },
    };
</script>

<style scoped>

</style>
