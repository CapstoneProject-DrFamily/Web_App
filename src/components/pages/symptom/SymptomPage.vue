<template>
  <v-container fluid pt-8>
    <div class="text-center">
      <v-snackbar
        timeout="5000"
        v-model="snackbar"
        right
        top
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
    </div>

    <v-row no-gutters justify="center">
      <v-col cols="8">
        <v-text-field
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          filled
          dense
          color="blue"
          solo
          v-model="searchBoxValue"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <div class="pt-1 pl-1">
          <v-btn icon @click="searchSymptom">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <create-symptom-form @created="addSymptom"></create-symptom-form>

    <v-simple-table class="elevation-1">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Image</th>
            <th class="text-left">Name</th>
            <th class="text-left">Description</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="symptom in symptoms" :key="symptom.specialtyId">
             <td class="pt-6 pb-6">
              <v-img
                :src="symptom.image"
                width="100"
                height="100"
              ></v-img>
            </td>
            <td>{{ symptom.name }}</td>
            <td>{{ symptom.description.substring(0, 20) }}...</td>

            <td>
              <edit-symptom-form
                :symptom="symptom"
                @updated="updateSymptom"
              ></edit-symptom-form>
            </td>
            <td>
              <div class="text-center">
                <v-dialog
                  width="500"
                  :retain-focus="false"
                  v-model="symptom.dltDialog.isShow"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn tile color="error" v-bind="attrs" v-on="on">
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline red lighten-1">
                      Confirm delete this Specialty
                    </v-card-title>

                    <v-card-text>
                      <div class="pa-4">You cannot undo this action.</div>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="grey"
                        text
                        @click="symptom.dltDialog.isShow = false"
                      >
                        Cancel
                      </v-btn>

                      <v-btn
                        color="primary"
                        :loading="isDeleting"
                        :disabled="isDeleting"
                        text
                        @click.prevent="deleteSymptom(symptom.specialtyId)"
                      >
                        I accept
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </td>
          </tr>
          <td class="text-center" colspan="10">
            <div class="pa-10" v-if="symptoms.length == 0 && !loading">
              No data found
            </div>

            <div class="text-center pt-6 pb-6" v-if="loading">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </td>
        </tbody>
      </template>
    </v-simple-table>

    <v-row justify="center" v-if="!loading">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination
            v-model="page"
            class="my-4"
            :length="totalPage"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import APIHelper from "../../../helpers/api";
import CreateSymptomForm from "./CreateSymptomForm.vue";
import EditSymptomForm from "./EditSymptomForm.vue";
// import CommonHelper from '../../../helpers/common';

export default {
  mounted() {
    this.fetchSymptom(this.page, this.pageSize, this.searchValue);
  },

  data() {
    return {
      type: "success",
      snackbar: false,
      message: ``,
      isDeleting: false,
      loading: false,

      symptoms: [],
      page: 1,
      pageSize: 10,
      totalPage: null,
      searchBoxValue: null,
      searchValue: null,
    };
  },
  methods: {
    searchSymptom() {
      this.searchValue = this.searchBoxValue;
      if (this.page != 1) {
        this.page = 1;
      } else {
        this.fetchSymptom(this.page, this.pageSize, this.searchValue);
      }
    },

    async fetchSymptom(page, pageSize, value) {
      this.loading = true;
      this.symptoms = [];
      // await new Promise((resolve) => setTimeout(resolve, 500));
      let url = null;

      url =
        value == null
          ? APIHelper.getAPIDefault() +
            "Specialties/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize
          : APIHelper.getAPIDefault() +
            "Specialties/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize +
            "&SearchValue=" +
            value;

      var response = await axios.get(url).catch(function (error) {
        console.log(error);
      });

      if (response.status == 200) {
        this.totalPage = response.data.totalPages;
        for (let i = 0; i < response.data.specialties.length; i++) {
          if (!response.data.specialties[i].disable) {
            let name = "dialog" + response.data.specialties[i].specialtyId;
            let dltDialog = { name: name, isShow: false };
            response.data.specialties[i].dltDialog = dltDialog;
            this.symptoms.push(response.data.specialties[i]);
            // console.log(response.data.medicines[i]);
          }
        }
      }
      console.log(this.symptoms);
      this.loading = false;
    },
    updateSymptom(isUpdated) {
      if (isUpdated) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchSymptom(this.page, this.pageSize, null);
        }
        this.setSnackbar("Update Specialty Successful", "success");
      } else {
        this.setSnackbar("Update Specialty Failed", "error");
      }
    },
    addSymptom(isSuccess) {
      if (isSuccess) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchSymptom(this.page, this.pageSize, null);
        }
        this.setSnackbar("Add Specialty Successful", "success");
      } else {
        this.setSnackbar("Add Specialty Failed", "error");
      }
    },
    async deleteSymptom(id) {
      var success = false;
      this.isDeleting = true;

      // console.log(id);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      var response = await axios
        .delete(APIHelper.getAPIDefault() + "Specialties/" + id)
        .catch(function (error) {
          console.log(error);
        });
      console.log(response.status);
      if (response.status == 204) {
        success = true;
      }

      this.symptoms.find((x) => x.specialtyId === id).dltDialog.isShow = false;
      if (success) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchSymptom(this.page, this.pageSize, null);
        }
        this.setSnackbar("Delete successful", "success");
      } else {
        this.setSnackbar("Delete failed", "error");
      }

      this.isDeleting = false;
    },
    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
  },
  watch: {
    page: function () {
      this.fetchSymptom(this.page, this.pageSize, this.searchValue);
    },
  },
  components: {
    CreateSymptomForm,
    EditSymptomForm,
  },
};
</script>

<style scoped>
</style>