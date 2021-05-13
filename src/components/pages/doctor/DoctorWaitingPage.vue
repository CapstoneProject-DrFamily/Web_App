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

        <v-dialog v-model="dialogReason" width="500">
          <v-form @submit.prevent ref="form" v-model="valid">
            <v-card>
              <v-card-title class="headline red">
                The reason for denying this doctor
              </v-card-title>

              <v-card-text>
                <v-textarea
                  class="pt-10"
                  v-model="reasonDeny"
                  solo
                  name="input-7-4"
                  label="Enter your reason here"
                  :rules="[(v) => !!v || 'Please enter your reason']"
                ></v-textarea>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!loadingDenying"
                  color="error"
                  text
                  @click="denyDoctor()"
                >
                  Deny this doctor
                </v-btn>
                <v-progress-circular
                  v-if="loadingDenying"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

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
            <th class="text-left"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="doctor in doctors" :key="doctor.id">
            <td class="pt-6 pb-6">
              <v-img
                :src="doctor.doctor.image"
                width="100"
                height="100"
              ></v-img>
            </td>

            <td>{{ doctor.doctor.fullname }}</td>
            <td>{{ doctor.doctor.specialty.name }}</td>
            <td>{{ doctor.doctor.email }}</td>

            <td>
              <waiting-doctor-info
                :doctor="doctor"
                @approved="approveFromDetail"
                @denied="deniedFromDetail"
              ></waiting-doctor-info>
            </td>
            <td>
              <v-btn
                tile
                color="error"
                class="rounded-pill"
                @click="confirmDeny(doctor)"
              >
                <v-icon> mdi-cancel </v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                tile
                color="success"
                class="rounded-pill"
                @click="confirmApprove(doctor)"
              >
                <v-icon> mdi-check </v-icon>
              </v-btn>
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

    <!-- <v-row justify="center" v-if="!loading">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination v-model="page" class="my-4" :length="10"></v-pagination>
        </v-container>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import WaitingDoctorInfo from "./WaitingDoctorInfo.vue";
import axios from "axios";
import APIHelper from "../../../helpers/api";
// import CommonHelper from '../../../helpers/common';

export default {
  mounted() {
    this.fetchDoctor();
  },

  data() {
    return {
      valid: false,
      loadingDenying: false,
      doctorDeny: null,
      reasonDeny: null,
      dialogReason: false,
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
    async denyDoctor() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.loadingDenying = true;
      await this.approveDoctor(this.doctorDeny, false);
      this.loadingDenying = false;
      this.dialogReason = false;
    },

    deniedFromDetail(isSuccess) {
      if (isSuccess) {
        this.setSnackbar("Action successful", "success");
        this.fetchDoctor();
      } else {
        this.setSnackbar("Action failed", "error");
      }
    },

    approveFromDetail(isApproved) {
      if (isApproved) {
        this.setSnackbar("Action successful", "success");
      } else {
        this.setSnackbar("Action failed", "error");
      }
      this.fetchDoctor();
    },

    confirmDeny(doctor) {
      this.$confirm("Do you want to deny this doctor ?").then((res) => {
        if (res) {
          console.log(doctor);
          this.dialogReason = true;
          this.doctorDeny = doctor;
          // this.approveDoctor(doctor, false);
        } else {
          return;
        }
      });
    },

    confirmApprove(doctor) {
      this.$confirm("Do you want to approve this doctor ?").then((res) => {
        if (res) {
          this.approveDoctor(doctor, true);
        } else {
          return;
        }
      });
    },

    async approveDoctor(doctor, isApprove) {
      let userModel = {
        disabled: isApprove == true ? false : true,
        insBy: doctor.insBy,
        insDatetime: doctor.insDatetime,
        updBy: doctor.updBy,
        updDatetime: doctor.updDatetime,
        accountId: doctor.id,
        username: doctor.username,
        password: doctor.password,
        roleId: doctor.roleId,
        waiting: false,
        notiToken: doctor.notiToken,
      };

      let data = {
        userModel: userModel,
        isAcceptDoctor: true,
        reason: this.reasonDeny,
      };
      console.log(data);

      var response = await axios
        .put(APIHelper.getAPIDefault() + "Users", data)
        .catch(function (error) {
          console.log(error);
        });
      if (response.status == 200) {
        this.setSnackbar("Action successful", "success");
      } else {
        this.setSnackbar("Action failed", "error");
      }

      this.fetchDoctor();
    },
    async fetchDoctor() {
      this.loading = true;
      this.doctors = [];
      // await new Promise((resolve) => setTimeout(resolve, 500));

      var response = await axios
        .get(APIHelper.getAPIDefault() + "Doctors/waitingList")
        .catch(function (error) {
          console.log(error);
        });

      if (response == undefined) {
        this.loading = false;
        return;
      }

      if (response.status == 200) {
        for (let i = 0; i < response.data.length; i++) {
          let name = "dialog" + response.data[i].id;
          let dltDialog = { name: name, isShow: false };
          response.data[i].dltDialog = dltDialog;
          response.data[i].birthday = response.data[
            i
          ].doctor.birthday.substring(0, 10);
          // let data = response.data[i];
          // console.log(data);
          this.doctors.push(response.data[i]);
        }
      }
      console.log(this.doctors);
      this.loading = false;
    },

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
  },
  components: {
    WaitingDoctorInfo,
  },
  watch: {
    dialogReason: function () {
      if (!this.dialogReason) {
        this.doctorDeny = null;
        this.reasonDeny = null;
      }
    },
  },
};
</script>

<style scoped>
.theme--light.v-card {
  color: #f5f5f5;
}
</style>