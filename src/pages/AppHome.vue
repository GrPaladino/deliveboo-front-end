<script>
import { store, api } from "../store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
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

  //   watch: {
  //   restaurant: {
  //     handler() {
  //       if (this.restaurant && this.filled === false) {
  //         // console.log("watcher");
  //         this.filled = true;
  //         setTimeout(this.cartQuantity, 300);
  //       }
  //     },
  //     deep: true,
  //   },
  //   myOrder: {
  //     handler() {
  //       if (this.myOrder && this.cartCheck === true) {
  //         localStorage.setItem("myOrder", JSON.stringify(this.myOrder));
  //   //       this.myOrder.dishes.forEach(dish => {

  //   //      store.orderQuantity = store.orderQuantity + dish.quantity;
  //   //    }
  //   //  );
  //         // console.log("Pushed to storage");
  //       }
  //       if (this.myOrder.dishes && this.myOrder.dishes.length == 0) {
  //         this.myOrder = [];
  //         localStorage.removeItem("myOrder");
  //         // console.log("Removed from storage");
  //       }
  //     },
  //     deep: true,
  //   },
  // },
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
  <div class="wrapper">
    <div class="row align-items-center" id="jumboTron">
      <div class="jumboTextContainer col-md-8">
        <h2 class="display-2 title text-center col-8">
          Ordina subito con Boolivery! 🛵🍝
        </h2>

        <div
          class="btn-restaurant mb-3 col-8"
          onclick="document.getElementById('searchSection').scrollIntoView();">
          <div class="btn btn--action">
            <span class="guest">Vai alla ricerca</span>
          </div>
        </div>
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

    <div class="containerApp" id="searchSection">
      <!-- ROW -->
      <div class="row main-row">
        <!-- Search column -->
        <div class="col-5 col-sm-4 col-md-3 col-lg-2 searchColumn" id="search">
          <h3 class="my-3 title">Filtri</h3>

          <ul class="d-flex flex-column align-items-center">
            <li
              v-for="badge in types"
              class="badgeSelector"
              :id="badge.label"
              @click="search(badge.label, $event.target.id)">
              {{ badge.label }}
            </li>
          </ul>
          <div class="sidebar-toggle" @click="sideToggler()">
            <span class="navbar-toggler-icon"></span>
          </div>
        </div>

        <!-- Results column -->
        <div class="col-7 col-sm-8 col-md-9 col-lg-10 result-column px-5 py-4">
          <h3 class="mb-3 title text-center">I nostri ristoranti</h3>
          <!-- bottone scrollTop -->

          <div
            class="row pe-2 d-flex justify-content-center justify-content-md-start">
            <div
              v-for="(restaurant, index) in this.restaurants"
              class="col-sm-5 col-md-4 col-xl-3 p-2 mb-3 cardContainer">
              <app-card :restaurant="restaurant" :index="index" class="h-100" />
            </div>

            <div v-if="this.restaurants.length == 0">
              <p class="text-center text-secondary">
                Nessun risultato corrispondente. 😓
              </p>
            </div>
            <!-- bottone per lo scrollOnTop -->
            <div
              class="btn-back-to-top mb-3 col-12 col-md-8 btn btn-demetrio"
              onclick="window.scrollTo({ top: 0});">
              <div class="btn btn--action">
                <span class="listR">↑ Torna in cima</span>
              </div>
            </div>
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
  height: calc(100vh - $headerHeight);
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
  }

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
    color: white;
    margin-bottom: 30px;
    // text-shadow: -2px -2px 15px #4477d5, 2px -2px 15px #4477d5,
    //   -2px 2px 15px #4477d5, 2px 2px 15px #4477d5;
  }
}

.title {
  color: $darkblue;
}

.containerApp {
  /*   min-height: 100vh;
  overflow: auto; */
  overflow-x: hidden;
  padding-top: $headerHeight;
}

// TYPE BADGES

/* #search {
  min-width: 160px;
} */

.searchColumn {
  background-color: white;
  text-align: center;

  border-right: 2px solid rgba($midblue, 0.2);
  position: relative;
  /*   overflow: scroll; */

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

// bottone che porta giù alla pagina
#searchSection {
  min-height: 100vh;
}

//bottone per lo scrollUp

.btn-demetrio {
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

  .btn--action .listR::before {
    content: "🍝";
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
</style>
