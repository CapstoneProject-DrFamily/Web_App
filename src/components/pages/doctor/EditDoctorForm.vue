<template>
  <div class="text-center pt-6">
    <v-dialog width="500" v-model="show">
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
        <row>
          <p class="text-center customHeader font-weight-bold pt-6 pb-6">
            Update Doctor
          </p>
        </row>
        <v-card-text>
          <v-row justify="center">
            <v-img
              contain
              max-height="80%"
              max-width="80%"
              :src="imagePreview"
            ></v-img>
          </v-row>
          <v-file-input
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
            <v-form @submit.prevent>
              <div class="font-weight-bold customHeader">Account Detail</div>
              <v-text-field
                class="pt-6"
                solo
                v-model="doctor.profile.fullName"
                readonly
                label="Username (Your phone number)*"
                prepend-icon="mdi-account-box"
                required
              ></v-text-field>

              <v-text-field
                class="pt-4"
                solo
                v-model="doctor.profile.fullName"
                prepend-icon="mdi-account"
                label="Full Name*"
                required
              ></v-text-field>
              <v-radio-group
                v-model="doctor.profile.gender"
                row
                prepend-icon="mdi-gender-male-female"
              >
                <v-radio value="Male" label="Male"> </v-radio>
                <v-radio value="Female" label="Female"> </v-radio>
              </v-radio-group>

              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="pt-4"
                    solo
                    v-model="doctor.profile.birthday"
                    label="Birthday*"
                    prepend-icon="mdi-calendar"
                    hint="MM/DD/YYYY format"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.dialog.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-text-field
                class="pt-4"
                solo
                v-model="doctor.profile.phone"
                label="Phone*"
                prepend-icon="mdi-phone"
                required
              ></v-text-field>
              <v-text-field
                class="pt-4"
                solo
                v-model="doctor.profile.email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                class="pt-4"
                solo
                v-model="doctor.profile.idCard"
                label="ID Card"
                prepend-icon="mdi-card-account-details"
                type="number"
              ></v-text-field>
              <div class="font-weight-bold customHeader pt-5">
                Additional details
              </div>

              <v-text-field
                class="pt-6"
                solo
                v-model="doctor.degree"
                label="Degree*"
                prepend-icon="mdi-license"
                required
              ></v-text-field>
              <v-text-field
                class="pt-4"
                solo
                v-model="doctor.experience"
                label="Experience*"
                prepend-icon="mdi-trophy-award"
                required
              ></v-text-field>

              <v-select
                prepend-icon="mdi-needle"
                :items="specialities"
                item-text="name"
                item-value="specialtyId"
                v-model="doctor.specialty.specialtyId"
                label="Speciality*"
                solo
              ></v-select>
              <v-text-field
                class="pt-4"
                solo
                label="School*"
                prepend-icon="mdi-school"
                required
                v-model="doctor.school"
              ></v-text-field>
              <v-textarea
                class="pt-4"
                v-model="doctor.description"
                label="Description*"
                solo
                prepend-icon="mdi-account-details"
                required
              ></v-textarea>

              <v-row justify="center">
                <v-btn
                  color="error"
                  class="mr-4"
                  v-on:click="resetForm()"
                  v-if="!loading"
                >
                  Reset
                </v-btn>

                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="success"
                  class="mr-4"
                  type="submit"
                  v-on:click="updateDoctor()"
                >
                  Saved
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
  mounted() {
    this.fetchSpecialities();
    console.log(this.doctor);
  },
  props: ["doctor"],
  data() {
    return {

      date: new Date().toISOString().substr(0, 10),


      specialities: [],
      modal: false,
      imageData: null,
      imagePreview: defaultImage,
      show: false,
      loading: false,
    };
  },
  methods: {
    async fetchSpecialities() {
      var response = await axios
        .get(APIHelper.getAPIDefault() + "/api/v1/Specialty")
        .catch(function (error) {
          console.log(error);
        });
      if (response.status == 200) {
        for (let i = 0; i < response.data.length; i++) {
          // console.log(response.data[i]);
          this.specialities.push(response.data[i]);
        }
      }
    
      
    },

    async updateDoctor() {
            // console.log(this.doctor.specialty.name);
      this.loading = true;
      if (this.imageData != null) {
        var imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
        this.resetForm();
        this.show = false;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.show = false;
      this.$emit("created", true);
      this.loading = false;
    },
    resetForm() {
      this.imageData = null;
      this.imagePreview = defaultImage;
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