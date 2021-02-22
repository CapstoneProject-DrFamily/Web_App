<template>
  <v-container fluid pt-8>
    <div class="text-center">
      <v-snackbar
        timeout="5000"
        v-model="snackbar"
        right
        top
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
    </div>

    <v-row no-gutters justify="center">
      <v-col cols="8">
        <v-text-field
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          filled
          dense
          color="blue"
          solo
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <div class="pt-1 pl-1">
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <doctor-form @created="addDoctor"></doctor-form>

    <v-simple-table class="elevation-1">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Image</th>
            <th class="text-left">Name</th>
            <th class="text-left">Speciality</th>
            <th class="text-left">Email</th>

            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="doctor in doctors" :key="doctor.doctorId">
            <td class="pt-6 pb-6">
              <v-img
                :src="doctor.profile.image"
                width="100"
                height="100"
              ></v-img>
            </td>
            <td>{{ doctor.profile.fullName }}</td>
            <td>{{ doctor.specialty.name }}</td>
            <td>{{ doctor.profile.email }}</td>

            <td>
              <edit-doctor-form :doctor="doctor"></edit-doctor-form>
            </td>
            <td>
              <div class="text-center">
                <v-dialog
                  width="500"
                  :retain-focus="false"
                  v-model="doctor.dltDialog.isShow"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn tile color="error" v-bind="attrs" v-on="on">
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline red lighten-1">
                      Confirm delete this doctor
                    </v-card-title>

                    <v-card-text>
                      <div class="pa-4">You cannot undo this action.</div>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="grey"
                        text
                        @click="doctor.dltDialog.isShow = false"
                      >
                        Cancel
                      </v-btn>

                      <v-btn
                        color="primary"
                        :loading="isDeleting"
                        :disabled="isDeleting"
                        text
                        @click.prevent="deleteDoctor(doctor.doctorId)"
                      >
                        I accept
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="text-center pt-6" v-if="loading">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>

    <v-row justify="center" v-if="!loading">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination v-model="page" class="my-4" :length="10"></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DoctorForm from "./CreateDoctorForm.vue";
import EditDoctorForm from "./EditDoctorForm.vue";
import axios from "axios";
import APIHelper from "../../../helpers/api";
// import CommonHelper from '../../../helpers/common';

export default {
  mounted() {
    this.fetchDoctor();
  },

  data() {
    return {
      type: "success",
      snackbar: false,
      message: ``,
      isDeleting: false,
      loading: false,
      page: 1,

      doctors: [],
    };
  },
  methods: {
    async fetchDoctor() {
      this.loading = true;
      this.doctors = [];
      // await new Promise((resolve) => setTimeout(resolve, 500));

      var response = await axios
        .get(APIHelper.getAPIDefault() + "/api/v1/Doctors")
        .catch(function (error) {
          console.log(error);
        });

      if (response.status == 200) {
        for (let i = 0; i < response.data.length; i++) {
          let name = "dialog" + response.data[i].doctorId;
          let dltDialog = { name: name, isShow: false };
          response.data[i].dltDialog = dltDialog;
          // let data = response.data[i];
          // console.log(data);
          this.doctors.push(response.data[i]);
        }
      }
      this.loading = false;
    },

    addDoctor(isSuccess) {
      if (isSuccess) {
        this.fetchDoctor();
        this.setSnackbar("Add Doctor Successful", "success");
      } else {
        this.setSnackbar("Add Doctor Failed", "error");
      }
    },
    async deleteDoctor(id) {
      this.isDeleting = true;
      console.log(id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.doctors.find((x) => x.doctorId === id).dltDialog.isShow = false;

      // this.doctors = CommonHelper.removeItem(this.doctors, item);
      // console.log(this.doctors.length);
      this.fetchDoctor();
      this.setSnackbar("Delete Successful", "success");
      this.isDeleting = false;
    },
    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
  },
  components: {
    DoctorForm,
    EditDoctorForm,
  },
};
</script>

<style scoped>
</style>