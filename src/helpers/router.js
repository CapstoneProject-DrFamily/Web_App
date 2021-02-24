import Vue from "vue";
import Router from "vue-router";

import LoginPage from "../components/pages/Login.vue";
import AdminPage from "../components/base/AdminBase.vue";
import DoctorBase from "../components/pages/doctor/DoctorBase.vue";


Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: LoginPage,
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/admin",
      component: AdminPage,
      children: [
        {
          path: "doctor",
          component: DoctorBase,
          
          children: [
            {
              path: "active",
              component: () => import("../components/pages/doctor/DoctorPage"), 
              
            },
            {
              path: "inactive",
              component: () => import("../components/pages/doctor/DoctorWaitingPage"), 
              
            },
          ],
        },
        {
          path: "patient",
          component: () => import("../components/pages/patient/PatientPage"),
        },
        {
          path: "medicine",
          component: () => import("../components/pages/medicine/MedicinePage"),
        },
        {
          path: "symptom",
          component: () => import("../components/pages/symptom/SymptomPage"),
        },
      ],
    },

    // otherwise redirect to home
    { path: "*", redirect: "/" },
  ],
});

// router.beforeEach((to, from, next) => {
//     // redirect to login page if not logged in and trying to access a restricted page
//     const publicPages = ['/login', '/register'];
//     const authRequired = !publicPages.includes(to.path);
//     const loggedIn = localStorage.getItem('user');

//     if (authRequired && !loggedIn) {
//       return next('/login');
//     }

//     next();
//   })
