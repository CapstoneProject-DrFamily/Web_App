<template>
  <v-container>
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

      <v-row class="d-flex justify-end">
        <create-prescription-form
          :templates="templates"
          :doctorConfig="doctorConfig"
          @created="createNewTemplate"
        ></create-prescription-form
      ></v-row>

      <!-- 
     test -->
      <v-row v-for="(list, key) in Array.from(mapTemplates)" :key="key">
        <v-col cols="10">
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h3>{{ list[0] }} {{ list[1][0].data.description }}</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col> List template</v-col>
                </v-row>

                <v-row
                  justify="center"
                  v-for="template in list[1]"
                  :key="template.name"
                >
                  <v-col cols="11">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <h4>{{ template.name }}</h4>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-col>
                            <v-row
                              v-for="data in template.data[
                                'prescriptionDetails'
                              ]"
                              :key="data.medicine.name"
                            > 
                            <v-col>   <v-row class="pa-3">
                                <v-col>{{ data.medicine.name }}</v-col>
                                <v-col
                                  >Morning : {{ data.morningQuantity }}</v-col
                                >
                                <v-col>Noon : {{ data.noonQuantity }}</v-col>
                                <v-col
                                  >Afternoon :
                                  {{ data.afternoonQuantity }}</v-col
                                >
                              </v-row>
                                <v-row class="pl-3 pr-3">
                                <v-col></v-col>
                                <v-col
                                  >Type : {{ data.morningQuantity }}</v-col
                                >
                                <v-col>Method : {{ data.noonQuantity }}</v-col>
                                <v-col
                                  >Total Days :
                                  {{ data.totalDays }}</v-col
                                >
                              </v-row> 
                             
                              </v-col>
                           
                              

                              <!-- <v-col cols="11">
                              <v-expansion-panels accordion>
                                <v-expansion-panel>
                                  <v-expansion-panel-header>
                                    <v-row>
                                      <v-col>
                                              {{ data.medicine.name }} 
                                      </v-col>
                                
                                    </v-row>
                              
                                  </v-expansion-panel-header>

                                  <v-expansion-panel-content>
                                    <v-col>
                                      <v-row>
                                        <v-col>
                                          <v-text-field
                                            @change="onChange = true"
                                            label="Method"
                                            v-model="data.method"
                                            prepend-icon="mdi-cup-water"
                                            filled
                                            rounded
                                            required
                                            readonly
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>

                                      <v-row>
                                        <v-col>
                                          <v-text-field
                                            @change="onChange = true"
                                            label="Type"
                                            v-model="data.type"
                                            prepend-icon="mdi-shape"
                                            filled
                                            rounded
                                            required
                                            readonly
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>

                                      <v-row>
                                        <v-col cols="4">
                                          <v-text-field
                                            label="Morning"
                                            type="number"
                                            v-model="data.morningQuantity"
                                            filled
                                            rounded
                                            required
                                            readonly
                                          ></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                          <v-text-field
                                            v-model="data.noonQuantity"
                                            label="Noon"
                                            filled
                                            rounded
                                            required
                                            readonly
                                            type="number"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                          <v-text-field
                                            label="Afternoon"
                                            v-model="data.afternoonQuantity"
                                            type="number"
                                            filled
                                            rounded
                                            required
                                            readonly
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>

                                      <v-row>
                                        <v-col>
                                          <v-text-field
                                            @change="onChange = true"
                                            label="Total Days"
                                            prepend-icon="mdi-calendar-month"
                                            v-model="data.totalDays"
                                            filled
                                            rounded
                                            required
                                            readonly
                                            type="number"
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-col> -->
                            </v-row>
                          </v-col>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels></v-col
                  >

                  <v-col cols="1" class="pt-5">
                    <v-btn text icon color="red" @click="remove(template.name)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels></v-col
        >
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import CreatePrescriptionForm from "./CreatePrescriptionForm.vue";
import axios from "axios";

export default {
  mounted() {
    this.fetchAppConfig();
  },

  data() {
    return {
      templates: [],
      doctorConfig: null,
      message: "",
      type: "success",
      snackbar: false,

      mapTemplates: null,
    };
  },
  methods: {
    async remove(templateName) {
      console.log(templateName);

      this.$confirm(
        "Do you really want to delete " +
          templateName +
          " ? You cannot undo this action"
      ).then(async (res) => {
        if (res) {
          let isSave = false;
          this.$isLoading(true);
          delete this.doctorConfig["prescriptionTemplates"][templateName];
          var doctorApp = await axios
            .put(
              "https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/DoctorApp",
              this.doctorConfig
            )
            .catch(function (error) {
              console.log(error);
            });

          if (doctorApp.status == 200) {
            isSave = true;
          }
          this.$isLoading(false);

          if (isSave) {
            this.fetchAppConfig();
            this.setSnackbar("Delete success", "success");
          } else {
            this.setSnackbar("Failed. Please try again", "error");
          }
        }
      });
    },

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },
    async createNewTemplate(isCreated) {
      if (isCreated) {
        this.fetchAppConfig();
        this.setSnackbar("Add success", "success");
      } else {
        this.setSnackbar("Add failed", "error");
      }
    },

    async fetchAppConfig() {
      this.$isLoading(true);
      this.templates = [];
      var doctorApp = await axios
        .get("https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/" + 2)
        .catch(function (error) {
          console.log(error);
        });

      if (doctorApp.status == 200) {
        this.doctorConfig = JSON.parse(JSON.stringify(doctorApp.data));
        // console.log(this.doctorConfig);

        //read template
        for (var prop in doctorApp.data["prescriptionTemplates"]) {
          if (
            Object.prototype.hasOwnProperty.call(
              doctorApp.data["prescriptionTemplates"],
              prop
            )
          ) {
            let property = {
              name: prop,
              data: doctorApp.data["prescriptionTemplates"][prop],
            };
            this.templates.push(property);
          }
        }
      }
      this.mapTemplates = new Map();

      for (let i = 0; i < this.templates.length; i++) {
        let name = this.templates[i].name.split("-")[0];
        console.log(name);
        if (!this.mapTemplates.has(name)) {
          let list = [];
          list.push(this.templates[i]);
          this.mapTemplates.set(name, list);
        } else {
          let list = this.mapTemplates.get(name);
          list.push(this.templates[i]);
          this.mapTemplates.set(name, list);
        }
        // this.mapTemplates[name[0]] = this.templates[i].data;
      }

      console.log(this.mapTemplates);
      this.$isLoading(false);
    },
  },

  components: {
    CreatePrescriptionForm,
  },
};
</script>