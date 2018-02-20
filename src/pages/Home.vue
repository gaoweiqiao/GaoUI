<template>
  <div>
    <div>
      <router-link :to="{name:'CropPage'}">crop demo</router-link>
    </div>
    <div>
      <router-link :to="{name:'GalleryPage'}">gallery demo</router-link>
    </div>
    <div>
      <router-link :to="{name:'ScratchPage'}">scratch demo</router-link>
    </div>
    <div>
      <router-link :to="{name:'SliderPage'}">slider demo</router-link>
    </div>
  </div>
</template>

<script>


    export default {
        name: 'Home',
        data() {
          return {};
        },
        methods:{

        },

        mounted(){
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
