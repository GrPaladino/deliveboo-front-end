<script>
import { store, api } from "../store";

import axios from "axios";
import AppCard from "../components/AppCard.vue";

export default {
  data() {
    return {
      titleComponent: "Home Page",
      title: "Ristoranti",
      store,
      restaurants: [],
      types: [],
      searchOn: false,
      activeTypes: [],
    };
  },
  components: { AppCard },
  methods: {
    sideToggler() {
      const sidebar = document.querySelector(".sidebar");
      const sidebarToggle = document.querySelector(".sidebar-toggle");
      const mainContent = document.querySelector(".main-content");
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("collapsed");
    },
    fetchRestaurants() {
      axios.get(api.baseApiURI + "restaurants").then((response) => {
        this.restaurants = response.data.restaurants;
        this.types = response.data.types;
      });
    },

    filteredRestaurants(argument) {
      const argumentString = Array.isArray(argument)
        ? argument.join("&")
        : argument;

      axios
        .get(api.baseApiURI + "restaurants/search=" + argumentString)
        .then((response) => {
          this.restaurants = response.data.restaurants;
        });
    },

    search(name, event) {
      console.log(
        "ho cliccato: " + name + " " + "Tipi attivi ora: " + this.activeTypes
      );
      if (!this.activeTypes.includes(name)) {
        this.activeTypes.push(name);
        console.log("non c'era " + this.activeTypes);
      } else {
        this.activeTypes = this.activeTypes.filter(
          (elemento) => elemento !== name
        );
        console.log("c'era " + this.activeTypes);
      }
      let thisButton = document.getElementById(event);
      thisButton.classList.toggle("on");
      this.filteredRestaurants(this.activeTypes);

      if (this.activeTypes.length === 0) {
        this.fetchRestaurants();
      }
    },
  },

  created() {
    this.fetchRestaurants();
  },

  mounted() {},
};
</script>

<template>
  <div class="row align-items-center" id="jumboTron">
    <div class="col-sm-12 col-md-6 jumboTextContainer">
      <h2 class="display-2 title text-center">
        Ordina subito con Boolivery! 🛵🍝
      </h2>

      <h5 class="title">oppure</h5>
      <h3 class="display-5 title">Sei un ristoratore?</h3>
      <!-- BUTTON -->
      <div class="btn-restaurant mb-3 col-8">
        <a class="btn btn--action" href="http://127.0.0.1:8000/login"
          ><span class="user">Accedi al tuo account</span></a
        >
      </div>
    </div>
  </div>
  <div class="containerApp">
    <!-- ROW -->
    <div class="row">
      <!-- Search column -->
      <div class="col-2 col-md-2 searchColumn" id="search">
        <h3 class="my-3 title">Filtri</h3>

        <ul class="d-flex flex-column align-items-center">
          <li
            v-for="badge in types"
            class="badgeSelector"
            :id="badge.label"
            @click="search(badge.label, $event.target.id)"
          >
            {{ badge.label }}
          </li>
        </ul>
        <div class="sidebar-toggle" @click="sideToggler()">
          <span class="navbar-toggler-icon"></span>
        </div>
      </div>

      <!-- Results column -->
      <div class="col result-column px-3 py-4">
        <h3 class="mb-3 title text-center">I nostri ristoranti</h3>

        <div
          class="row pe-2 d-flex justify-content-center justify-content-md-start"
        >
          <div
            v-for="(restaurant, index) in this.restaurants"
            class="col-sm-5 col-md-4 col-xl-3 p-2 mb-3 cardContainer"
          >
            <app-card :restaurant="restaurant" :index="index" class="h-100" />
          </div>

          <div v-if="this.restaurants.length == 0">
            <p class="text-center text-secondary">
              Nessun risultato corrispondente. 😓
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;
@use "../style/partials/variables" as *;

li {
  position: relative;
  min-width: 140px;
  &.on {
    color: green !important;
    border: 3px solid green !important;
    &::before {
      position: absolute;
      content: "✔";
      left: 15px;
    }
  }
}

