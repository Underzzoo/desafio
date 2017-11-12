<template lang="html">
  <b-navbar toggleable="md" type="dark" variant="primary">
    <b-navbar-brand href="#"><i class="mdi mdi-truck-delivery" style="font-size: 1.2em"></i> {{ title }}</b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <!-- <b-form-input class="mr-sm-2" type="text" placeholder="Pesquisar CEP"/>
        <b-button class="my-2 my-sm-0" type="submit">Buscar</b-button> -->
        <!-- <b-button variant="success" class="my-2 my-sm-0">Calcular Frete</b-button> -->
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'layout-navbar',
  data: () => {
    return {
      title: 'Melhor Transportadora - Calc. Fretes'
    }
  }

}
</script>

<style lang="css">
</style>
