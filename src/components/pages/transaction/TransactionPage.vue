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
          <v-btn icon @click="searchTransaction">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-simple-table class="elevation-1">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Transaction ID</th>
            <th class="text-left">Doctor</th>
            <th class="text-left">Patient</th>
            <th class="text-left">Location</th>
            <th class="text-left">Date Start</th>
            <th class="text-left">Date End</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="transaction in transactions"
            :key="transaction.transactionId"
          >
            <td>{{ transaction.id.substring(0, 5) }}...</td>
            <td>{{ transaction.doctor.fullname }}</td>
            <td>{{ transaction.patient.fullname }}</td>
            <td>{{ transaction.location.substring(0, 35) }}...</td>

            <td>{{ transaction.dateStart.substring(0, 16) }}</td>
              <td v-if="transaction.dateEnd == null">
              
            </td>
            <td v-if="transaction.dateEnd != null">
              {{ transaction.dateEnd.substring(0,16) }}
            </td>

            <td>
              <transaction-detail-page
                :transaction="transaction"
              ></transaction-detail-page>
            </td>

            <td>
              <v-chip
                class="ml-3"
                color="yellow"
                text-color="white"
                v-if="transaction.status == 1"
                >On going</v-chip
              >
              <v-chip
                class="ml-3"
                color="orange"
                text-color="white"
                v-if="transaction.status == 2"
                >Checking</v-chip
              >
              <v-chip
                class="ml-3"
                color="green"
                text-color="white"
                v-if="transaction.status == 3"
                >Done</v-chip
              >
              <v-chip class="ml-3" color="error" v-if="transaction.status == 4"
                >Cancel</v-chip
              >

              <v-chip
                class="ml-3"
                color="primary"
                v-if="transaction.status == 5"
                >Unpaid</v-chip
              >

              <v-chip
                class="ml-3"
                color="grey"
                text-color="white"
                v-if="transaction.status == 6"
                >Sample</v-chip
              >
            </td>
          </tr>
          <td class="text-center" colspan="10">
            <div class="pa-10" v-if="transactions.length == 0 && !loading">
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
import TransactionDetailPage from "./TransactionDetailPage.vue";
// import CommonHelper from '../../../helpers/common';

export default {
  mounted() {
    this.fetchTransaction(this.page, this.pageSize, this.searchValue);
  },

  data() {
    return {
      type: "success",
      snackbar: false,
      message: ``,
      isDeleting: false,
      loading: false,

      transactions: [],
      page: 1,
      pageSize: 10,
      totalPage: null,
      searchBoxValue: null,
      searchValue: null,
    };
  },
  methods: {
    async searchTransaction() {
      if (this.searchBoxValue == null || this.searchBoxValue == "") {
        this.searchValue = null;
        this.page = 1;
        this.fetchTransaction(this.page, this.pageSize, this.searchValue);
        return;
      }

      this.transactions = [];
      this.searchValue = this.searchBoxValue;
      console.log(this.searchValue);
      let url = APIHelper.getAPIDefault() + "Transactions/" + this.searchValue;
      var response = await axios.get(url).catch(function (error) {
        console.log(error);
      });

      if (response != undefined) {
        if (response.status == 200) {
          this.totalPage = 1;
          console.log(response.data);
          response.data.location = await this.getLocation(
            response.data.location
          );

          response.data.dateStart = this.formatDay(response.data.dateStart);
          if (response.data.dateEnd != null) {
            console.log(response.data.dateEnd);
            response.data.dateEnd = this.formatDay(response.data.dateEnd);
          }

          this.transactions.push(response.data);
        }
      }
    },

    async fetchTransaction(page, pageSize, value) {
      this.loading = true;
      this.transactions = [];
      // await new Promise((resolve) => setTimeout(resolve, 500));
      let url = null;

      url =
        value == null
          ? APIHelper.getAPIDefault() +
            "Transactions/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize
          : APIHelper.getAPIDefault() +
            "Transactions/paging?PageIndex=" +
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
        for (let i = 0; i < response.data.transactions.length; i++) {
          if (!response.data.transactions[i].disable) {
            // console.log(response.data.transactions[i]);
            response.data.transactions[i].location = await this.getLocation(
              response.data.transactions[i].location
            );

            response.data.transactions[i].dateStart = this.formatDay(
              response.data.transactions[i].dateStart
            );
            if (response.data.transactions[i].dateEnd != null) {
              response.data.transactions[i].dateEnd = this.formatDay(
                response.data.transactions[i].dateEnd
              );
            }

            this.transactions.push(response.data.transactions[i]);
          }
        }
      }

      this.loading = false;
    },

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
    formatDay(date) {
      date = new Date(date);
      let day = date.getDate().toString().padStart(2, "0");
      let month = (1 + date.getMonth()).toString().padStart(2, "0");
      let year = date.getFullYear();

      let hour = date.getHours().toString().padStart(2, "0");
      let minutes = date.getMinutes().toString().padStart(2, "0");
      return (
        day + "/" + month + "/" + year + " " + hour + ":" + minutes + " GMT+07"
      );
    },

    async getLocation(location) {
      let data = location.split(";");
      let temp = data[1];
      let address = temp.split(":");

      return address[1].toString();

      // let position = location.split(",");
      // let latitude = Number(position[0].split(":")[1]);
      // let longtitude = Number(position[1].split(":")[1]);
      // let url =
      //   "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      //   latitude +
      //   "," +
      //   longtitude +
      //   "&key=AIzaSyDFd7ZNm2BL2JREvk32NZJ0wHzUn2fjw4A";
      // var response = await axios.get(url).catch(function (error) {
      //   console.log(error);
      // });
      // if (response.status == 200) {
      //   return response.data.results[0].formatted_address;
      // } else {
      //   return "";
      // }
    },
  },
  watch: {
    page: function () {
      if (this.searchValue == null) {
        this.fetchTransaction(this.page, this.pageSize, this.searchValue);
      }
    },
  },
  components: {
    TransactionDetailPage,
  },
};
</script>

<style scoped>
</style>