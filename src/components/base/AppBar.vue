<template>
  <v-app-bar absolute app height="75" color="grey lighten-4" flat>
    <v-btn class="mr-3" elevation="1" fab small>
      <v-icon> mdi-dots-vertical </v-icon>
    </v-btn>
    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="'Dashboard'"
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
