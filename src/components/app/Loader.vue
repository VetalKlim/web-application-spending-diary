<template>
<!-- компонент loader (загрузка) -->
  <div class="app-loader">
    <div class="preloader-wrapper active">
      <div class="spinner-layer" v-bind:class="color">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
 
  computed: {
    color() {
      const color = [ 
        "spinner-blue-only",
        "spinner-red-only",
        "spinner-green-only"
      ];
      return color[Math.floor(Math.random() * 3)];
     
    }
  }
};
</script>
