<template lang="html">
  <div>
    <p-navbar />

    <b-container id="calculator" class="bv-example-row">
      <p-calculator />
    </b-container>
  </div>
</template>

<script>
import PNavbar from './layout/Navbar.vue'
import PCalculator from './layout/Calculator.vue'
export default {
  name: 'main-component',
  components: {
    PNavbar,
    PCalculator
  }
}
</script>

<style lang="css">
</style>
