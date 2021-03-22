<template>
  <div class="text-center pt-6">
    <div class="text-center">
      <v-snackbar
        timeout="5000"
        v-model="snackbar"
        centered
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

    <v-dialog width="500" v-model="show" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn tile color="success" v-bind="attrs" v-on="on">
              <v-icon>mdi-pencil </v-icon>
            </v-btn>
          </div>
        </v-row>
      </template>
      <v-img
        src="https://static.vecteezy.com/system/resources/previews/000/656/917/non_2x/vector-set-of-doctor-cartoon-characters-medical-staff-team-concept-in-front-of-hospital.jpg"
        height="200px"
      ></v-img>
      <v-card>
        <v-row>
          <v-col>
            <p class="text-center customHeader font-weight-bold pt-6 pb-6">
              Update Patient
            </p>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row justify="center" v-if="imageData == null">
            <v-img
              v-if="temporaryData.patientNavigation.image != null"
              contain
              max-height="80%"
              max-width="80%"
              :src="temporaryData.patientNavigation.image"
            ></v-img>
            <v-img
              v-if="temporaryData.patientNavigation.image == null"
              contain
              max-height="80%"
              max-width="80%"
              src="https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg"
            ></v-img>
          </v-row>
          <v-row justify="center" v-if="imageData != null">
            <v-img
              contain
              max-height="80%"
              max-width="80%"
              :src="imagePreview"
            ></v-img>
          </v-row>
          <v-file-input
            @change="onChange = true"
            class="pt-10"
            v-model="imageData"
            label="Select your image"
            solo
            outlined
            dense
            accept="image/png, image/jpeg, image/bmp, image/jpg"
          ></v-file-input>
        </v-card-text>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent ref="form" v-model="valid">
              <div class="font-weight-bold customHeader">Account Detail</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.patientNavigation.account.username"
                readonly
                label="Username (Your phone number)*"
                prepend-icon="mdi-account-box"
                required
                disabled
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.patientNavigation.fullName"
                prepend-icon="mdi-account"
                label="Full Name*"
                required
                :rules="[
                  (v) =>
                    (v.length < 50 && v.length > 3) ||
                    'Your fullname must between 3 - 50 character',
                ]"
              ></v-text-field>
              <v-radio-group
                @change="onChange = true"
                v-model="temporaryData.patientNavigation.gender"
                row
                prepend-icon="mdi-gender-male-female"
              >
                <v-radio value="Male" label="Male"> </v-radio>
                <v-radio value="Female" label="Female"> </v-radio>
              </v-radio-group>

              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="temporaryData.patientNavigation.birthday"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    @change="onChange = true"
                    class="pt-4"
                    solo
                    v-model="temporaryData.patientNavigation.birthday"
                    label="Birthday*"
                    prepend-icon="mdi-calendar"
                    hint="MM/DD/YYYY format"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="temporaryData.patientNavigation.birthday"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(temporaryData.patientNavigation.birthday)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.patientNavigation.phone"
                label="Phone*"
                prepend-icon="mdi-phone"
                required
                disabled
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.patientNavigation.email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.patientNavigation.idCard"
                label="ID Card"
                prepend-icon="mdi-card-account-details"
                type="number"
              ></v-text-field>
              <div class="font-weight-bold customHeader pt-5">
                Additional details
              </div>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.height"
                label="Height"
                prepend-icon="mdi-human-male-height-variant"
                type="number"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.weight"
                label="Weight"
                prepend-icon="mdi-weight-kilogram"
                type="number"
              ></v-text-field>

              <v-select
                class="pt-4"
                @change="onChange = true"
                prepend-icon="mdi-water"
                :items="bloodType"
                v-model="temporaryData.bloodType"
                label="Blood Type"
                solo
              ></v-select>

              <div class="font-weight-bold customHeader pt-5 pb-5">
                Dependents
              </div>

              <v-row class="pb-5">
                <v-col cols="1">
                  <v-icon>mdi-account-multiple</v-icon>
                </v-col>
                <v-col v-if="dependents.length == 0">No dependent</v-col>
                <v-col v-if="dependents.length != 0">
                  <edit-dependent-form
                    v-for="dependent in dependents"
                    :key="dependent.patientId"
                    :dependent="dependent"
                    @updated="updateDependent"
                    @deleted="deleteDependent"
                  ></edit-dependent-form>
                </v-col>
              </v-row>

              <v-row justify="center" class="pt-3">
                <v-btn
                  color="info"
                  class="mr-4"
                  v-on:click="Reset()"
                  v-if="!loading"
                >
                  Reset
                </v-btn>

                <v-btn
                  color="error"
                  class="mr-4"
                  v-on:click="Cancel()"
                  v-if="!loading"
                >
                  Cancel
                </v-btn>

                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="success"
                  class="mr-4"
                  type="submit"
                  v-on:click="updatePatient()"
                >
                  Save
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import defaultImage from "../../../assets/placeholder-img.jpg";
import CommonHelper from "../../../helpers/common";
import axios from "axios";
import APIHelper from "../../../helpers/api";
import EditDependentForm from "./EditDependentForm";

