<template>
  <div class="text-center">
    <v-dialog width="500" v-model="show" @click:outside="changeSaved">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              Add Doctor
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
            Create New Doctor
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
                v-model="username"
                label="Username (Your phone number)*"
                prepend-icon="mdi-account-box"
                required
                :rules="[(v) => !!v || 'Please enter your username']"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="fullname"
                prepend-icon="mdi-account"
                label="Full Name*"
                :rules="[(v) => !!v || 'Please enter your full name']"
                required
              ></v-text-field>
              <v-radio-group
                @change="onChange = true"
                v-model="gender"
                row
                prepend-icon="mdi-gender-male-female"
                :rules="[(v) => !!v || 'Please select your gender']"
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
                    @change="onChange = true"
                    class="pt-4"
                    solo
                    v-model="date"
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
                :rules="[(v) => !!v || 'Please enter your email']"
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                :rules="[(v) => !!v || 'Please enter your ID CARD']"
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="idCard"
                label="ID Card"
                prepend-icon="mdi-card-account-details"
                type="number"
              ></v-text-field>
              <div class="font-weight-bold customHeader pt-5">
                Additional details
              </div>

              <v-text-field
                :rules="[(v) => !!v || 'Please enter your degree']"
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="degree"
                label="Degree*"
                prepend-icon="mdi-license"
                required
              ></v-text-field>
              <v-text-field
                :rules="[(v) => !!v || 'Please enter your experience']"
                @change="onChange = true"
                class="pt-4"
                solo
                v-model="experience"
                label="Experience*"
                prepend-icon="mdi-trophy-award"
                required
              ></v-text-field>

              <v-select
                :rules="[(v) => !!v || 'Please select your speciality']"
                @change="onChange = true"
                prepend-icon="mdi-needle"
                :items="specialities"
                item-text="name"
                item-value="specialtyId"
                v-model="speciality"
                label="Speciality*"
                solo
              ></v-select>
              <v-text-field
                :rules="[(v) => !!v || 'Please enter your school']"
                @change="onChange = true"
                class="pt-4"
                solo
                label="School*"
                prepend-icon="mdi-school"
                required
                v-model="school"
              ></v-text-field>
              <v-textarea
                :rules="[(v) => !!v || 'Please enter your description']"
                @change="onChange = true"
                class="pt-4"
                v-model="description"
                label="Description*"
                solo
                prepend-icon="mdi-account-details"
                required
              ></v-textarea>

              <v-row justify="center" class="pt-3">
                <v-btn
                  color="info"
                  class="mr-4"
                  v-on:click="resetForm()"
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
                  v-on:click="createDoctor()"
                >
                  Create
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
  },

  data() {
    return {
      valid: false,
      username: null,
      fullname: null,
      gender: null,
      date: new Date().toISOString().substr(0, 10),
      phone: null,
      email: null,
      idCard: null,

      degree: null,
      experience: null,
      description: null,
      school: null,
      speciality: null,

      specialities: [],
      modal: false,
      imageData: null,
      imagePreview: defaultImage,
      show: false,
      loading: false,
    };
  },
  methods: {
    Cancel() {
      this.resetForm();
      this.show = false;
    },
    changeSaved() {
      this.resetForm();
      this.$refs.form.resetValidation();
    },
    async fetchSpecialities() {
      // await new Promise((resolve) => setTimeout(resolve, 500));

      var response = await axios
        .get(APIHelper.getAPIDefault() + "Specialty")
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

    async createDoctor() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      var isCreated = false;

      this.loading = true;
      var imgURL = null;
      if (this.imageData != null) {
        imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
      }

      let data = {
        fullname: this.fullname,
        birthday: this.date,
        gender: this.gender,
        phone: this.username,
        image: imgURL,
        email: this.email,
        idCard: this.idCard,
      };

      var response = await axios
        .post(APIHelper.getAPIDefault() + "Profiles", data)
        .catch(function (error) {
          console.log(error);
        });
      console.log(response);

      if (response.status == 201) {
        var profileId = response.data.profileId;
        let data = {
          disabled: false,
          insBy: "Admin",
          username: this.username,
          password: null,
          roleId: 3,
          profileId: profileId,
          waiting: false,
        };
        response = await axios
          .post(APIHelper.getAPIDefault() + "Users", data)
          .catch(function (error) {
            console.log(error);
          });
        console.log(response);

        if (response.status == 201) {
          let data = {
            degree: this.degree,
            experience: this.experience,
            description: this.description,
            specialtyId: this.speciality,
            profileId: profileId,
            school: this.school,
          };
          response = await axios
            .post(APIHelper.getAPIDefault() + "Doctors", data)
            .catch(function (error) {
              console.log(error);
            });
          if (response.status == 201) {
            console.log(response);
            isCreated = true;
          }
        }
      }

      // await new Promise((resolve) => setTimeout(resolve, 500));
      this.resetForm();
      this.show = false;
      this.$emit("created", isCreated);
      this.loading = false;
    },
    resetForm() {
      this.$refs.form.resetValidation();
      this.imageData = null;
      this.imagePreview = defaultImage;

      this.username = null;
      this.fullname = null;
      this.gender = null;
      this.date = new Date().toISOString().substr(0, 10);
      this.phone = null;
      this.email = null;
      this.idCard = null;
      this.degree = null;
      this.experience = null;
      this.description = null;
      this.school = null;
      this.speciality = null;
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