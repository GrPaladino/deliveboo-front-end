<script>
import { store, api } from "../store";
import axios from "axios";
import AppCard from "../components/AppCard.vue";
import Slider from "../components/Slider.vue";

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
      hoverTimeout: null,
    };
  },
  components: { AppCard, Slider },
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
      if (!this.activeTypes.includes(name)) {
        this.activeTypes.push(name);
      } else {
        this.activeTypes = this.activeTypes.filter(
          (elemento) => elemento !== name
        );
      }
      let thisButton = document.getElementById(event);
      thisButton.classList.toggle("on");
      this.filteredRestaurants(this.activeTypes);
      if (this.activeTypes.length === 0) {
        this.fetchRestaurants();
      }
    },

    thumbFilter(name) {
      if (!this.activeTypes.includes(name)) {
        this.activeTypes.push(name);
      } else {
        this.activeTypes = this.activeTypes.filter(
          (elemento) => elemento !== name
        );
      }
      let filterButtons = document.querySelectorAll(".badgeSelector");
      console.log(filterButtons);
      filterButtons.forEach((element) => {
        if (element.innerText == name) {
          element.classList.toggle("on");
        }
      });

      this.filteredRestaurants(this.activeTypes);
      if (this.activeTypes.length === 0) {
        this.fetchRestaurants();
      }
      document.getElementById("restaurantsView").scrollIntoView({
        behavior: "smooth",
      });
    },
    mouseover(index) {
      clearTimeout(this.hoverTimeout);

      this.hoverTimeout = setTimeout(() => {
        const hoverDiv = document.getElementById("list-" + index);
        hoverDiv.style.display = "flex";
      }, 650);
    },
    coordinates(e, index) {
      let hoverDiv = document.getElementById("list-" + index);
      var xOffset = e.layerX;
      var yOffset = e.layerY;

      hoverDiv.style.left = xOffset + "px";
      hoverDiv.style.top = yOffset + "px";
    },

    mouseout(index) {
      clearTimeout(this.hoverTimeout);
      const hoverDiv = document.getElementById("list-" + index);
      hoverDiv.style.display = "none";
    },
  },

  created() {
    this.fetchRestaurants();
  },

  mounted() {},
};
</script>

<template>
  <!-- JUMBO -->
  <div class="row align-items-center justify-content-center" id="jumboTron">
    <div class="jumboTextContainer col-5">
      <h2 class="display-2 title text-center mt-3 text-nowrap">
        Ordina subito con
      </h2>
      <h1 class="display-1 fw-bold my-0 title text-center">Boolivery!</h1>
      <h2 class="display-1 title text-center mb-5">🛵🍝</h2>

      <div
        class="btn-restaurant mb-3 col-12 col-md-8"
        onclick="document.getElementById('searchSection').scrollIntoView();"
      >
        <div class="btn btn--action">
          <span class="guest">Vai alla ricerca</span>
        </div>
      </div>
      <span class="text-white text-center">oppure</span>

      <span class="text-white text-center fs-4">Sei un ristoratore?</span>

      <a href="http://127.0.0.1:8000/login" class="text-center"
        ><span class="text-white text-center text-decoration-underline"
          >Accedi al tuo ristorante</span
        ></a
      >
    </div>
  </div>
  <!-- SLIDER -->
  <div id="categoriesSlider">
    <div id="waveBackground"></div>
    <div class="container">
      <Slider :types="types" @filter="thumbFilter" v-if="types.length"></Slider>
    </div>
  </div>

  <!-- RICERCA -->
  <div class="containerApp" id="searchSection">
    <!-- ROW -->
    <div class="row h-100 justify-content-center">
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
      <div class="col result-column px-3 py-4" id="restaurantsView">
        <h3 class="mb-3 title text-center">I nostri ristoranti</h3>

        <div
          class="row pe-2 d-flex justify-content-center justify-content-md-start"
        >
          <div
            v-for="(restaurant, index) in this.restaurants"
            class="col-sm-5 col-md-4 col-lg-3 p-2 mb-3 cardContainer"
          >
            <app-card
              v-if="restaurant"
              :restaurant="restaurant"
              :index="index"
              @mouseover="mouseover(restaurant.id)"
              @mouseout="mouseout(restaurant.id)"
              @mousemove="coordinates($event, restaurant.id)"
            />
            <div class="badgesContainer" :id="'list-' + restaurant.id">
              <span v-for="badge in restaurant.types" class="badge mx-2">
                {{ badge.label }}
              </span>
            </div>
          </div>

          <!-- BADGE -->
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

.row {
  margin: 0;
}
.badgesContainer {
  z-index: 999;
  position: absolute;
  border: 1px solid $secondary;
  // transform: translate(50%, -50%);
  background-color: white;
  display: none;
  flex-direction: column;
  margin: 25px;
  .badge {
    color: $secondary;
    font-size: 17px;
  }
}

#searchSection {
  width: 80%;
  overflow-x: hidden;
  margin-left: auto;
  margin-right: auto;
}

li {
  position: relative;
  min-width: 140px;
  &.on {
    color: $primary !important;
    border: 3px solid $primary !important;
    &::before {
      position: absolute;
      content: "✔";
      left: 15px;
    }
  }
}

#jumboTron {
  max-height: 65vh;
  background-image: url(../assets/img/bg_hero-wide.png);
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
        background-color: white;
        color: $primary;
        transition: all 0.5s ease 0s;
        box-shadow: 0 10px $secondary;
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
        background-color: $tertiary;
        color: white;
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
      color: $primary;
    }
  }
}

#categoriesSlider {
  position: relative;
  padding: 50px 0;
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  &::before {
    content: "";
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/wave3.svg);
    background-repeat: no-repeat;
    background-size: cover;
    filter: invert(34%) sepia(52%) saturate(2509%) hue-rotate(215deg)
      brightness(97%) contrast(99%);
  }
  .container {
    position: relative;

    .thumbnail {
      width: 200px;
      img {
        width: 200px;
      }
    }
  }
}
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  color: $secondary;
}

// TYPE BADGES

#search {
  min-width: 160px;
}

.searchColumn {
  background-color: white;
  text-align: center;
  // border-right: 2px solid rgba($primary, 0.2);

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
          color: $secondary;
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
  color: $secondary;
  font-size: 1.3rem;
  text-align: center;
  width: 80%;
  margin: 7px 0;

  border: 2px solid $secondary;
  border-radius: 500px;
}

// RESTAURANT CARDS
.result-column {
  overflow-x: hidden;
  background-color: white;
}

.cardContainer {
  position: relative;
}

.typesHover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
}
</style>
