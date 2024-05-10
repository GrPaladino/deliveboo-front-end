import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
import RestaurantsList from "./pages/RestaurantsList.vue";
import RestaurantShow from "./pages/RestaurantShow.vue";
import CartView from "./pages/CartView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppHome,
    },
    {
      path: "/restaurants",
      name: "restaurants.index",
      component: RestaurantsList,
    },
    {
      path: "/restaurants/:slug",
      name: "restaurants.show",
      component: RestaurantShow,
    },

    {
      path: "/carrello",
      name: "cart.show",
      component: CartView,
    },
  ],
});

export { router };
