<template>
  <v-container fluid>
    <v-col>
      <v-snackbar
        timeout="5000"
        v-model="snackbar"
        top
        right
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
      <v-row>
        <v-col
          ><div class="pt-6 pb-6"><h1>App Setting</h1></div></v-col
        >
      </v-row>
      <v-row>
        <v-col
          ><div class="pt-3 pb-3 pl-3"><h2>Doctor App Setting</h2></div></v-col
        >
      </v-row>
      <v-row class="pl-3">
        <v-col cols="1">Timeout duration</v-col>
        <v-col cols="10">
          <v-slider
            ticks="always"
            :min="min"
            :max="max"
            :step="step"
            tick-size="4"
            v-model="value"
            :tick-labels="labels"
          >
          </v-slider>
        </v-col>
      </v-row>
      <v-form @submit.prevent ref="formParam" v-model="validParam">
        <v-row class="pl-3 pt-6" align="center">
          <v-col cols="6">
            <v-row>
              <v-col cols="6 pt-9"> Active appointment during </v-col>
              <v-col cols="3 pt-6">
                <v-text-field
                  class="centered-input"
                  v-if="doctorConfig != null"
                  type="number"
                  solo
                  :rules="[
                    (v) => v > 0 || 'Number must greater than 0',
                    (v) => Number.isInteger(v) || 'Must be integer',
                  ]"
                  v-model.number="doctorConfig.appointmentNotifyTime"
              
                ></v-text-field>
              </v-col>
               <v-col cols="auto pt-9">
                  minutes
                </v-col>
            </v-row>
          </v-col>

          <v-col cols="6">
            <v-row>
              <v-col cols="3 pt-9"> Total sample test  </v-col>
              <v-col cols="3 pt-6">
                <v-text-field
                solo
                  v-if="doctorConfig != null"
                  type="number"
                  class="centered-input"
                  :rules="[
                    (v) =>
                      (v > 0 && v < 4) ||
                      'Number must greater than 0 and less than 4',
                    (v) => Number.isInteger(v) || 'Must be integer',
                  ]"
                  v-model.number="doctorConfig.imageQuantity"
                
                ></v-text-field> </v-col>
                <v-col cols="auto pt-9">
                  images
                </v-col>
            </v-row>
          </v-col>
        </v-row>

         <v-row class="pl-3 pt-6" align="center">
          <v-col cols="6">
            <v-row>
              <v-col cols="6 pt-9"> Gap time in schedule </v-col>
              <v-col cols="3 pt-6">
                 <v-text-field
                  class="centered-input"
                  v-if="doctorConfig != null"
                  type="number"
                  solo
                  :rules="[
                    (v) => v >= 0 && v <= 23 || 'Range 0 ~ 23',
                    (v) => Number.isInteger(v) || 'Must be integer',
                    (v) =>  v != 0 || this.gaptime.minutes != 0 || 'Invalid',
                  ]"
                  v-model.number="gaptime.hours"
              
                ></v-text-field>
              </v-col>
               <v-col cols="auto pt-9">
                  hours
                </v-col>
            </v-row>
          </v-col>

          <v-col cols="6">
            <v-row>
              <v-col cols="3 pt-6">     <v-text-field
                  class="centered-input"
                  v-if="doctorConfig != null"
                  type="number"
                  solo
                  :rules="[
                    (v) =>  v >= 0 && v <= 59 || 'Range 0 ~ 59',
                    (v) => Number.isInteger(v) || 'Must be integer',
                       (v) =>  v != 0 || this.gaptime.hours != 0 || 'Invalid',
       
                  ]"
                  v-model.number="gaptime.minutes"
              
                ></v-text-field> </v-col>
     
                <v-col cols="auto pt-9">
                  minutes
                </v-col>
            </v-row>
          </v-col>
        </v-row>
          

          <v-row class="pl-3 pt-6" align="center">
          <v-col cols="6">
            <v-row>
              <v-col cols="6 pt-9"> Preparation time </v-col>
              <v-col cols="3 pt-6">
                <v-text-field
                  class="centered-input"
                  v-if="doctorConfig != null"
                  type="number"
                  solo
                  :rules="[
                    (v) => v > 0 && v <= 30 || 'Number must greater than 0 and less than 30',
                    (v) => Number.isInteger(v) || 'Must be integer',
                  ]"
                  v-model.number="doctorConfig.minusTimeInMinute"
              
                ></v-text-field>
              </v-col>
               <v-col cols="auto pt-9">
                  minutes
                </v-col>
            </v-row>
          </v-col>

        
        </v-row>
      </v-form>

      <v-row>
        <v-col
          ><div class="pt-10 pb-3 pl-3"><h2>User App Setting</h2></div></v-col
        >
      </v-row>

      <!-- <v-row class="pl-3">
        <v-col cols="1">Km distance</v-col>
        <v-col cols="10">
          <v-slider
            ticks="always"
            :min="minDistance"
            :max="maxDistance"
            :step="stepDistance"
            tick-size="4"
            v-model="valueDistance"
            :tick-labels="labelsDistance"
          >
          </v-slider>
        </v-col>
      </v-row> -->

      <v-row class="pl-3">
        <v-col cols="1">Km distance</v-col>
        <v-col cols="5">
          <v-combobox
            v-model="select"
            :items="items"
            label="Select distance in patient application"
            chips
            filled
            rounded
            dense
          ></v-combobox>
        </v-col>
      </v-row>

      <v-row class="pl-3">
        <v-col cols="1">
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="blue" dark v-bind="attrs" v-on="on">
                relationship
              </v-btn>
            </template>

            <v-card>
              <v-snackbar
                timeout="5000"
                v-model="snackbar"
                top
                right
                :color="type"
                outlined
                :auto-height="true"
              >
                {{ message }}

                <template v-slot:action="{ attrs }">
                  <v-btn
                    :color="type"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-snackbar>

              <v-col>
                <v-row>
                  <v-col>
                    <h3>List relationship</h3>
                  </v-col>

                  <v-dialog width="450" v-model="show">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2"
                        text
                        icon
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-form @submit.prevent ref="form" v-model="valid">
                        <v-container>
                          <v-row>
                            <v-text-field
                              prepend-icon="mdi-ab-testing"
                              class="pa-4"
                              label="Relationship name"
                              v-model="relationshipName"
                              outlined
                              dense
                              :rules="[
                                (v) =>
                                  !!(v && v.length) ||
                                  'Relationship name is required',
                              ]"
                            ></v-text-field>
                          </v-row>
                        </v-container>
                      </v-form>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="createNewRelationship()"
                        >
                          Create new relationship
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>

                <v-container grid-list-md fill-height>
                  <v-layout column>
                    <v-flex>
                      <v-layout row wrap align-content-start>
                        <v-flex
                          xs6
                          v-for="relationship in relationships"
                          :key="relationship"
                        >
                          <v-chip
                            close
                            @click:close="deleteRelationship(relationship)"
                            color="primary"
                            class="ml-1 mr-1 mb-1"
                            >{{ relationship }}</v-chip
                          >
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">
                    OK
                  </v-btn>
                </v-card-actions></v-col
              >
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-center pt-10">
          <v-btn color="primary" @click="saveConfiguration"
            >Save configuration</v-btn
          ></v-col
        >
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.fetchAppConfig();
    for (let i = this.min; i <= this.max; i = i + this.step) {
      this.labels.push(i + "s");
    }
  },
  data() {
    return {
      select: [],
      items: [2, 4, 5, 8, 10],
      validParam: false,

      gaptime : {
        hours : 0,
        minutes : 0, 
      },

      value: 30,
      min: 30,
      max: 300,
      step: 30,
      valueDistance: 5,
      minDistance: 5,
      maxDistance: 15,
      stepDistance: 5,
      labels: [],
      labelsDistance: ["5km", "10km", "15km"],
      doctorConfig: null,
      patientConfig: null,
      message: "",
      type: "success",
      snackbar: false,

      dialog: false,
      show: false,
      valid: false,
      relationshipName: null,
      relationships: [],
    };
  },
  methods: {
    async saveConfiguration() {
      this.$refs.formParam.validate();
      if (!this.validParam) {
        return;
      }

      let isSave = false;
      this.$isLoading(true);
      if (this.select.length == 0) {
        this.setSnackbar("Failed. Please select km distance", "error");
        this.$isLoading(false);
        return;
      }

      this.doctorConfig.timeout = this.value;
      
      console.log(this.gaptime.hours + (this.gaptime.minutes/60) );


      this.doctorConfig.examinationHour =  this.gaptime.hours + (this.gaptime.minutes/60)

      var doctorApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/DoctorApp",
          this.doctorConfig
        )
        .catch(function (error) {
          console.log(error);
        });

      this.patientConfig.relationShips = this.relationships;
      console.log(this.select);

      var list = [];
      if (typeof this.select != "number") {
        list.push(this.select[0]);
      } else {
        list.push(this.select);
      }

      console.log(this.select);

      this.patientConfig.distances = list;

      var patientApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/PatientApp",
          this.patientConfig
        )
        .catch(function (error) {
          console.log(error);
        });

      if (doctorApp.status == 200 && patientApp.status == 200) {
        isSave = true;
      }

      this.$isLoading(false);

      if (isSave) {
        this.setSnackbar("Save success", "success");
      } else {
        this.setSnackbar("Failed. Please try again", "error");
      }
    },

       getDecimalPart(value) {
         return value % 1.0;
    },

    async fetchAppConfig() {
      this.$isLoading(true);
      var patientApp = await axios
        .get("https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/" + 1)
        .catch(function (error) {
          console.log(error);
        });
      if (patientApp.status == 200) {
        this.patientConfig = patientApp.data;
        this.select = patientApp.data.distances;
        for (let i = 0; i < patientApp.data.relationShips.length; i++) {
          this.relationships.push(patientApp.data.relationShips[i]);
        }
      }

      var doctorApp = await axios
        .get("https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/" + 2)
        .catch(function (error) {
          console.log(error);
        });

      if (doctorApp.status == 200) {
        this.doctorConfig = doctorApp.data;
        this.value = doctorApp.data.timeout;

        this.gaptime.hours = Math.trunc(doctorApp.data.examinationHour);
        this.gaptime.minutes = this.getDecimalPart(doctorApp.data.examinationHour) * 60;

      }

      this.$isLoading(false);
    },



    createNewRelationship() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      for (let i = 0; i < this.relationships.length; i++) {
        if (
          this.relationships[i].toLowerCase().trim() ==
          this.relationshipName.toLowerCase().trim()
        ) {
          this.setSnackbar(
            "Add failed. This relationship already in system",
            "error"
          );
          this.show = false;
          return;
        } else {
          this.relationships.push(this.relationshipName);
          this.relationshipName = null;
          this.show = false;
          return;
        }
      }
    },

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },

    deleteRelationship(relationship) {
      this.$confirm(
        "Do you really want to delete this relationship" +
          " ? You cannot undo this action"
      ).then((res) => {
        if (res) {
          this.relationships = this.relationships.filter(
            (value) => value != relationship
          );
        }
      });
    },
  },
 watch: {
        'gaptime.hours' : function () {

           this.$refs.formParam.validate();
    },
      'gaptime.minutes' : function () {
  
          this.$refs.formParam.validate();
      }
    
  }
};
</script>

<style scoped>
.test {
  background-color: red;
}
.centered-input >>> input {
  text-align: center;
}
</style>