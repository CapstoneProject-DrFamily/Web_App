<template>
  <div class="text-center">
    <v-dialog width="500" v-model="show" @click:outside="changeSaved">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              Add Speciality
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
              Create Specialty
            </p>
          </v-col>
        </v-row>
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
            <v-form @submit.prevent ref="form" v-model="valid">
              <div class="font-weight-bold customHeader">Specialty</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.name"
                label="Name"
                prepend-icon="mdi-ab-testing"
                required
                :rules="[(v) => !!v || 'Please enter specialty name']"
              ></v-text-field>
              <!-- <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.type"
                label="Type"
                prepend-icon="mdi-format-list-bulleted-type"
                required
                :rules="[(v) => !!v || 'Please enter symptom type']"
              ></v-text-field> -->
              <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="createData.description"
                label="Description"
                solo
                prepend-icon="mdi-book-open-variant"
                required
                :rules="[(v) => !!v || 'Please enter specialty description']"
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
                  v-on:click="createSymptom()"
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
import axios from "axios";
import APIHelper from "../../../helpers/api";
import defaultImage from "../../../assets/placeholder-img.jpg";
import CommonHelper from "../../../helpers/common";

export default {
  data() {
    return {
      valid: false,

      createData: {
        name: null,
        type: null,
        description: null,
        image:
          "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
      },

      imageData: null,
      imagePreview: defaultImage,

      modal: false,

      show: false,
      loading: false,
    };
  },
  methods: {
    cancel() {
      this.resetForm();
      this.show = false;
    },
    changeSaved() {
      this.resetForm();
      this.$refs.form.resetValidation();
    },

    async createSymptom() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      var isCreated = false;

      var imgURL = null;

      this.loading = true;

      if (this.imageData != null) {
        imgURL = await CommonHelper.uploadStorageFirebase(this.imageData);
        console.log(imgURL);
      }
      this.createData.image = imgURL == null ? this.createData.image : imgURL;

      var response = await axios
        .post(APIHelper.getAPIDefault() + "Specialties", this.createData)
        .catch(function (error) {
          console.log(error);
        });
      if (response.status == 201) {
        isCreated = true;
      }

      // await new Promise((resolve) => setTimeout(resolve, 500));
      this.resetForm();
      this.show = false;
      this.$emit("created", isCreated);
      this.loading = false;
    },
    resetForm() {
      this.$refs.form.resetValidation();
      for (let data in this.createData) {
        this.createData[data] = null;
      }
      this.createData.image =
        "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
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