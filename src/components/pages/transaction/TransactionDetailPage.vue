<template>
  <div class="text-center pt-6">
    <v-dialog width="500" v-model="show">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4">
          <div class="my-2">
            <v-btn tile color="info" v-bind="attrs" v-on="on">
              <v-icon>mdi-information </v-icon>
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
              Transaction Detail
            </p>
          </v-col>
        </v-row>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent>
              <div class="font-weight-bold customHeader">
                General Information
              </div>
              <v-text-field
                class="pt-6"
                filled
                rounded
                readonly
                v-model="transaction.transactionId"
                label="Transaction ID"
                prepend-icon="mdi-account-box"
                required
              ></v-text-field>

              <v-textarea
                auto-grow
                rows="1"
                @change="onChange = true"
                class="pt-4"
                filled
                rounded
                readonly
                v-model="transaction.location"
                prepend-icon="mdi-account"
                label="Location"
              ></v-textarea>

              <v-text-field
                class="pt-4"
                filled
                rounded
                readonly
                v-model="transaction.dateStart"
                prepend-icon="mdi-account"
                label="Start"
              ></v-text-field>

              <v-text-field
                class="pt-4"
                filled
                rounded
                readonly
                v-model="transaction.dateEnd"
                prepend-icon="mdi-account"
                label="End"
              >
              </v-text-field>

              <div class="font-weight-bold customHeader pt-5 pb-5">
                Doctor Information
              </div>
              <!-- <div>
                <v-row justify="center">
                  <v-col md="8" sm="8">
                    <v-img
                      :src="transaction.doctor.profile.image"
                    ></v-img>
                  </v-col>
                </v-row>
              </div> -->

              <v-text-field
                class="pt-6"
                filled
                rounded
                readonly
                v-model="transaction.doctor.doctorNavigation.fullName"
                label="Doctor"
                prepend-icon="mdi-license"
              ></v-text-field>

              <div class="font-weight-bold customHeader pt-5 pb-5">
                Patient Information
              </div>
              <v-text-field
                class="pt-6"
                filled
                rounded
                readonly
                v-model="transaction.patient.patientNavigation.fullName"
                label="Patient"
                prepend-icon="mdi-license"
                required
              ></v-text-field>

              <v-row>
                <v-col cols="1">
                  <v-icon>mdi-account-search</v-icon>
                </v-col>
                <v-col>
                  <v-chip
                    color="primary"
                    class="ml-1 mr-1"
                    v-for="symptom in transaction.symptomDetails"
                    :key="symptom.symptomId"
                    >{{ symptom.symptom.name }}</v-chip
                  >
                </v-col>
              </v-row>

              <div class="font-weight-bold customHeader pt-10 pb-5">
                Service Information
              </div>
              <v-text-field
                class="pt-6"
                filled
                rounded
                readonly
                v-model="transaction.service.serviceName"
                label="Service"
                prepend-icon="mdi-license"
                required
              ></v-text-field>

              <v-text-field
                class="pt-6"
                filled
                rounded
                readonly
                v-model="transaction.service.servicePrice"
                label="Service Price (VNĐ)"
                prepend-icon="mdi-license"
                required
              ></v-text-field>

              <v-textarea
                @change="onChange = true"
                class="pt-4"
                v-model="transaction.note"
                label="Note"
                filled
                rounded
                readonly
                prepend-icon="mdi-account-details"
                required
              ></v-textarea>

              <v-row class="pb-10">
                <v-col>
                  Status
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
                  <v-chip
                    class="ml-3"
                    color="error"
                    v-if="transaction.status == 4"
                    >Cancel</v-chip
                  >
                   <v-chip
                    class="ml-3"
                    color="primary"
                    v-if="transaction.status == 5"
                    >Unpaid</v-chip
                  >
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-btn
                  color="info"
                  class="mr-4"
                  v-on:click="show = false"
                  v-if="!loading"
                >
                  Close
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
export default {
  props: ["transaction"],
  data() {
    return {
      valid: false,

      onChange: false,
      modal: false,
      show: false,
      loading: false,
    };
  },
  methods: {},
};
</script>

<style scoped>
.customHeader {
  font-size: 20px;
}
</style>