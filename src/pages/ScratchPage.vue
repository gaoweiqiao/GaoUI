<template>
  <div style="width: 100%;height: 1.5rem;">
    <scratch>
      <div>This is scratch</div>
    </scratch>
  </div>
</template>

<script type="text/ecmascript-6">
    import Scratch from "../components/Scratch.vue";
    export default {
        name: 'ScratchPage',
        data() {
            return {};
        },
        components:{
          'scratch':Scratch
        },
    };
</script>

<style scoped>

</style>
