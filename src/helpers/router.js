import Vue from "vue";
import Router from "vue-router";


Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: () => import("../components/pages/Login"),
    },
    {
      path: "/login",
      component: () => import("../components/pages/Login"),
    },
    {
      path: "/admin",
      component: () => import("../components/base/AdminBase"),
      children: [
        {
          path: "doctor",
          component: () => import("../components/pages/doctor/DoctorBase"),
          
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
          path: "specialty",
          component: () => import("../components/pages/symptom/SymptomPage"),
        },
        {
          path: "service",
          component: () => import("../components/pages/service/ServicePage"),
        },
        {
          path: "transaction",
          component: () => import("../components/pages/transaction/TransactionPage"),
        },
        {
          path: "prescription",
          component: () => import("../components/pages/prescription/PrescriptionPage"),
        },
        {
          path: "configuration",
          component: () => import("../components/pages/configuration/ConfigurationPage"),
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
