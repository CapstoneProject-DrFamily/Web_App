<template>
  <v-navigation-drawer app width="260" dark v-model="this.$store.state.drawerOn"  class="blue darken-1"
  
  >
    <!-- v-model="this.$store.state.drawerOn" -->
    <v-list dense nav color="blue darken-1">
      <v-list-item class="pt-3 pl-10">
        <v-list-item-content class="align-self-center" color="white" contain size="150">
          <v-img
            src="https://firebasestorage.googleapis.com/v0/b/capstoneproject-5c703.appspot.com/o/AdminStorage%2Fimages%2FlogoPatient.png?alt=media&token=36177678-9e40-4100-90ea-d501b80e1b44"
            max-height="150"
            max-width="150"
          />
        </v-list-item-content>

        <!-- <v-list-item-content class="pa"> 
          <v-list-item-title class="display" v-text="'Admin System'" />
        </v-list-item-content> -->
      </v-list-item>
    </v-list>

    <v-divider class="mb-1"  />

    <v-list nav dense class="id-drawer">
      <!-- <v-list-item link to="/admin/">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item> -->
      
      <v-list-group prepend-icon="mdi-account-circle" no-action color="white">
        <template v-slot:activator >
          <v-list-item-content>
            <v-list-item-title>Manage Doctor</v-list-item-title>
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

       <v-list-item link to="/admin/prescription">
        <v-list-item-icon>
          <v-icon>mdi-form-select</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Prescription Template</v-list-item-title>
      </v-list-item>

            <v-list-item link to="/admin/symptom">
        <v-list-item-icon>
          <v-icon>mdi-account-search</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Speciality</v-list-item-title>
      </v-list-item>

        <v-list-item link to="/admin/service">
        <v-list-item-icon>
          <v-icon>mdi-baby-bottle</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Manage Service</v-list-item-title>
      </v-list-item>

        <v-list-item link to="/admin/transaction">
        <v-list-item-icon>
          <v-icon>mdi-database</v-icon>
        </v-list-item-icon>
        <v-list-item-title>List Transaction</v-list-item-title>
      </v-list-item>

        <v-list-item link to="/admin/configuration">
        <v-list-item-icon>
          <v-icon>mdi-cog-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Configuration</v-list-item-title>
      </v-list-item>

        
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>