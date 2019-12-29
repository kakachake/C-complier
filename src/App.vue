<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-19 08:39:53
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-22 10:43:16
 -->
<template>
  <div id="app">
    <cHead></cHead>
    <cTab></cTab>
  </div>
</template>

<script>
import cHead from './components/cHead'
import cTab from './components/cTab'
export default {
  name: 'App',
  components:{
    cHead,
    cTab
  },
  computed: {
      key() {
          return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
      }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