export default {
  created() {
    this.temporaryData = JSON.parse(JSON.stringify(this.patient));
  },
  props: ["patient"],
  data() {
    return {
      message: "",
      type: "success",
      snackbar: false,
      valid: false,
      temporaryData: [],
      dependents: [],
      onChange: false,
      modal: false,
      imageData: null,
      imagePreview: defaultImage,
      show: false,
      loading: false,
      bloodType: ["A", "B", "AB", "O"],
    };
  },
  components: {
    EditDependentForm,
  },
  methods: {
    updateDependent(isUpdated) {
      if (isUpdated) {
        this.setSnackbar("Update Successful", "success");
      } else {
        this.setSnackbar("Update Failed", "error");
      }
      this.fetchDependent();
    },
      deleteDependent(success) {
      if (success) {
        this.setSnackbar("Delete Successful", "success");
      } else {
        this.setSnackbar("Delete Failed", "error");
      }
      this.fetchDependent();
    },

    async deletePatient(id) {
      var success = false;
      this.isDeleting = true;

      var response = await axios
        .delete(APIHelper.getAPIDefault() + "Patients/" + id)
        .catch(function (error) {
          console.log(error);
        });
      if (response != undefined) {
        if (response.status == 204) {
          success = true;
        }
        this.dependents.find(
          (x) => x.patientID === id
        ).dltDialog.isShow = false;
      }
      this.setSnackbar("Delete Successful", "success");

      if (success) {
        this.setSnackbar("Delete Successful", "success");
      } else {
        this.setSnackbar("Delete failed", "error");
      }

      this.fetchDependent();

      this.isDeleting = false;
    },

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },

    async fetchDependent() {
      this.dependents = [];
      let id = this.temporaryData.patientNavigation.account.accountId;
      let response = await axios
        .get(APIHelper.getAPIDefault() + "Patients/" + id + "/Dependents")
        .catch(function (error) {
          console.log(error);
        });
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].dependentRelationShip.toLowerCase() != "owner") {
          let name = "dialog" + response.data[i].patientID;
          let dltDialog = { name: name, isShow: false };
          response.data[i].dltDialog = dltDialog;

          let dependent = await axios
            .get(
              APIHelper.getAPIDefault() +
                "Patients/" +
                response.data[i].patientID
            )
            .catch(function (error) {
              console.log(error);
            });

          dependent.data.patientNavigation.birthday = dependent.data.patientNavigation.birthday.substring(
            0,
            10
          );
          response.data[i].dependentData = dependent.data;
          console.log(response.data[i]);

          this.dependents.push(response.data[i]);
        }
      }
    },

    Reset() {
      this.onChange = false;
      this.temporaryData = JSON.parse(JSON.stringify(this.patient));
    },

    Cancel() {
      this.$emit("cancel");
      if (this.onChange) {
        this.$confirm(
          "Do you really want to exit? Your change will all lost."
        ).then((res) => {
          if (res) {
            this.temporaryData = JSON.parse(JSON.stringify(this.patient));
            this.show = false;
          }
        });
      } else {
        this.show = false;
      }
    },
    changeSaved() {
      console.log(this.onChange);
    },

    async updatePatient() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      var isUpdated = false;

      this.loading = true;
      if (this.imageData != null) {
        var imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
        this.temporaryData.patientNavigation.image = imgURL;
      }

      let profileDetail = {
        profileId: this.temporaryData.patientNavigation.profileId,
        fullname: this.temporaryData.patientNavigation.fullName,
        birthday: this.temporaryData.patientNavigation.birthday,
        gender: this.temporaryData.patientNavigation.gender,
        phone: this.temporaryData.patientNavigation.phone,
        image: this.temporaryData.patientNavigation.image,
        email: this.temporaryData.patientNavigation.email,
        idCard: this.temporaryData.patientNavigation.idCard,
      };
      console.log(profileDetail);

      let profilePatient = {
        patientId: this.temporaryData.patientId,
        height:
          this.temporaryData.height == null || this.temporaryData.height == ""
            ? 0
            : this.temporaryData.height,
        weight:
          this.temporaryData.weight == null || this.temporaryData.weight == ""
            ? 0
            : this.temporaryData.weight,
        bloodType: this.temporaryData.bloodType,
        profileId: this.temporaryData.profileId,
        relationship: this.temporaryData.relationship,
        accountId: this.temporaryData.accountId,
        recordId: this.temporaryData.recordId,
      };

      console.log(profilePatient);
      var response = await axios
        .put(APIHelper.getAPIDefault() + "Patients", profilePatient)
        .catch(function (error) {
          console.log(error);
        });

      response = await axios
        .put(APIHelper.getAPIDefault() + "Profiles", profileDetail)
        .catch(function (error) {
          console.log(error);
        });

      if (response.status == 200) {
        isUpdated = true;
      }

      this.Reset();
      this.show = false;
      this.$emit("updated", isUpdated);
      this.loading = false;

      // await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
  watch: {
    show: function () {
      if (this.show) {
        this.fetchDependent();
      } else {
        this.dependents = [];
      }
    },
    imageData: function () {
      // preview image before upload
      if (this.imageData != null) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(this.imageData);
      } else {
        this.imageData = null;
        this.imagePreview = defaultImage;
      }
    },
  },
};
</script>

<style scoped>
.customHeader {
  font-size: 20px;
}
</style>