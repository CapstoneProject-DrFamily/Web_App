<template>
  <v-app>
      <app-bar></app-bar>
        <drawer></drawer>
        <content-page></content-page>
  </v-app>
</template>


<script>
import AppBar from './AppBar.vue'
import Drawer from './Drawer.vue'
import ContentPage from './ContentPage.vue'

export default {
    components: {
        Drawer,
        AppBar,
        ContentPage
    }
}
</script>

