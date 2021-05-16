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
      <v-row v-for="(list, key) in Array.from(mapTemplates)" :key="key" >
        <v-col cols="10">
          <v-expansion-panels accordion >
            <v-expansion-panel class="card-expand">
              <v-expansion-panel-header>
                <h3 :style="{color : 'white'}">{{ list[0] }} {{ list[1][0].data.description }}</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- <v-row>
                  <v-col> List template</v-col>
                </v-row> -->
            
                <v-row
                  justify="center"
                  v-for="(template, index) in list[1]"
                  :key="template.name"
                >
                  <v-col cols="8">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <h4 >{{ template.name }}</h4>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-col>
                            <v-dialog width="700" v-model="medicineDialog">
                              <template v-slot:activator="{ on, attrs }">
                                <v-row justify="end" class="mr-4 mb-4 pt-3">
                                  <div class="my-2">
                                    <v-btn
                                      color="primary"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                  </div>
                                </v-row>
                              </template>

                              <v-card>
                                <v-col>
                                  <v-row>
                                    <v-col>
                                      <p
                                        class="customHeader font-weight-bold pt-6 pb-6"
                                      >
                                        Medicine information
                                      </p>
                                    </v-col></v-row
                                  >

                                  <v-form
                                    @submit.prevent
                                    ref="form"
                                    v-model="valid"
                                  >
                                    <v-row>
                                      <v-col>
                                        <v-autocomplete
                                          :loading="loading"
                                          :items="listMedicines"
                                          item-text="name"
                                          return-object
                                          v-model="medicine"
                                          prepend-icon="mdi-pill"
                                          clearable
                                          chips
                                          solo
                                          :search-input.sync="search"
                                        ></v-autocomplete
                                      ></v-col>
                                    </v-row>

                                    <v-row v-if="medicine != null" class="pb-6">
                                      <v-col cols="2"></v-col>
                                      <v-col cols="8">
                                        <v-card>
                                          <v-container>
                                            <v-col>
                                              <v-row>
                                                <v-col cols="6"> Name </v-col>
                                                <v-col cols="6">
                                                  {{ medicine.name }}
                                                </v-col>
                                              </v-row>

                                              <v-row>
                                                <v-col cols="6">
                                                  Strength
                                                </v-col>
                                                <v-col cols="6">
                                                  {{ medicine.strength }}
                                                </v-col>
                                              </v-row>

                                              <v-row>
                                                <v-col cols="6">
                                                  Activity Ingredient
                                                </v-col>
                                                <v-col cols="6">
                                                  {{
                                                    medicine.activeIngredient
                                                  }}
                                                </v-col>
                                              </v-row>
                                            </v-col>
                                          </v-container>
                                        </v-card>
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col>
                                        <v-text-field
                                          @change="onChange = true"
                                          label="Method"
                                          v-model="prescriptionDetail.method"
                                          prepend-icon="mdi-cup-water"
                                          filled
                                          rounded
                                          required
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col>
                                        <v-text-field
                                          :rules="[
                                            (v) => !!v || 'Please enter type',
                                          ]"
                                          label="Type"
                                          prepend-icon="mdi-shape"
                                          filled
                                          rounded
                                          required
                                          v-model="prescriptionDetail.type"
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col cols="4">
                                        <v-text-field
                                          :rules="rules"
                                          label="Morning"
                                          type="number"
                                          filled
                                          rounded
                                          required
                                          v-model.number="
                                            prescriptionDetail.morningQuantity
                                          "
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="4">
                                        <v-text-field
                                          :rules="rules"
                                          label="Noon"
                                          filled
                                          rounded
                                          required
                                          type="number"
                                          v-model.number="
                                            prescriptionDetail.noonQuantity
                                          "
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="4">
                                        <v-text-field
                                          :rules="rules"
                                          label="Afternoon"
                                          type="number"
                                          filled
                                          rounded
                                          required
                                          v-model.number="
                                            prescriptionDetail.afternoonQuantity
                                          "
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col>
                                        <v-text-field
                                          :rules="rules"
                                          label="Total Days"
                                          prepend-icon="mdi-calendar-month"
                                          filled
                                          rounded
                                          required
                                          type="number"
                                          v-model.number="
                                            prescriptionDetail.totalDays
                                          "
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col
                                        class="d-flex justify-center pb-10"
                                      >
                                        <v-btn
                                          depressed
                                          @click="
                                            addToPrescription(template, index)
                                          "
                                        >
                                          Add to prescription
                                        </v-btn></v-col
                                      >
                                    </v-row>
                                  </v-form>
                                </v-col>
                              </v-card>
                            </v-dialog>
                            <!-- <v-row class="justify-end">
                                    <v-btn>Add medicine</v-btn>
                                </v-row> -->
                            <v-row
                              v-for="data in template.data[
                                'prescriptionDetails'
                              ]"
                              :key="data.medicine.name"
                            >
                              <!-- Một hai ba bốn ngày -->
                              <v-col>
                                <v-row class="pa-3">
                                  <v-col>
                                    {{ data.medicine.name }}
                                  </v-col>
                                  <v-col cols="1" class="pt-5">
                                    <v-btn
                                      text
                                      icon
                                      color="red"
                                      @click="deleteMedicine(data, template)"
                                    >
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                                <v-row class="pa-3">
                                  <v-col
                                    >Morning :
                                    <v-text-field
                                      v-model="data.morningQuantity"
                                    >
                                    </v-text-field>
                                  </v-col>
                                  <v-col
                                    >Noon :
                                    <v-text-field v-model="data.noonQuantity">
                                    </v-text-field>
                                  </v-col>
                                  <v-col
                                    >Afternoon :
                                    <v-text-field
                                      v-model="data.afternoonQuantity"
                                    >
                                    </v-text-field
                                  ></v-col>
                                </v-row>

                                <v-row class="pa-3">
                                  <v-col
                                    >Type :
                                    <v-text-field v-model="data.type">
                                    </v-text-field
                                  ></v-col>
                                  <v-col
                                    >Method :
                                    <v-text-field v-model="data.method">
                                    </v-text-field
                                  ></v-col>
                                  <v-col
                                    >Total Days :
                                    <v-text-field v-model="data.totalDays">
                                    </v-text-field
                                  ></v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                            <v-row class="justify-center">
                              <v-btn color="primary" @click="save(template)"
                                >Save</v-btn
                              >
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
import APIHelper from "../../../helpers/api";

