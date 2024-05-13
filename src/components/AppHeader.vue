<script>
// import { store } from "../store";
export default {
  data() {
    return {
      // store,
    };
  },

  methods: {},
};
</script>

<template>
  <nav class="headerNav navbar navbar-expand-lg">
    <div class="container-md d-flex">
      <ul class="navbar-ul">
        <li class="nav-item me-4">
          <router-link
            :to="{ name: 'home' }"
            class="nav-link text-white"
            aria-current="page"
          >
            <a class="navbar-brand"
              ><img src="../assets/img/boolivery_manager.svg" alt="" /></a
          ></router-link>
          <a href="#"><i class="fa-solid fa-cart-shopping"></i></a>
        </li>
        <li class="nav-item me-4">
          <router-link
            :to="{ name: 'home' }"
            class="nav-link text-white"
            aria-current="page"
            >Home</router-link
          >
        </li>
      </ul>
      <ul class="chart-icon">
        <li>
          <a href="#"><i class="fa-solid fa-cart-shopping chart-icon"></i></a>
        </li>
      </ul>

      <!-- <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              :to="{ name: 'home' }"
              class="nav-link text-white"
              aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'restaurants.index' }"
              class="nav-link text-white"
              href="#"
              >Ristoranti</router-link
            >
          </li>
        </ul>
      </div> -->
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;
@use "../style/partials/variables" as *;

.headerNav {
  height: $headerHeight;
  box-shadow: 0 0 5px black;
  background: $midblue;

  .navbar-ul {
    // width: 100%;
    @include d-flex-center;
  }

  img {
    height: 50px;
  }

  a:hover {
    transform: scale(1.1);
    transition: all 0.1s ease 0.1s;
  }

  .chart-icon li {
    width: 50px;
    height: 50px;
    color: white;
  }
}
</style>
