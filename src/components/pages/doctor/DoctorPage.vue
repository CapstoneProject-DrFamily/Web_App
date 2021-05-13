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
          v-model="searchBoxValue"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <div class="pt-1 pl-1">
          <v-btn icon @click="searchDoctor">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- <doctor-form @created="addDoctor"></doctor-form> -->

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
          <tr v-for="doctor in doctors" :key="doctor.id">
            <td class="pt-6 pb-6">
              <v-img
                :src="doctor.image"
                width="100"
                height="100"
              ></v-img>
            </td>
            <td>{{ doctor.fullname }}</td>
            <td>{{ doctor.specialty.name }}</td>
            <td>{{ doctor.email }}</td>

            <td>
              <edit-doctor-form
                :doctor="doctor"
                @updated="updateDoctor"
              ></edit-doctor-form>
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
                        @click.prevent="deleteDoctor(doctor)"
                      >
                        I accept
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </td>
          </tr>
          <td class="text-center" colspan="10">
            <div class="pa-10" v-if="doctors.length == 0 && !loading">
              No data found
            </div>

            <div class="text-center pt-6 pb-6" v-if="loading">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </td>
        </tbody>
      </template>
    </v-simple-table>

 

    <v-row justify="center" v-if="!loading">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination
            v-model="page"
            class="my-4"
            :length="totalPage"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import DoctorForm from "./CreateDoctorForm.vue";
import EditDoctorForm from "./EditDoctorForm.vue";
import axios from "axios";
import APIHelper from "../../../helpers/api";
// import CommonHelper from '../../../helpers/common';

export default {
  mounted() {
    this.fetchDoctor(this.page, this.pageSize, this.searchValue);
  },

  data() {
    return {
      type: "success",
      snackbar: false,
      message: ``,
      isDeleting: false,
      loading: false,

      doctors: [],
      page: 1,
      pageSize: 10,
      totalPage: null,
      searchBoxValue: null,
      searchValue: null,
    };
  },
  methods: {
      searchDoctor() {
      this.searchValue = this.searchBoxValue;
      if (this.page != 1) {
        this.page = 1;
      } else {
        this.fetchDoctor(this.page, this.pageSize, this.searchValue);
      }
    },
    async fetchDoctor(page, pageSize, value) {
      this.loading = true;
      this.doctors = [];
      // await new Promise((resolve) => setTimeout(resolve, 500));
      var url =
        value == null
          ? APIHelper.getAPIDefault() +
            "Doctors/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize
          : APIHelper.getAPIDefault() +
            "Doctors/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize +
            "&SearchValue=" +
            value;

      var response = await axios.get(url).catch(function (error) {
        console.log(error);
      });

      if (response.status == 200) {
        this.totalPage = response.data.totalPages;
        console.log(response.data.doctors);
        for (let i = 0; i < response.data.doctors.length; i++) {
          if (!response.data.doctors[i].idNavigation.waiting) {
            let name = "dialog" + response.data.doctors[i].id;
            let dltDialog = { name: name, isShow: false };
            response.data.doctors[i].dltDialog = dltDialog;
            response.data.doctors[i].birthday = response.data.doctors[
              i
            ].birthday.substring(0, 10);
            this.doctors.push(response.data.doctors[i]);
          }
        }
        console.log(this.doctors.length);
      }

      this.loading = false;
    },
    updateDoctor(isUpdated) {
      if (isUpdated) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchDoctor(this.page, this.pageSize, null);
        }
        this.setSnackbar("Update Doctor Successful", "success");
      } else {
        this.setSnackbar("Update Doctor Failed", "error");
      }
    },
    addDoctor(isSuccess) {
      if (isSuccess) {
         if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchDoctor(this.page, this.pageSize, null);
        }
        this.setSnackbar("Add Doctor Successful", "success");
      } else {
        this.setSnackbar("Add Doctor Failed", "error");
      }
    },
    async deleteDoctor(doctor) {
      var success = false;
      this.isDeleting = true;

      // console.log(id);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      var response = await axios
        .delete(APIHelper.getAPIDefault() + "Doctors/" + doctor.id)
        .catch(function (error) {
          console.log(error);
        });
      console.log(response.status);
      if (response.status == 204) {
        success = true;
      }

      //   var response1 = await axios
      //   .delete(APIHelper.getAPIDefault() + "Users/" + doctor.id)
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      //    if (response1.status == 204) {
      //   success = true;
      // }



      this.doctors.find((x) => x.id === doctor.id).dltDialog.isShow = false;
      if (success) {
         if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchDoctor(this.page, this.pageSize, null);
        }
        this.setSnackbar("Delete Successful", "success");
      } else {
        this.setSnackbar("Delete failed", "error");
      }

      this.isDeleting = false;
    },
    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
  },
  components: {
    // DoctorForm,
    EditDoctorForm,
  },
    watch: {
    page: function () {
      this.fetchDoctor(this.page, this.pageSize, this.searchValue);
    },
  },
};
</script>

<style scoped>
</style>