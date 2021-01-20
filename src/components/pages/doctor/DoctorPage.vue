<template>
  <v-container fluid pt-8>
    <doctor-form></doctor-form>
    <v-simple-table class="elevation-1">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Address</th>
            <th class="text-left">Speciality</th>
            <th class="text-left">Description</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.calories }}</td>
            <td>{{ item.calories }}</td>
            <td>{{ item.calories }}</td>
            <td>{{ item.calories }}</td>
            <td>
              <v-btn tile color="success" small>
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
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
                      <v-btn color="grey" text >
                        Cancel
                      </v-btn>

                      <v-btn color="primary" text>
                        I accept
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-row justify="center">
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
  data() {
    return {
      page: 1,
      confirmDelete: false,
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
      ],
    };
  },
  methods: {
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