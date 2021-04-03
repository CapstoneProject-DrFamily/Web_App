<template>
  <v-container>
    <v-col>
      <v-snackbar
        timeout="5000"
        v-model="snackbar"
        centered
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

      <v-row
        justify="center"
        v-for="template in templates"
        :key="template.name"
      >
        <v-col cols="11">
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header
                >{{ template.name }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-col>
                  <v-row>
                    <v-col>
                      <p class="customHeader font-weight-bold pt-6 pb-6">
                        List medicine
                      </p>
                    </v-col></v-row
                  >
                  <v-row
                    justify="center"
                    v-for="medicine in template.data.prescriptionDetails"
                    :key="medicine.id"
                  >
                    <v-col cols="11">
                      <v-expansion-panels accordion>
                        <v-expansion-panel>
                          <v-expansion-panel-header
                            >{{ medicine.medicine.name }}
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-col>
                              <v-row>
                                <v-col>
                                  <v-text-field
                                    @change="onChange = true"
                                    label="Method"
                                    v-model="medicine.method"
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
                                    v-model="medicine.type"
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
                                    v-model="medicine.morningQuantity"
                                    filled
                                    rounded
                                    required
                                    readonly
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                  <v-text-field
                                    v-model="medicine.noonQuantity"
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
                                    v-model="medicine.afternoonQuantity"
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
                                    v-model="medicine.totalDays"
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
                        </v-expansion-panel> </v-expansion-panels
                    ></v-col>
                    <!-- <v-col cols="1" class="pt-5">
                      <v-btn
                        text
                        icon
                        color="red"
                        @click="remove(item.medicine.medicineId)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col> -->
                  </v-row>
                </v-col>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels></v-col
        >
        <v-col cols="1" class="pt-5">
          <v-btn
            text
            icon
            color="red"
            @click="remove(item.medicine.medicineId)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
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
    };
  },
  methods: {
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
      console.log(this.templates);
      this.$isLoading(false);
    },
  },

  components: {
    CreatePrescriptionForm,
  },
};
</script>