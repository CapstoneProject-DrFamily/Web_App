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
        <row>
          <p class="text-center customHeader font-weight-bold pt-6 pb-6">
            Update Symptom
          </p>
        </row>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent ref="form" v-model="valid">
              <div class="font-weight-bold customHeader">Symptom</div>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.name"
                label="Name"
                prepend-icon="mdi-ab-testing"
                required
                :rules="[(v) => !!v || 'Please enter symptom name']"
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-6"
                solo
                v-model="temporaryData.type"
                label="Type"
                prepend-icon="mdi-format-list-bulleted-type"
                required
                :rules="[(v) => !!v || 'Please enter symptom type']"
              ></v-text-field>
                      <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="temporaryData.description"
                label="Description"
                solo
                prepend-icon="mdi-book-open-variant"
                required
                :rules="[(v) => !!v || 'Please enter symptom description']"
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
                  v-on:click="updateSymptom()"
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
import axios from "axios";
import APIHelper from "../../../helpers/api";

export default {
  created() {
    this.temporaryData = JSON.parse(JSON.stringify(this.symptom));
  },
  props: ["symptom"],
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
      this.temporaryData = JSON.parse(JSON.stringify(this.symptom));
    },

    cancel() {
      if (this.onChange) {
        this.$confirm(
          "Do you really want to exit? Your change will all lost."
        ).then((res) => {
          if (res) {
            this.temporaryData = JSON.parse(JSON.stringify(this.symptom));
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

    async updateSymptom() {
      var isUpdated = false;
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      this.loading = true;

      var response = await axios
        .put(APIHelper.getAPIDefault() + "Symptoms", this.temporaryData)
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