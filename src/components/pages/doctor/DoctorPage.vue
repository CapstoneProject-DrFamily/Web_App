<template>
  <v-container fluid pt-8>
    <v-row no-gutters justify="center">
      <v-col cols="8">
        <v-text-field
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          filled
          dense
          color="blue"
          solo
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <div class="pt-1 pl-1">
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <doctor-form></doctor-form>

    <v-simple-table class="elevation-1">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Image</th>
            <th class="text-left">Name</th>
            <th class="text-left">Speciality</th>
            <th class="text-left">Email</th>

            <th class="text-left"></th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="doctor in doctors" :key="doctor.name">
            <td class="pt-6 pb-6">
              <v-img
                src="https://picsum.photos/id/11/500/300"
                width="100"
                height="100"
              ></v-img>
            </td>
            <td>{{ doctor.name }}</td>
            <td>{{ doctor.email }}</td>
            <td>{{ doctor.email }}</td>
            <td>
              <div class="text-center">
                <v-btn tile color="info" small>
                  <v-icon> mdi-information-outline </v-icon>
                </v-btn>
              </div>
            </td>
            <td>
              <div class="text-center">
                <v-btn tile color="success" small>
                  <v-icon> mdi-pencil </v-icon>
                </v-btn>
              </div>
            </td>
            <td>
              <div class="text-center">
                <v-dialog width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn tile color="error" small v-bind="attrs" v-on="on">
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">
                      Confirm delete this doctor
                    </v-card-title>

                    <v-card-text>
                      <div class="pa-4">You cannot undo this action.</div>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey" text> Cancel </v-btn>

                      <v-btn color="primary" text> I accept </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="text-center pt-6" v-if="loading">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>

    <v-row justify="center" v-if="!loading">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination v-model="page" class="my-4" :length="15"></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DoctorForm from "./CreateDoctorForm.vue";

export default {
  mounted() {
    this.fetchDoctor();
  },

  data() {
    return {
      loading: false,
      page: 1,
      confirmDelete: false,
      doctors: [],
    };
  },
  methods: {
    async fetchDoctor() {
      this.loading = true;
      await new Promise((resolve) => setTimeout(resolve, 500));

      for (let i = 1; i < 6; i++) {
        let doctor = {
          name: "Bác sĩ " + i,
          email: "bacsi" + i + "@doctor.com",
        };
        this.doctors.push(doctor);
      }
      this.loading = false;
    },

    addDoctor() {},
    delete(id) {
      console.log(id);
    },
  },
  components: {
    DoctorForm,
  },
};
</script>

<style scoped>
</style>