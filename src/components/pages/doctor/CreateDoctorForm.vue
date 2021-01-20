<template>
  <div class="text-center">
    <v-dialog width="500">
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
            <v-form @submit.prevent>
              <v-text-field label="Name*" required></v-text-field>
              <v-text-field label="Address*" required></v-text-field>
              <v-text-field label="Speciality*" required></v-text-field>
              <v-row justify="center">
                <v-btn color="error" class="mr-4"> Reset </v-btn>

                <v-btn color="success" class="mr-4" type="submit">
                  Create
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>