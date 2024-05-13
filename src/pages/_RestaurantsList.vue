<script>
import { store, api } from "../store";

import axios from "axios";
import AppCard from "../components/AppCard.vue";

export default {
  data() {
    return {};
  },

  components: { AppCard },
  methods: {
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

    search(name) {
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
      let buttons = document.querySelectorAll(".badge");

      buttons.forEach((button) => {
        button.classList.add("off");
        if (this.activeTypes.includes(button.innerText)) {
          button.classList.toggle("off");
        }
      });

      this.filteredRestaurants(this.activeTypes);
      if (this.activeTypes.length == 0) {
        console.log("è vuotoooooooo");
        this.fetchRestaurants();
        buttons.forEach((button) => {
          button.classList.remove("off");
        });
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
  <div class="containerApp">
    <!-- ROW -->
    <div class="row">
      <!-- Search column -->
      <div class="col-2 col-md-3 searchColumn d-flex flex-column py-4 px-1">
        <h3 class="mb-3 title d-none d-lg-block">Cucina</h3>

        <!-- Type Badges for search -->
        <div class="badges-wrapper container-fluid justify-content-md-start">
          <div
            class="badge"
            v-for="badge in types"
            :style="
              `background-image:url(` +
              badge.image +
              `); background-size: cover; background-repeat: no-repeat; padding: 30px;`
            "
          >
            <div class="badgeContainer">
              <div class="imgBadge me-2">
                <!-- <img
                  @click="search(badge.label)"
                  :src="badge.image"
                  :alt="badge.name"
                /> -->
              </div>
              <div
                @click="search(badge.label)"
                class="label h-100 w-100 d-none d-md-block"
                :for="badge.id"
              >
                {{ badge.label }}
              </div>
            </div>
          </div>
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

.title {
  color: $darkblue;
}
.containerApp {
  min-height: calc(100vh - $headerHeight - $footerHeight);
  overflow: auto;
  overflow-x: hidden;
}

// TYPE BADGES

.searchColumn {
  background-color: white;
  text-align: center;
  height: calc(100vh - $headerHeight - $footerHeight);
  border-right: 2px solid rgba($midblue, 0.2);
  overflow: scroll;

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
</style>
