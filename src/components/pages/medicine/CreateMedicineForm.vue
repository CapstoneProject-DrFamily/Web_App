<template>
  <div class="text-center">
    <v-dialog width="500" v-model="show" @click:outside="changeSaved">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              Add Medicine
            </v-btn>
          </div>
        </v-row>
      </template>
      <v-img
        src="https://image.freepik.com/free-vector/medicines-drug-collection-with-banner-free-space_65709-20.jpg"
        height="200px"
      ></v-img>
      <v-card>
        <row>
          <p class="text-center customHeader font-weight-bold pt-6 pb-6">
            Create New Medicine
          </p>
        </row>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent ref="form" v-model="valid">
              <div class="font-weight-bold customHeader">Medicine</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.name"
                label="Name"
                prepend-icon="mdi-ab-testing"
                required
                :rules="[(v) => !!v || 'Please enter medicine name']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.form"
                label="Form"
                prepend-icon="mdi-pill"
                required
                :rules="[(v) => !!v || 'Please enter medicine form']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.strength"
                label="Strength"
                prepend-icon="mdi-wave"
                required
                :rules="[(v) => !!v || 'Please enter medicine strength']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="createData.activeIngredient"
                label="Active Ingredient"
                prepend-icon="mdi-fruit-cherries"
                required
                :rules="[
                  (v) => !!v || 'Please enter medicine active ingredient',
                ]"
              ></v-text-field>

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
                  v-on:click="createMedicine()"
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
  data() {
    return {
      valid: false,

      createData: {
        name: null,
        form: null,
        strength: null,
        activeIngredient: null,
      },

      modal: false,

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

    async createMedicine() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      var isCreated = false;

      this.loading = true;

      var response = await axios
        .post(APIHelper.getAPIDefault() + "Medicines", this.createData)
        .catch(function (error) {
          console.log(error);
        });
      if(response.status == 201) {
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
      for(let data in this.createData) {
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