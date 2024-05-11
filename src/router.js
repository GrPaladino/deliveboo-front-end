import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
/* import RestaurantsList from "./pages/RestaurantsList.vue"; */
import RestaurantShow from "./pages/RestaurantShow.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppHome,
    },
    /*     {
      path: "/restaurants",
      name: "restaurants.index",
      component: RestaurantsList,
    }, */
    {
      path: "/:slug",
      name: "restaurants.show",
      component: RestaurantShow,
    },
  ],
});

export { router };
