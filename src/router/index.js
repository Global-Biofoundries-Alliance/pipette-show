import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/show/:transfercode",
    name: "Show with transfercode",
    component: () => import("../views/Show.vue"),
  },

  {
    path: "/show",
    name: "Show",
    component: () => import("../views/Show.vue"),
  },

  {
    path: "/build/:queryString",
    name: "Build with QueryString",
    
    component: () => import("../views/Build.vue"),
  },

  {
    path: "/build",
    name: "Build",
    component: () => import("../views/Build.vue"),
  },

  {
    path: "/plateholder",
    name: "PlateHolder",
    component: () => import("../views/PlateHolder.vue"),
  },

  {
    path: "/open",
    name: "Open File",
    component: () => import("../views/Open.vue"),
  },


  {
    path: "/manual",
    name: "Manual",
    component: () => import("../views/Manual.vue"),
  },

  {
    path: "/survey",
    name: "Survey",
    component: () => import("../views/Survey.vue"),
  },

  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
  },

  {
    path: "/imprint",
    name: "Imprint",
    component: () => import("../views/Imprint.vue"),
  },

  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("../views/Privacy.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
