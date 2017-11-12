<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  body {
    background-image: url('https://source.unsplash.com/Pj6TgpS_Vt4/1600x900');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
  #calculator {
    padding: 3em 0;
  }
</style>