export default {
  mounted() {
    this.medicine = null;
    this.fetchAppConfig();
    this.fetchMedicines(1, 10, "");
  },

  data() {
    return {
      rules: [
        (v) => Number.isInteger(v) || "The value must be an integer number",
        (v) => v >= 0 || "Number should be equal or greater than 0",
      ],
      medicine: null,
      valid: false,

      search: null,
      pageSize: 10,
      templates: [],
      doctorConfig: null,
      message: "",
      type: "success",
      snackbar: false,
      medicineDialog: false,
      mapTemplates: null,
      prescriptionDetail: {
        method: null,
        type: null,
        morningQuantity: 0,
        noonQuantity: 0,
        afternoonQuantity: 0,
        totalDays: null,
        totalQuantity: 0,
      },
      listMedicines: [],
    };
  },
  methods: {
    resetForm(data, index) {
      this.$refs.form[index].resetValidation();
      for (let field in data) {
        if (
          field == "totalQuantity" ||
          field == "morningQuantity" ||
          field == "noonQuantity" ||
          field == "afternoonQuantity"
        ) {
          data[field] = 0;
        } else {
          data[field] = null;
        }
      }
    },

    async addToPrescription(template, index) {
      console.log(template);
      if (this.medicine == null) {
        this.setSnackbar("Add failed. Please choose medicine first", "error");
        return;
      }
      for (let i = 0; i < template.data.prescriptionDetails.length; i++) {
        if (
          template.data.prescriptionDetails[i].medicineId ==
          this.medicine.id
        ) {
          this.setSnackbar(
            "Add failed. This medicine already in template",
            "error"
          );
          return;
        }
      }
      this.$refs.form[index].validate();
      if (!this.valid) {
        return;
      }
      this.prescriptionDetail.medicine = this.medicine;
      this.prescriptionDetail.medicineId = this.medicine.id;
      this.prescriptionDetail.prescriptionDetailId = 0;
      this.prescriptionDetail.prescriptionId = null;
      this.prescriptionDetail.totalQuantity = 0;
      this.doctorConfig.prescriptionTemplates[template.name][
        "prescriptionDetails"
      ].push(this.prescriptionDetail);

      console.log(
        this.doctorConfig.prescriptionTemplates[template.name][
          "prescriptionDetails"
        ]
      );

       this.$isLoading(true);
      let isSave = false;
      var doctorApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/DoctorApp",
          this.doctorConfig
        )
        .catch(function (error) {
          console.log(error);
        });

      if (doctorApp.status == 200) {
        isSave = true;
      }
      this.$isLoading(false);
            this.medicine = null;
      this.resetForm(this.prescriptionDetail, index);


      if (isSave) {
        this.fetchAppConfig();
        this.setSnackbar("Success", "success");
      } else {
        this.setSnackbar("Failed. Please try again", "error");
      }

            this.medicineDialog = false;

    },

    async deleteMedicine(data, template) {
      console.log(data);
      console.log(template);

      if (
        this.doctorConfig.prescriptionTemplates[template.name][
          "prescriptionDetails"
        ].length == 1
      ) {
        this.setSnackbar(
          "Deleted Failed. Make sure your template have at least one medicine",
          "error"
        );
        return;
      }

      this.doctorConfig.prescriptionTemplates[template.name][
        "prescriptionDetails"
      ] = this.doctorConfig.prescriptionTemplates[template.name][
        "prescriptionDetails"
      ].filter(function (item) {
        return item["medicineId"] != data["medicineId"];
      });

      this.$isLoading(true);
      let isSave = false;
      var doctorApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/DoctorApp",
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
    },

    async save(template) {
      this.doctorConfig.prescriptionTemplates[template.name] = template.data;
      console.log(this.doctorConfig);
      let isSave = false;
      this.$isLoading(true);

      var doctorApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/DoctorApp",
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
        this.setSnackbar("Success", "success");
      } else {
        this.setSnackbar("Failed. Please try again", "error");
      }
    },

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
              "https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/DoctorApp",
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
        .get("https://capstoneapi-dev.azurewebsites.net/api/v1/AppConfigs/" + 2)
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
    async fetchMedicines(page, pageSize, value) {
      this.loading = true;
      this.listMedicines = [];

      var url =
        value == null
          ? APIHelper.getAPIDefault() +
            "Medicines/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize
          : APIHelper.getAPIDefault() +
            "Medicines/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize +
            "&SearchValue=" +
            value;

      var response = await axios.get(url).catch(function (error) {
        console.log(error);
      });

      if (response.status == 200) {
        for (let i = 0; i < response.data["medicines"].length; i++) {
          this.listMedicines.push(response.data["medicines"][i]);
        }
      }

      this.loading = false;
    },
  },
  watch: {
    search: function () {
      if (this.search == null && this.medicine != null) {
        return;
      } else {
        this.fetchMedicines(1, 10, this.search);
      }
    },
  },

  components: {
    CreatePrescriptionForm,
  },
};
</script>

<style scoped>
  .card-expand {
     background-image: linear-gradient(to right,#1e88e5 , #6DD5FA);
  }
</style>