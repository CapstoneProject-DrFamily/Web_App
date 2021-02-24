import Vue from "vue";
import App from "./App.vue";
import { router } from "./helpers/router";
import vuetify from "./plugins/vuetify";
import { store } from "./store/store";
import AxiosPlugin from "vue-axios-cors";
import loading from "vuejs-loading-screen";
import firebase from "firebase";
import VuetifyConfirm from "vuetify-confirm";

Vue.config.productionTip = false;

// firebase

var firebaseConfig = {
  apiKey: "AIzaSyCadMHS07YPmlL8cLT8SA0emE6R6wpc7zA",
  authDomain: "capstoneproject-5c703.firebaseapp.com",
  projectId: "capstoneproject-5c703",
  storageBucket: "capstoneproject-5c703.appspot.com",
  messagingSenderId: "73287330927",
  appId: "1:73287330927:web:cb89164f93674f65edb19a",
  measurementId: "G-9VRJ3QLK81",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");

Vue.use(AxiosPlugin);

// loading screen login
Vue.use(loading, {
  bg: "#ADD8E6ad",
  icon: "spinner",
  size: 3,
  icon_color: "white",
});

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: "Accept",
  buttonFalseText: "Cancel",
  color: "warning",
  title: "You changed didn't save yet",
  width: 350,
});
