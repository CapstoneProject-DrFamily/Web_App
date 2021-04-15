<template>
  <div class="text-center">
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

    <v-dialog width="700" v-model="dialogTemplate">
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="end" class="mr-4 mb-4 pt-3">
          <div class="my-2">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              Add Template
            </v-btn>
          </div>
        </v-row>
      </template>
      <v-img
        src="https://image.freepik.com/free-vector/medicines-drug-collection-with-banner-free-space_65709-20.jpg"
      ></v-img>
      <v-card>
        <v-col>
          <v-row>
            <v-col>
              <p class="customHeader font-weight-bold pt-6 pb-6">
                Medicine information
              </p>
            </v-col></v-row
          >

          <v-form @submit.prevent ref="form" v-model="valid">
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
                        <v-col cols="6"> Strength </v-col>
                        <v-col cols="6">
                          {{ medicine.strength }}
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6"> Activity Ingredient </v-col>
                        <v-col cols="6">
                          {{ medicine.activeIngredient }}
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
                  :rules="[(v) => !!v || 'Please enter type']"
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
                  v-model.number="prescriptionDetail.morningQuantity"
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
                  v-model.number="prescriptionDetail.noonQuantity"
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
                  v-model.number="prescriptionDetail.afternoonQuantity"
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
                  v-model.number="prescriptionDetail.totalDays"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-center pb-10">
                <v-btn depressed @click="addToPrescription">
                  Add to prescription
                </v-btn></v-col
              >
            </v-row>
          </v-form>

          <v-row>
            <v-col> <v-divider></v-divider></v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="customHeader font-weight-bold pt-6 pb-6">
                List medicine
              </p>
            </v-col></v-row
          >
          <v-row
            justify="center"
            v-for="item in template"
            :key="item.medicine.medicineId"
          >
            <v-col cols="11">
              <v-expansion-panels accordion>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    >{{ item.medicine.name }}
            
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-col>
                      <v-row>
                        <v-col>
                          <v-text-field
                            @change="onChange = true"
                            label="Method"
                            v-model="item.prescriptionDetail.method"
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
                            @change="onChange = true"
                            label="Type"
                            v-model="item.prescriptionDetail.type"
                            prepend-icon="mdi-shape"
                            filled
                            rounded
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="4">
                          <v-text-field
                            :rules="rules"
                            label="Morning"
                            type="number"
                            v-model.number="
                              item.prescriptionDetail.morningQuantity
                            "
                            filled
                            rounded
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            :rules="rules"
                            v-model.number="
                              item.prescriptionDetail.noonQuantity
                            "
                            label="Noon"
                            filled
                            rounded
                            required
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            :rules="rules"
                            label="Afternoon"
                            v-model.number="
                              item.prescriptionDetail.afternoonQuantity
                            "
                            type="number"
                            filled
                            rounded
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-text-field
                            :rules="rules"
                            @change="onChange = true"
                            label="Total Days"
                            prepend-icon="mdi-calendar-month"
                            v-model.number="item.prescriptionDetail.totalDays"
                            filled
                            rounded
                            required
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel> </v-expansion-panels
            ></v-col>
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

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-row>
                <v-col class="d-flex justify-center pt-10 pb-10">
                  <v-btn color="success" v-bind="attrs" v-on="on" @click="validateMedicine">
                    Create
                  </v-btn></v-col
                >
              </v-row>
            </template>

            <v-form ref="formDisease" v-model="validTemplate" @submit.prevent>
              <v-card>
                <v-container>
                  <v-row>
                    <v-col cols="10"
                      ><v-card-title>Template</v-card-title></v-col
                    >
                    <v-col cols="2" class="pt-6 pl-6">
                      <v-btn icon @click="dialog = false">
                        <v-icon>mdi-window-close</v-icon>
                      </v-btn>
                    </v-col>

                    <v-text-field
                      prepend-icon="mdi-ab-testing"
                      class="pa-4"
                      label="Name"
                      v-model="templateName"
                      outlined
                      dense
                      :rules="[(v) => !!(v && v.length) || 'Name is required']"
                    ></v-text-field>
                  </v-row>

                  <v-row class="pl-1 pr-1">
                    <v-col>
                      <v-autocomplete
                        v-model="disease"
                        :loading="loadingDisease"
                        :items="listDisease"
                        item-text="diseaseName"
                        return-object
                        prepend-icon="mdi-magnify"
                        :search-input.sync="searchDisease"
                        hint="Choose disease"
                        clearable
                        chips
                        outlined
                        dense
                        :rules="[() => !!this.disease || 'Disease is required']"
                      ></v-autocomplete
                    ></v-col>
                  </v-row>
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="createTemplate">
                    Create template
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import APIHelper from "../../../helpers/api";
export default {
  mounted() {
    this.medicine = null;
    this.fetchMedicines(1, this.pazeSize, "");
    this.fetchDisease(1, this.pazeSize, "");
  },
  props: ["templates", "doctorConfig"],
  data() {
    return {
      templateName: null,
      search: null,
      searchDisease: null,
      valid: false,
      validTemplate: false,
      loading: false,
      loadingDisease: false,
      pazeSize: 10,
      items: ["1", "2"],

      rules: [
        (v) => Number.isInteger(v) || "The value must be an integer number",
        (v) => v >= 0 || "Number should be equal or greater than 0",
      ],

      dialog: false,
      dialogTemplate: false,
      message: "",
      type: "success",
      snackbar: false,

      disease: null,

      medicine: {
        medicineId: null,
        form: null,
        strength: null,
        name: null,
        activeIngredient: null,
      },

      prescriptionDetail: {
        method: null,
        type: null,
        morningQuantity: 0,
        noonQuantity: 0,
        afternoonQuantity: 0,
        totalDays: null,
        totalQuantity: 0,
      },

      data: {
        medicine: null,
        prescriptionDetail: null,
      },

      listDisease: [],
      listMedicines: [],
      template: [],
    };
  },
  watch: {
    search: function () {
      if (this.search == null && this.medicine != null) {
        return;
      } else {
        this.fetchMedicines(1, 10, this.search);
      }
    },
    searchDisease: function () {
      if (this.searchDisease == null) {
        return;
      } else this.fetchDisease(1, 10, this.searchDisease);
    },
  },
  methods: {
    remove(medicineId) {
      this.template = this.template.filter(
        (item) => item.medicine.medicineId != medicineId
      );
    },

    async createTemplate() {
      this.$refs.formDisease.validate();

      if (!this.validTemplate) {
        return;
      }

      this.templateName = this.disease.diseaseCode+"-" + this.templateName;

      for (let i = 0; i < this.templates.length; i++) {
        if (
          this.templates[i].name.toLowerCase().trim() ==
          this.templateName.toLowerCase().trim()
        ) {
          this.templateName = null,
          this.setSnackbar("Add failed. Please choose another name", "error");
          return;
        }
      }
    
      let data = {
        prescriptionId: null,
        description: null,
        diseaseId: this.disease.diseaseCode,
        insBy: "Admin",
        updBy: "Admin",
        prescriptionDetails: [],
      };
            this.$isLoading(true);
      for (let i = 0; i < this.template.length; i++) {
        let detail = this.template[i]["prescriptionDetail"];
        detail["prescriptionDetailId"] = 0;
        detail["prescriptionId"] = null;
        detail["medicineId"] = this.template[i]["medicine"]["medicineId"];

        console.log(this.template[i]["medicine"]);
        detail["medicine"] = this.template[i]["medicine"];
        // console.log(detail);
        data.prescriptionDetails.push(detail);
      }

      data.description = this.disease.diseaseName;

      this.doctorConfig.prescriptionTemplates[this.templateName] = data;
      console.log(this.doctorConfig);

      var doctorApp = await axios
        .put(
          "https://capstoneapi-dev.azurewebsites.net/api/AppConfigs/DoctorApp",
          this.doctorConfig
        )
        .catch(function (error) {
          console.log(error);
        });

      console.log(doctorApp.status);
      var isCreated = false;
      if (doctorApp.status == 200) {
        isCreated = true;
      }
        this.templateName = null,
        this.disease = null,

        this.$isLoading(false);
                  this.dialog = false;
      this.dialogTemplate = false;
              this.$emit("created", isCreated);
    },

    resetForm(data) {
      this.$refs.form.resetValidation();
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

    setSnackbar(message, type) {
      this.snackbar = true;
      this.message = message;
      this.type = type;
    },

    addToPrescription() {
      // check if not select medicine yet
      if (this.medicine == null) {
        this.setSnackbar("Add failed. Please choose medicine first", "error");
        return;
      }

      // check if already in template
      for (let i = 0; i < this.template.length; i++) {
        console.log(this.template[i]);
        if (this.template[i].medicine.medicineId == this.medicine.medicineId) {
          this.setSnackbar(
            "Add failed. This medicine already in template",
            "error"
          );
          return;
        }
      }

      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }

      this.data.medicine = this.medicine;

      this.data.prescriptionDetail = this.prescriptionDetail;

      this.template.push(JSON.parse(JSON.stringify(this.data)));

      this.search = "";

      this.medicine = null;
      this.resetForm(this.prescriptionDetail);
    },

    async fetchDisease(page, pageSize, value) {
      this.loadingDisease = true;
      this.listDisease = [];

      var url =
        value == null
          ? APIHelper.getAPIDefault() +
            "Diseases/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize
          : APIHelper.getAPIDefault() +
            "Diseases/paging?PageIndex=" +
            page +
            "&PageSize=" +
            pageSize +
            "&SearchValue=" +
            value;

      var response = await axios.get(url).catch(function (error) {
        console.log(error);
      });

      if (response.status == 200) {
        for (let i = 0; i < response.data["diseases"].length; i++) {
          this.listDisease.push(response.data["diseases"][i]);
        }
      }

      this.loadingDisease = false;
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
};
</script>