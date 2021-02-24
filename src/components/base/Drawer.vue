<template>
  <v-navigation-drawer app width="260" dark>
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

      <v-list-group prepend-icon="mdi-account-circle" no-action>
        <template v-slot:activator >
          <v-list-item-content>
            <v-list-item-title>Manage Doctors</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item class="pl-6" link to="/admin/doctor/active">
          <v-list-item-icon>
            <v-icon v-text="'mdi-account-check'"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="'Active Doctor'"></v-list-item-title>
        </v-list-item>

           <v-list-item class="pl-6" link to="/admin/doctor/inactive">
          <v-list-item-icon>
            <v-icon v-text="'mdi-account-alert'"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="'Waiting Doctor'"></v-list-item-title>
        </v-list-item>
      </v-list-group>

      <!-- <v-list-item link to="/admin/doctor">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Doctor</v-list-item-title>
      </v-list-item> -->
      <v-list-item link to="/admin/patient">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Patient</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/admin/medicine">
        <v-list-item-icon>
          <v-icon>mdi-pill</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Medicine</v-list-item-title>
      </v-list-item>

            <v-list-item link to="/admin/symptom">
        <v-list-item-icon>
          <v-icon>mdi-account-search</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Symptom</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>