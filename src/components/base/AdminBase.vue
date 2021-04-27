<template>
  <v-app>
      <app-bar @drawer="getDrawer"></app-bar>
        <drawer :drawer="drawer"></drawer>
        <content-page></content-page>
  </v-app>
</template>


<script>
import AppBar from './AppBar.vue'
import Drawer from './Drawer.vue'
import ContentPage from './ContentPage.vue'

export default {
  data() {
    return {
      drawer: true,
    };
  },
    components: {
        Drawer,
        AppBar,
        ContentPage
    },
    methods: {
      getDrawer() {
        console.log('test');
      this.drawer = !this.drawer;
    },
    }
}
</script>

