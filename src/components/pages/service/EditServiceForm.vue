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
        src="https://image.freepik.com/free-vector/doctors-examining-huge-liver-with-magnifier-microscope-cirrhosis-cirrhosis-liver-liver-disease-concept-white-background-pinkish-coral-bluevector-isolated-illustration_335657-1531.jpg"
        height="200px"
      ></v-img>
      <v-card>
        <v-row>
          <v-col>
            <p class="text-center customHeader font-weight-bold pt-6 pb-6">
              Update Service
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
              <div class="font-weight-bold customHeader">Service</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.serviceName"
                label="Service Name"
                prepend-icon="mdi-ab-testing"
                required
                :rules="[(v) => !!v || 'Please enter service name']"
              ></v-text-field>

              <v-select
                @change="onChange = true"
                prepend-icon="mdi-needle"
                :items="specialities"
                item-text="name"
                item-value="specialtyId"
                v-model="temporaryData.specialtyId"
                label="Speciality*"
                solo
                readonly
              ></v-select>

              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.servicePrice"
                label="Service Price"
                prepend-icon="mdi-format-list-bulleted-type"
                required
                type="number"
                :rules="[(v) => !!v || 'Please enter service price']"
              ></v-text-field>
              <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="temporaryData.serviceDescription"
                label="Service Description"
                solo
                prepend-icon="mdi-book-open-variant"
                required
                :rules="[(v) => !!v || 'Please enter service description']"
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
                  v-on:click="cancel()"
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
                  v-on:click="updateService()"
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
import axios from "axios";
import APIHelper from "../../../helpers/api";
import CommonHelper from "../../../helpers/common";
import defaultImage from "../../../assets/placeholder-img.jpg";

export default {
  created() {
    this.temporaryData = JSON.parse(JSON.stringify(this.service));
    console.log(this.temporaryData);
    this.fetchSpecialities();
  },
  props: ["service"],
  data() {
    return {
      imageData: null,
      imagePreview: defaultImage,
      valid: false,
      temporaryData: [],
      onChange: false,
      modal: false,
      show: false,
      loading: false,
      specialities: [],
    };
  },
  methods: {
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
    },

    resetForm() {
            this.imageData = null;
      this.imagePreview = defaultImage;
      this.onChange = false;
      this.temporaryData = JSON.parse(JSON.stringify(this.service));
    },

    cancel() {
      if (this.onChange) {
        this.$confirm(
          "Do you really want to exit? Your change will all lost."
        ).then((res) => {
          if (res) {
            this.temporaryData = JSON.parse(JSON.stringify(this.service));
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

    async updateService() {
      var isUpdated = false;
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      this.loading = true;
      if (this.imageData != null) {
        var imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
        this.temporaryData.image = imgURL;
      }

      var response = await axios
        .put(APIHelper.getAPIDefault() + "Services", this.temporaryData)
        .catch(function (error) {
          console.log(error);
        });
      console.log(response);
      if (response.status == 200) {
        isUpdated = true;
      }

      this.resetForm();
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