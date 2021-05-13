<template>
  <div class="text-center pt-6">
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
              Update Doctor
            </p>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row justify="center" v-if="imageData == null">
            <v-img
              v-if="temporaryData.image != null"
              contain
              max-height="80%"
              max-width="80%"
              :src="temporaryData.image"
            ></v-img>

            <v-img
              v-if="temporaryData.image == null"
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
                v-model="temporaryData.idNavigation.username"
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
                v-model="temporaryData.fullname"
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
                v-model="temporaryData.gender"
                row
                prepend-icon="mdi-gender-male-female"
              >
                <v-radio value="Male" label="Male"> </v-radio>
                <v-radio value="Female" label="Female"> </v-radio>
              </v-radio-group>

              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="temporaryData.birthday"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    @change="onChange = true"
                    class="pt-4"
                    solo
                    v-model="computedDateFormatted"
                    label="Birthday*"
                    prepend-icon="mdi-calendar"
                    hint="MM/DD/YYYY format"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="temporaryData.birthday" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(temporaryData.birthday)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <!-- <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.phone"
                label="Phone*"
                prepend-icon="mdi-phone"
                required
                disabled
              ></v-text-field> -->
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.idCard"
                label="ID Card"
                prepend-icon="mdi-card-account-details"
                type="number"
              ></v-text-field>
              <div class="font-weight-bold customHeader pt-5">
                Additional details
              </div>

              <v-select
                :items="degrees"
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.degree"
                label="Degree*"
                prepend-icon="mdi-license"
                required
                :rules="[
                  (v) =>
                    (v.length < 50 && v.length > 3) ||
                    'Your degree must between 3 - 50 character',
                ]"
              ></v-select>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="temporaryData.experience"
                label="Experience*"
                prepend-icon="mdi-trophy-award"
                required
                type="number"
                :rules="[
                  (v) =>
                    (v.length < 50 && v.length > 0) ||
                    'Your experience must be filled',
                ]"
              ></v-text-field>
              <v-select
                @change="onChange = true"
                prepend-icon="mdi-needle"
                :items="specialities"
                item-text="name"
                item-value="id"
                v-model="temporaryData.specialty.id"
                label="Speciality*"
                solo
              ></v-select>
              <v-select
                :items="schools"
                @change="onChange = true"
                class="pt-4"
                solo
                label="School*"
                prepend-icon="mdi-school"
                required
                :rules="[
                  (v) =>
                    (v.length < 50 && v.length > 3) ||
                    'Your school must be filled',
                ]"
                v-model="temporaryData.school"
              ></v-select>
              <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="temporaryData.description"
                label="Description*"
                solo
                :rules="[
                  (v) =>
                    (v.length > 3 && v.length < 255) ||
                    'Your description must between 3 ~ 255 character',
                ]"
                prepend-icon="mdi-account-details"
                required
              ></v-textarea>

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
                  v-on:click="updateDoctor()"
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
    this.fetchSpecialities();
    this.temporaryData = JSON.parse(JSON.stringify(this.doctor));
  },
  props: ["doctor"],
  data() {
    return {
      valid: false,
      temporaryData: [],
      onChange: false,
      specialities: [],
      modal: false,
      imageData: null,
      imagePreview: defaultImage,
      show: false,
      loading: false,
      DOB: "",
      schools: [
        "Hanoi Medical University",
        "University of Medicine And Pharmacy at HCMC",
        "University of Medicine Pham Ngoc Thach",
        "Hai Phong University of Medicine And Pharmacy",
        "Thai Binh University of Medicine And Pharmacy",
        "Vinh Medical University",
        "Can Tho University of Medicine And Pharmacy",
        "Other",
      ],
      degrees: [
        "Bachelor",
        "Bachelor of Medicine",
        "Bachelor of Medical Sciences",
        "Bachelor of Public Health",
        "Bachelor of Surgery",
        "Doctor of Medicine",
        "Other",
      ],
    };
  },
  methods: {
    Reset() {
      this.onChange = false;
      this.temporaryData = JSON.parse(JSON.stringify(this.doctor));
    },

    Cancel() {
      if (this.onChange) {
        this.$confirm(
          "Do you really want to exit? Your change will all lost."
        ).then((res) => {
          if (res) {
            this.temporaryData = JSON.parse(JSON.stringify(this.doctor));
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
    async fetchSpecialities() {
      var response = await axios
        .get(APIHelper.getAPIDefault() + "Specialties")
        .catch(function (error) {
          console.log(error);
        });
      if (response.status == 200) {
        for (let i = 0; i < response.data.length; i++) {
          // console.log(response.data[i]);
          this.specialities.push(response.data[i]);
        }
      }
      console.log(this.specialities);
    },

    async updateDoctor() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      var isUpdated = false;

      this.loading = true;
      if (this.imageData != null) {
        var imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
        this.temporaryData.image = imgURL;
      }

      let profileDoctor = {
        id: this.temporaryData.id,
        fullname: this.temporaryData.fullname,
        birthday: this.temporaryData.birthday,
        gender: this.temporaryData.gender,
        image: this.temporaryData.image,
        email: this.temporaryData.email,
        idCard: this.temporaryData.idCard,
        degree: this.temporaryData.degree,
        experience: this.temporaryData.experience,
        description: this.temporaryData.description,
        specialtyId: this.temporaryData.specialty.id,
        school: this.temporaryData.school,
      };

      var response = await axios
        .put(APIHelper.getAPIDefault() + "Doctors", profileDoctor)
        .catch(function (error) {
          console.log(error);
        });

      if (response.status == 200) {
        isUpdated = true;
      }

      this.resetForm();
      this.show = false;
      this.$emit("updated", isUpdated);
      this.loading = false;

      // await new Promise((resolve) => setTimeout(resolve, 500));
    },
    resetForm() {
      this.imageData = null;
      this.imagePreview = defaultImage;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
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
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.temporaryData.birthday);
    },
  },
};
</script>

<style scoped>
.customHeader {
  font-size: 20px;
}
</style>