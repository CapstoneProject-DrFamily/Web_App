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
        src="https://image.freepik.com/free-vector/medicines-drug-collection-with-banner-free-space_65709-20.jpg"
        height="200px"
      ></v-img>
      <v-card>
            <v-row>
          <v-col>
            <p class="text-center customHeader font-weight-bold pt-6 pb-6">
              Update Medicine
            </p>
          </v-col>
        </v-row>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent ref="form" v-model="valid">
              <div class="font-weight-bold customHeader">Medicine</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.name"
                label="Name"
                prepend-icon="mdi-ab-testing"
                required
                :rules="[(v) => !!v || 'Please enter medicine name']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.form"
                label="Form"
                prepend-icon="mdi-pill"
                required
                :rules="[(v) => !!v || 'Please enter medicine form']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.strength"
                label="Strength"
                prepend-icon="mdi-wave"
                required
                :rules="[(v) => !!v || 'Please enter medicine strength']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.activeIngredient"
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
                  v-on:click="updateMedicine()"
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

export default {
  created() {
    this.temporaryData = JSON.parse(JSON.stringify(this.medicine));
  },
  props: ["medicine"],
  data() {
    return {
      valid: false,
      temporaryData: [],
      onChange: false,
      modal: false,
      show: false,
      loading: false,
    };
  },
  methods: {
    resetForm() {
      this.onChange = false;
      this.temporaryData = JSON.parse(JSON.stringify(this.medicine));
    },

    cancel() {
      if (this.onChange) {
        this.$confirm(
          "Do you really want to exit? Your change will all lost."
        ).then((res) => {
          if (res) {
            this.temporaryData = JSON.parse(JSON.stringify(this.medicine));
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

    async updateMedicine() {
      var isUpdated = false;
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      this.loading = true;

      var response = await axios
        .put(APIHelper.getAPIDefault() + "Medicines", this.temporaryData)
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
  },
};
</script>

<style scoped>
.customHeader {
  font-size: 20px;
}
</style>