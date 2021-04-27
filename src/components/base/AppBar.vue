<template>
  <v-app-bar absolute app height="75" color="blue lighten-5" flat>
    <v-btn class="mr-3" elevation="1" fab small @click="getDrawer">
      <v-icon> mdi-dots-vertical </v-icon>
    </v-btn>
    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="getName(this.$route.fullPath)"
    />
    <v-spacer />

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-2" min-width="0" text to="/" v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <span>Profile</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-2" min-width="0" text to="/" v-bind="attrs" v-on="on">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <span>Log out</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      text: null,
    };
  },

  methods: {
    getName(name) {
        let data = name.split("/");
        console.log(data);
        let display = data[data.length - 1];
        display =  display.charAt(0).toUpperCase() + display.slice(1);
        return display;
    },
    getDrawer() {
      this.$store.state.drawerOn = !this.$store.state.drawerOn;
      console.log(this.$store.state.drawerOn);
      // this.$emit("drawer");
    },
  },
 
};
</script>
