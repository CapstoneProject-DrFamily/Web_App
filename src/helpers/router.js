import Vue from "vue";
import Router from "vue-router";

import LoginPage from "../components/pages/Login.vue";
import AdminPage from "../components/base/AdminBase.vue";

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
