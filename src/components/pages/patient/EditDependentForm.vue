<template>
  <div>
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

    <v-dialog width="450" v-model="show" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          close
          @click:close="deleteConfirm()"
          v-bind="attrs"
          v-on="on"
          color="primary"
          class="ml-1 mr-1 mb-1"
          >{{ dependent.dependentName }}</v-chip
        >
      </template>
      <v-img
        src="https://static.vecteezy.com/system/resources/previews/000/656/917/non_2x/vector-set-of-doctor-cartoon-characters-medical-staff-team-concept-in-front-of-hospital.jpg"
        height="200px"
      ></v-img>
      <v-card>
        <v-row>
          <v-col>
            <p class="text-center customHeader font-weight-bold pt-6 pb-6">
              Update Dependent
            </p>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row justify="center" v-if="imageData == null">
            <v-img
              v-if="temporaryData.dependentData.profile.image != null"
              contain
              max-height="80%"
              max-width="80%"
              :src="temporaryData.dependentData.profile.image"
            ></v-img>
            <v-img
              v-if="temporaryData.dependentData.profile.image == null"
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
                class="pt-4"
                solo
                v-model="temporaryData.dependentData.profile.fullName"
                prepend-icon="mdi-account"
                label="Full Name*"
                required
                :rules="[
                  (v) =>
                    (v.length < 50 && v.length > 3) ||
                    'Dependent fullname must between 3 - 50 character',
                ]"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.dependentRelationShip"
                prepend-icon="mdi-account"
                label="Full Name*"
                required
                :rules="[
                  (v) =>
                    (v.length < 50 && v.length > 3) ||
                    'Dependent relationship must between 3 - 50 character',
                ]"
              ></v-text-field>

              <v-radio-group
                @change="onChange = true"
                v-model="temporaryData.dependentData.profile.gender"
                row
                prepend-icon="mdi-gender-male-female"
              >
                <v-radio value="Male" label="Male"> </v-radio>
                <v-radio value="Female" label="Female"> </v-radio>
              </v-radio-group>

              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="
                  temporaryData.dependentData.profile.birthday
                "
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    @change="onChange = true"
                    class="pt-4"
                    solo
                    v-model="temporaryData.dependentData.profile.birthday"
                    label="Birthday*"
                    prepend-icon="mdi-calendar"
                    hint="MM/DD/YYYY format"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="temporaryData.dependentData.profile.birthday"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.dialog.save(
                        temporaryData.dependentData.profile.birthday
                      )
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.dependentData.profile.phone"
                label="Phone*"
                prepend-icon="mdi-phone"
                required
                disabled
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.dependentData.profile.email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.dependentData.profile.idCard"
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
                v-model="temporaryData.dependentData.height"
                label="Height"
                prepend-icon="mdi-human-male-height-variant"
                type="number"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.dependentData.weight"
                label="Weight"
                prepend-icon="mdi-weight-kilogram"
                type="number"
              ></v-text-field>

              <v-select
                class="pt-4"
                @change="onChange = true"
                prepend-icon="mdi-water"
                :items="bloodType"
                v-model="temporaryData.dependentData.bloodType"
                label="Blood Type"
                solo
              ></v-select>

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
                  v-on:click="updateDependent()"
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

export default {
  created() {
    this.temporaryData = JSON.parse(JSON.stringify(this.dependent));
  },
  props: ["dependent"],
  data() {
    return {
      message: "",
      type: "success",
      snackbar: false,
      valid: false,
      temporaryData: [],
      onChange: false,
      modal: false,
      imageData: null,
      imagePreview: defaultImage,
      show: false,
      loading: false,
      bloodType: ["A", "B", "AB", "O"],
    };
  },
  components: {},
  methods: {
    deleteConfirm() {
      this.$confirm(
        "Do you really want to delete " +
          this.temporaryData.dependentName +
          " ? You cannot undo this action"
      ).then((res) => {
        if (res) {
          this.deleteDependent();
        }
      });
    },

    async deleteDependent() {
      var success = false;
      this.isDeleting = true;

      var response = await axios
        .delete(
          APIHelper.getAPIDefault() + "Patients/" + this.temporaryData.patientID
        )
        .catch(function (error) {
          console.log(error);
        });
      if (response != undefined) {
        if (response.status == 204) {
          success = true;
        }
      }
      this.show = false;
      this.$emit("deleted", success);

      this.isDeleting = false;
    },

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },

    Reset() {
      this.onChange = false;
      this.temporaryData = JSON.parse(JSON.stringify(this.dependent));
    },

    Cancel() {
      if (this.onChange) {
        this.$confirm(
          "Do you really want to exit? Your change will all lost."
        ).then((res) => {
          if (res) {
            this.temporaryData = JSON.parse(JSON.stringify(this.dependent));
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

    async updateDependent() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      var isUpdated = false;

      this.loading = true;
      if (this.imageData != null) {
        var imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
        this.temporaryData.dependentData.profile.image = imgURL;
      }

      let profileDetail = {
        profileId: this.temporaryData.dependentData.profileId,
        fullname: this.temporaryData.dependentData.profile.fullName,
        birthday: this.temporaryData.dependentData.profile.birthday,
        gender: this.temporaryData.dependentData.profile.gender,
        phone: this.temporaryData.dependentData.profile.phone,
        image: this.temporaryData.dependentData.profile.image,
        email: this.temporaryData.dependentData.profile.email,
        idCard: this.temporaryData.dependentData.profile.idCard,
      };
      console.log(profileDetail);

      let profilePatient = {
        patientId: this.temporaryData.dependentData.patientId,
        height:
          this.temporaryData.dependentData.height == null ||
          this.temporaryData.dependentData.height == ""
            ? 0
            : this.temporaryData.dependentData.height,
        weight:
          this.temporaryData.dependentData.weight == null ||
          this.temporaryData.dependentData.weight == ""
            ? 0
            : this.temporaryData.dependentData.weight,
        bloodType: this.temporaryData.dependentData.bloodType,
        profileId: this.temporaryData.dependentData.profileId,
        relationship: this.temporaryData.dependentRelationShip,
        accountId: this.temporaryData.dependentData.accountId,
        recordId: this.temporaryData.dependentData.recordId,
      };

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