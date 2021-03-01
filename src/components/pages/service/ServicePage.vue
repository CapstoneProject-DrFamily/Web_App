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
          <v-btn icon @click="searchService">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <create-service-form @created="addService"></create-service-form>

    <v-simple-table class="elevation-1">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Service name</th>
            <th class="text-left">Price</th>
            <th class="text-left">Description</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="service in services" :key="service.serviceId">
            <td>{{ service.serviceName }}</td>
            <td>{{ service.servicePrice }}</td>
            <td>{{ service.serviceDescription }}</td>

            <td>
              <edit-service-form
                :service="service"
                @updated="updateService"
              ></edit-service-form>
            </td>
            <td>
              <div class="text-center">
                <v-dialog
                  width="500"
                  :retain-focus="false"
                  v-model="service.dltDialog.isShow"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn tile color="error" v-bind="attrs" v-on="on">
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline red lighten-1">
                      Confirm delete this service
                    </v-card-title>

                    <v-card-text>
                      <div class="pa-4">You cannot undo this action.</div>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="grey"
                        text
                        @click="service.dltDialog.isShow = false"
                      >
                        Cancel
                      </v-btn>

                      <v-btn
                        color="primary"
                        :loading="isDeleting"
                        :disabled="isDeleting"
                        text
                        @click.prevent="deleteService(service.serviceId)"
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
            <div class="pa-10" v-if="services.length == 0 && !loading">
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
import CreateServiceForm from "./CreateServiceForm.vue";
import EditServiceForm from "./EditServiceForm.vue";


export default {
  mounted() {
    this.fetchService(this.page, this.pageSize, this.searchValue);
  },
  components: {
    CreateServiceForm,
    EditServiceForm,
  },
  data() {
    return {
      type: "success",
      snackbar: false,
      message: ``,
      isDeleting: false,
      loading: false,

      services: [],
      page: 1,
      pageSize: 10,
      totalPage: null,
      searchBoxValue: null,
      searchValue: null,
    };
  },
  methods: {
    searchService() {
      this.searchValue = this.searchBoxValue;
      if (this.page != 1) {
        this.page = 1;
      } else {
        this.fetchService(this.page, this.pageSize, this.searchValue);
      }
    },

    async fetchService(page, pageSize, value) {
      this.loading = true;
      this.services = [];
      // await new Promise((resolve) => setTimeout(resolve, 500));
      let url = null;

      url =
        value == null
          ? APIHelper.getAPIDefault() +
            "Services/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize
          : APIHelper.getAPIDefault()+
            "Services/paging?PageIndex=" +
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
        for (let i = 0; i < response.data.services.length; i++) {
          if (!response.data.services[i].disable) {
            let name = "dialog" + response.data.services[i].serviceId;
            let dltDialog = { name: name, isShow: false };
            response.data.services[i].dltDialog = dltDialog;
            this.services.push(response.data.services[i]);
            // console.log(response.data.medicines[i]);
          }
        }
      }
      this.loading = false;
    },
    updateService(isUpdated) {
      if (isUpdated) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchService(this.page, this.pageSize, null);
        }
        this.setSnackbar("Update Service Successful", "success");
      } else {
        this.setSnackbar("Update Service Failed", "error");
      }
    },
    addService(isSuccess) {
      if (isSuccess) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchService(this.page, this.pageSize, null);
        }
        this.setSnackbar("Add Service Successful", "success");
      } else {
        this.setSnackbar("Add Service Failed", "error");
      }
    },
    async deleteService(id) {
      var success = false;
      this.isDeleting = true;

      // console.log(id);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      var response = await axios
        .delete(APIHelper.getAPIDefault() + "Services/" + id)
        .catch(function (error) {
          console.log(error);
        });
      console.log(response.status);
      if (response.status == 204) {
        success = true;
      }

      this.services.find((x) => x.serviceId === id).dltDialog.isShow = false;
      if (success) {
        if (this.page != 1) {
          this.page = 1;
        } else {
          this.fetchService(this.page, this.pageSize, null);
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
      this.fetchService(this.page, this.pageSize, this.searchValue);
    },
  },
};
</script>

<style scoped>
</style>