#jumboTron {
  // min-height: calc(100vh - $headerHeight - $footerHeight);
  background-image: url(../assets/img/jumbo-2.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  .jumboTextContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 60px 20px;
    border-radius: 3px;

    // BUTTONS
    .btn-restaurant {
      .btn--action {
        font-size: 1.5rem;
        display: block;
        padding: 1rem;
        border-radius: 100px;
        background-color: $midblue;
        color: white;
        transition: all 0.5s ease 0s;
        box-shadow: 0 10px $darkblue;
      }

      .btn--action span {
        display: inline-block;
        position: relative;
        transition: all 0.5s ease;
      }

      .btn--action span::before {
        display: inline-block;
        position: absolute;
        top: 50%;
        font-size: 2rem;
        transform: translate(-100%, -50%);
        left: 1.5rem;
        opacity: 0;
        transition: all 0.1s ease 0s;
      }
      .btn--action .guest::before {
        content: "🍔";
      }
      .btn--action .user::before {
        content: "🧑🏻‍🍳";
      }
      .btn--action:hover {
        background-color: $darkblue;
      }

      .btn--action:hover span {
        padding-left: 1.5rem;
      }

      .btn--action:hover span:before {
        left: 0;
        opacity: 1;
      }

      .btn--action:active {
        transform: translateY(5px);
      }
    }
    .title {
      color: $midblue;
      margin-bottom: 30px;
      // text-shadow: -2px -2px 15px #4477d5, 2px -2px 15px #4477d5,
      //   -2px 2px 15px #4477d5, 2px 2px 15px #4477d5;
    }
  }
}

.title {
  color: $darkblue;
}
.containerApp {
  min-height: calc(100vh - $headerHeight - $footerHeight);
  overflow: auto;
  overflow-x: hidden;
}

// TYPE BADGES

#search {
  min-width: 160px;
}

.searchColumn {
  background-color: white;
  text-align: center;
  height: calc(100vh - $headerHeight - $footerHeight);
  border-right: 2px solid rgba($midblue, 0.2);
  position: relative;

  .title {
    width: 30%;
    margin: 0 auto;
  }

  .badges-wrapper {
    display: flex;
    padding: 0 10%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .badge {
      display: block;
      width: 100%;
      margin: 10px 0;

      .badgeContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        .imgBadge {
          width: 100%;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .label {
          color: $darkblue;
          text-align: left;
          font-size: large;
          font-weight: 100;
          cursor: pointer;
        }
      }
    }
  }
}

.badgeSelector {
  cursor: pointer;
  color: $darkblue;
  font-size: 1.3rem;
  text-align: center;
  width: 80%;
  margin: 7px 0;

  border: 2px solid $darkblue;
  border-radius: 500px;
}

// RESTAURANT CARDS
.result-column {
  height: calc(100vh - $headerHeight - $footerHeight);
  overflow: auto;
  background-color: white;
  .cardContainer {
    display: flex;
    flex-direction: column;
    // flex-wrap: wrap;
  }
}

// SIDEBAR

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  transition: width 0.3s ease-in-out;
}

.sidebar.collapsed {
  width: 50px;
}

.sidebar.collapsed.sidebar-brand,
.sidebar.collapsed.sidebar-nav li {
  display: none;
}

.sidebar.collapsed.sidebar-brand.collapsed,
.sidebar.collapsed.sidebar-nav li.collapsed {
  display: block;
}

.sidebar-brand {
  padding: 1rem;
  text-align: center;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
}

.sidebar-nav li a {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.sidebar-nav li a:hover {
  background-color: #ddd;
}

.sidebar-toggle {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  cursor: pointer;
}

.main-content {
  margin-left: 250px;
  padding: 1rem;
  transition: margin-left 0.3s ease-in-out;
}

.main-content.collapsed {
  margin-left: 50px;
}
</style>
