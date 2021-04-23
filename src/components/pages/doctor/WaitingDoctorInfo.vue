<template>
  <div class="text-center pt-6">
    <v-dialog width="500" v-model="show">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="start" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn tile color="info" v-bind="attrs" v-on="on">
              <v-icon>mdi-account-details</v-icon>
            </v-btn>
          </div>
        </v-row>
      </template>
      <v-img
        src="https://static.vecteezy.com/system/resources/previews/000/656/917/non_2x/vector-set-of-doctor-cartoon-characters-medical-staff-team-concept-in-front-of-hospital.jpg"
        height="200px"
      ></v-img>
      <v-card>
        <v-row>
          <v-col>
            <p class="text-center customHeader font-weight-bold pt-6 pb-6">
              Doctor Info
            </p>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row justify="center" v-if="imageData == null">
            <v-img
              contain
              max-height="80%"
              max-width="80%"
              :src="temporaryData.doctorNavigation.image"
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
        </v-card-text>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent>
              <div class="font-weight-bold customHeader">Account Detail</div>
              <!-- <v-text-field
                class="pt-6"
                filled
                rounded
                readonly
                v-model="temporaryData.doctorNavigation.account.username"
                label="Username"
                prepend-icon="mdi-account-box"
                required
              ></v-text-field> -->

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="temporaryData.doctorNavigation.fullName"
                prepend-icon="mdi-account"
                label="Name"
              ></v-text-field>
              <v-radio-group
                readonly
                @change="onChange = true"
                v-model="temporaryData.doctorNavigation.gender"
                row
                prepend-icon="mdi-gender-male-female"
              >
                <v-radio value="Male" label="Male"> </v-radio>
                <v-radio value="Female" label="Female" > </v-radio>
              </v-radio-group>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="computedDateFormatted"
                label="Birthday"
                prepend-icon="mdi-calendar"
                hint="MM/DD/YYYY format"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="temporaryData.doctorNavigation.phone"
                label="Phone"
                prepend-icon="mdi-phone"
                required
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="temporaryData.doctorNavigation.email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="temporaryData.doctorNavigation.idCard"
                label="ID Card"
                prepend-icon="mdi-card-account-details"
                type="number"
              ></v-text-field>
              <div class="font-weight-bold customHeader pt-5">
                Additional details
              </div>

              <v-text-field
                @change="onChange = true"
                class="pt-6"
                filled
                rounded
                readonly
                v-model="temporaryData.degree"
                label="Degree"
                prepend-icon="mdi-license"
                required
              ></v-text-field>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="temporaryData.experience"
                label="Experience"
                prepend-icon="mdi-trophy-award"
                required
              ></v-text-field>

              <v-select
                @change="onChange = true"
                prepend-icon="mdi-needle"
                :items="specialities"
                item-text="name"
                item-value="specialtyId"
                v-model="temporaryData.specialtyId"
                label="Speciality"
                filled
                rounded
                readonly
              ></v-select>
              <v-text-field
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                label="School"
                prepend-icon="mdi-school"
                required
                v-model="temporaryData.school"
              ></v-text-field>
              <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="temporaryData.description"
                label="Description"
                filled
                rounded
                readonly
                prepend-icon="mdi-account-details"
                required
              ></v-textarea>

              <v-row justify="center">
                <v-btn
                  color="info"
                  class="mr-4"
                  v-on:click="closeDialog()"
                  v-if="!loading"
                >
                  Close
                </v-btn>

                <!-- <v-btn
                  color="error"
                  class="mr-4"
                  v-on:click="confirmDialog(false)"
                  v-if="!loading"
                >
                  Deny
                </v-btn> -->

                <!-- <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="success"
                  class="mr-4"
                  type="submit"
                  v-on:click="confirmDialog(true)"
                >
                  Approve
                </v-btn> -->
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
import axios from "axios";
import APIHelper from "../../../helpers/api";

export default {
  created() {
    this.fetchSpecialities();
    this.temporaryData = JSON.parse(JSON.stringify(this.doctor));
  },
  props: ["doctor"],
  data() {
    return {
      temporaryData: [],
      onChange: false,
      specialities: [],
      modal: false,
      imageData: null,
      imagePreview: defaultImage,
      show: false,
      loading: false,
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    confirmDialog(typed) {
      if (typed) {
        this.$confirm("Do you want to approve this doctor ?").then((res) => {
          if (res) {
            this.approveDoctor();
          } else {
            return;
          }
        });
      } else {
        this.$confirm("Do you want to deny this doctor ?").then((res) => {
          if (res) {
            this.denyDoctor();
          } else {
            return;
          }
        });
      }
    },

    async denyDoctor() {
      var isSuccess = false;
      this.loading = true;

      let data = {
        disabled: true,
        accountId: this.doctor.doctorNavigation.account.accountId,
        roleId: this.doctor.doctorNavigation.account.roleId,
        profileId: this.doctor.doctorNavigation.profileId,
        waiting: false,
        username: this.doctor.doctorNavigation.account.username,
      };
      var response = await axios
        .put(APIHelper.getAPIDefault() + "Users", data)
        .catch(function (error) {
          console.log(error);
        });

      if (response.status == 200) {
        isSuccess = true;
      }
      this.show = false;
      this.$emit("denied", isSuccess);
      this.loading = false;
    },
    closeDialog() {
      this.show = false;
    },
    async approveDoctor() {
      var isApproved = false;
      this.loading = true;

      let data = {
        disabled: false,
        accountId: this.doctor.doctorNavigation.account.accountId,
        roleId: this.doctor.doctorNavigation.account.roleId,
        profileId: this.doctor.doctorNavigation.profileId,
        waiting: false,
        username: this.doctor.doctorNavigation.account.username,
      };
      var response = await axios
        .put(
          APIHelper.getAPIDefault() + "Users?isAcceptDoctor=" + isApproved,
          data
        )
        .catch(function (error) {
          console.log(error);
        });

      if (response.status == 200) {
        isApproved = true;
      }
      this.show = false;
      this.$emit("approved", isApproved);
      this.loading = false;
    },
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
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.temporaryData.doctorNavigation.birthday);
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