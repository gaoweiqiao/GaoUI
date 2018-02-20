<template>
  <div style="width: 100%;height: 2.6rem;">
    <gallery :images="imageList"
             :default-index="0"></gallery>
  </div>
</template>

<script type="text/ecmascript-6">
    import Gallery from "../components/Gallery.vue";
    export default {
        name: 'GalleryPage',
        data() {
            return {
              imageList:[
                'https://appios.tengqingyang.com/Uploads/ad/5a72b10ddd68f.jpg',
                'https://appios.tengqingyang.com/Uploads/ad/5a74031ab385f.jpg',
                'https://appios.tengqingyang.com/Uploads/ad/5a7ad2c63fb94.jpg',
                'https://appios.tengqingyang.com/Uploads/ad/5a7d5d6a5ccde.jpg',
                'https://appios.tengqingyang.com/Uploads/ad/5a59de4bbc564.png'
              ],
            };
        },
        components:{
          'gallery':Gallery,
        },
    };
</script>

<style scoped>

</style>
