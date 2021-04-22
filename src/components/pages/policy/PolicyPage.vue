<template>
  <div>
    <v-container>
      <v-snackbar
        timeout="5000"
        v-model="snackbar"
        top
        right
        :color="type"
        outlined
        :auto-height="true"
      >
        {{ message }}

        <template v-slot:action="{ attrs }">
          <v-btn :color="type" text v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <vue-editor v-model="content"></vue-editor>
      <v-row class="pa-6" justify="center">
        <v-btn depressed color="primary" @click="SavePolicy">
          Save Policy
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import axios from "axios";
export default {
  mounted() {
    this.fetchAppConfig();
  },
  data() {
    return {
      doctorConfig: null,
      patientConfig: null,
      content: "",
      message: "",
      type: "success",
      snackbar: false,
    };
  },
  methods: {
    async fetchAppConfig() {
      this.$isLoading(true);
      var patientApp = await axios
        .get("https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/" + 1)
        .catch(function (error) {
          console.log(error);
        });
      if (patientApp.status == 200) {
        this.patientConfig = patientApp.data;
      }

      var doctorApp = await axios
        .get("https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/" + 2)
        .catch(function (error) {
          console.log(error);
        });

      if (doctorApp.status == 200) {
        this.doctorConfig = doctorApp.data;
        this.content = this.doctorConfig.policy;
      }

      this.$isLoading(false);
    },

    async SavePolicy() {
      let isSave = false;
      this.$isLoading(true);
      console.log(this.content);
      this.doctorConfig.policy = this.content;
      this.patientConfig.policy = this.content;

      var patientApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/PatientApp",
          this.patientConfig
        )
        .catch(function (error) {
          console.log(error);
        });

      var doctorApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/DoctorApp",
          this.doctorConfig
        )
        .catch(function (error) {
          console.log(error);
        });
      if (doctorApp.status == 200 && patientApp.status == 200) {
        isSave = true;
      }

      this.$isLoading(false);

      if (isSave) {
        this.setSnackbar("Save success", "success");
      } else {
        this.setSnackbar("Failed. Please try again", "error");
      }
    },
        setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
  },
  components: {
    VueEditor,
  },
};
</script>
