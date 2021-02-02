<template>
  <v-navigation-drawer app width="260" dark >
      <!-- v-model="this.$store.state.drawerOn" -->
    <v-list dense nav>
      <v-list-item class="pt-4">
        <v-list-item-avatar class="align-self-center" color="white" contain>
          <v-img
            src="https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico"
            max-height="30"
          />
        </v-list-item-avatar>

        <v-list-item-content class="pa">
          <v-list-item-title class="display" v-text="'Page'" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-1" />

    <v-list nav dense class="id-drawer"> 
            <v-list-item link to="/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/admin/doctor">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Doctor</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/admin/user">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage User</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/admin/medicine">
        <v-list-item-icon>
          <v-icon>mdi-pill</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Medicine</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>