<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
import EmptyLayout from '@/layouts/EmptyLayout'// импортируем страницу в компонент 
import MainLayout from '@/layouts/MainLayout'// импортируем страницу в компонент  
export default {
    computed:{
    layout(){ // создаем функцию в которой лежат пути к страницам 
      return (this.$route.meta.layout || 'empty') + '-layout'
    }
  },
  components:{ 
    EmptyLayout, MainLayout
  }
}
</script>


<style lang="scss">
@import '~materialize-css/dist/css/materialize.min.css'; 
@import 'assets/index.css';
// @media all and (max-width: 850px) {
//   // body {
//   //   overflow: hidden;
//   // }

//   #app {
//     overflow: auto;
//     height: 1000px;
  
//   }
// }

</style>
