<template>
  <div class="text-center">
    <v-dialog width="500" v-model="show" @click:outside="changeSaved">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              Add Service
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
              Create Service
            </p>
          </v-col>
        </v-row>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent ref="form" v-model="valid">
              <div class="font-weight-bold customHeader">Service</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.serviceName"
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
                v-model="createData.specialtyId"
                label="Speciality"
                solo
              ></v-select>


              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.servicePrice"
                label="Service Price"
                prepend-icon="mdi-format-list-bulleted-type"
                required
                type="number"
                :rules="[(v) => !!v || 'Please enter service price']"
              ></v-text-field>
              <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="createData.serviceDescription"
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
                  v-on:click="createService()"
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

export default {
    created() {
    this.fetchSpecialities();
  },
  data() {
    return {
      valid: false,

      createData: {
        serviceName: null,
        servicePrice: null,
        serviceDescription: null,
        specialtyId: null,
      },

      modal: false,

      show: false,
      loading: false,
      specialities: []
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
    cancel() {
      this.resetForm();
      this.show = false;
    },
    changeSaved() {
      this.resetForm();
      this.$refs.form.resetValidation();
    },

    async createService() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      var isCreated = false;

      this.loading = true;

      var response = await axios
        .post(
          APIHelper.getAPIDefault() + "Services",
          this.createData
        )
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
    },
  },
};
</script>

<style scoped>
.customHeader {
  font-size: 20px;
}
</style>