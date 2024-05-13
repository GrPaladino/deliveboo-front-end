import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
import RestaurantShow from "./pages/RestaurantShow.vue";
import CartCheckout from "./pages/CartCheckout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppHome,
    },

    {
      path: "/restaurants/:slug",
      name: "restaurants.show",
      component: RestaurantShow,
    },
    {
      path: "/:slug/checkout",
      name: "restaurants.checkout",
      component: CartCheckout,
    },
  ],
});

export { router };
