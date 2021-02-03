<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height class="c-app">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>

              <v-row justify="center">
                <v-col md="8" sm="8" class="pt-10">
                  <v-alert :value="alert" type="error"
                    >Login Failed</v-alert
                  ></v-col
                >
              </v-row>

              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="username"
                    prepend-icon="mdi-account"
                    name="login"
                    label="Login"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-on:click.prevent="login()"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { router } from "../../helpers/router";
import axios from "axios";
import APIHelper from "../../helpers/api";

export default {
  data() {
    return {
      username: "",
      password: "",
      alert: false,
    };
  },
  methods: {
    async login() {
      var failed = false;
      this.$isLoading(true);

      const loginData = {
        username: this.username,
        password: this.password,
      };

      await axios
        .post(APIHelper.getAPIDefault() + "api/v1/Auth", loginData)
        .then(function (response) {
          console.log(response.status);
          if (response.status == 200) {
            if (response.data.role == "Admin") {
              localStorage.setItem("token", response.data.token);
              router.push("admin");
            }
          }
        })
        .catch(function (error) {
          failed = true;
          console.log(error);
        });
      if (failed) {
        this.alert = true;
      }
      this.$isLoading(false);
    },
  },
};
</script>

<style scoped>
.c-app {
  background: url("~@/assets/background.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover;
}

.profile-img {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
/* 
@import 'https://unpkg.com/@coreui/coreui/dist/css/coreui.min.css'; */
</style>