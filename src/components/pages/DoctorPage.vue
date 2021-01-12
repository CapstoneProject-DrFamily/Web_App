<template>
  <v-container fluid pt-8>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-row justify="end" class="mr-4 mb-4">
              <div class="my-2">
                <v-btn small color="primary" v-bind="attrs" v-on="on">
                  <v-icon small>mdi-plus</v-icon>
                  Add Doctor
                </v-btn>
              </div>
            </v-row>
          </template>
          <v-img
            src="https://static.vecteezy.com/system/resources/previews/000/656/917/non_2x/vector-set-of-doctor-cartoon-characters-medical-staff-team-concept-in-front-of-hospital.jpg"
            height="200px"
          ></v-img>
          <v-card>
            <v-card-title>
              <span class="headline">
                <p class="text-center">Create New Doctor</p>
              </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field label="Name*" required></v-text-field>
                <v-text-field label="Address*" required></v-text-field>
                <v-text-field label="Speciality*" required></v-text-field>
                <v-row justify="center">
                  <v-btn color="success" class="mr-4" @click="validate">
                    Validate
                  </v-btn>

                  <v-btn color="success" class="mr-4" @click="validate">
                    Validate
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

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
              <v-btn tile color="error" small>
                <v-icon> mdi-delete </v-icon>
              </v-btn>
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
export default {
  data() {
    return {
      page: 1,
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
  },
};
</script>

<style scoped>
</style>