<script>
import axios from "axios";

import { store, api } from "../store";
// import AppCard from "../components/AppCard.vue";

export default {
  data() {
    return {
      restaurant: [],

      types: [],
      store,
      /* restaurant: null, */
    };
  },

  // components: { AppCard },

  methods: {
    fetchRestaurants() {
      const restaurantSlug = this.$route.params.slug;
      axios
        .get(api.baseApiURI + `restaurants/${restaurantSlug}`)
        .then((response) => {
          this.restaurant = response.data.restaurants[0];

          console.log(response.data.restaurants[0]);
          /* this.types = response.data.types; */
          this.types = response.data.restaurants[0].types;
        });
    },

    quantity(operator, dish) {
      let value = document.getElementById(dish);
      if (operator == "minus" && value.value > 0) {
        if (value.value == 1) {
          let thisPlate = document.getElementById(dish);
          thisPlate.classList.add("off");
          console.log(thisPlate);
        }
        value.value--;
      }
      if (operator == "plus") {
        if (value.value == 0) {
          let thisPlate = document.getElementById(dish);
          thisPlate.classList.remove("off");
          console.log(thisPlate);
        }
        value.value++;
      }
    },
  },

  created() {
    this.fetchRestaurants();
    // this.fetchTypes();
  },

  mounted() {},
};
</script>

<template>

  <div class="row justify-content-between containerApp p-3">

    <div class="col-sm-12 col-md-3 bg-white pe-0 leftColumn">
      <router-link
        :to="{ name: 'restaurants.index' }"
        href="#"
        class="col-lg-3 col-md-6 col-sm-12"
        id="addButton"
      >
        <!-- <div class="col-lg-3 col-md-6 col-sm-12" id="addButton"> -->
        <button class="ballButton">👈🏻</button>
      </router-link>
      <!-- </div> -->

      <!-- RESTAURANT DETAILS -->
      <img :src="restaurant.image" :alt="restaurant.name" class="w-100" />
      
      <div class="my-3">
        <h1>{{ restaurant.name }}</h1>
        <h5>☎️{{ restaurant.phone }}</h5>
        <h5 class="detailCap">🏠{{ restaurant.address }}</h5>
      </div>

      <!-- BADGE -->
      <div id="badgesContainer">
        <div class="badge" v-for="badge in types">
          <div class="typeBadge">
            <div class="badgeImg">
              <img :src="badge.image" alt="" width="100%" />
            </div>
            <span>{{ badge.label }}</span>
          </div>
        </div>
      </div>

    </div>

    <div class="col-12 col-md-9 rightColumn px-2">

      <div
        v-for="dish in restaurant.dishes"
        class="dishCard pe-5 col-12 col-md-6"
      >
        <!-- IMMAGINE -->
        <div class="dishImage col-2">
          <img :src="dish.image" alt="dish.name" />
        </div>
        <!-- TESTO -->
        <div class="dishInfo col-6 px-2">
          <h5>{{ dish.name }}</h5>
          <p>{{ dish.description }}</p>
        </div>
        <!-- PREZZO -->
        <div class="dishPrice col-2">
          <h5>€ {{ dish.price }}</h5>

          <!-- Button trigger modal -->
          <button
            type="button"
            class="btn btn-primary w-50"
            data-bs-toggle="modal"
            :data-bs-target="`#dish-` + dish.id"
          >
            <font-awesome-icon :icon="['fas', 'eye']" />
          </button>

          <!-- Modal -->
          <div
            class="modal fade"
            :id="`dish-` + dish.id"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            :aria-labelledby="`dish-` + dish.id"
            aria-hidden="true"
          >
            <div
              class="modal-dialog modal-dialog-centered position-absolute top-50 start-50 translate-middle"
            >
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">
                    Dettagli: {{ dish.name }}
                  </h5>
                  <button
                    type="button"
                    class="btn-close w-25"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <img :src="dish.image" alt="dish.name" />
                  <p>Descrizione: {{ dish.description }}</p>
                  <h6>Prezzo: €{{ dish.price }}</h6>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary mb-2"
                    data-bs-dismiss="modal"
                  >
                    Chiudi
                  </button>
                  <button type="button" class="btn btn-primary">
                    Aggiungi al carrello
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- QUANTITA -->
        <div class="amountContainer col-2">
          <button
            id="minus"
            class="quantityButton rounded-start"
            @click="quantity($event.target.id, dish.id)"
          >
            -
          </button>
          <input type="number" :id="dish.id" value="0" class="off" />
          <button
            id="plus"
            class="quantityButton rounded-end"
            @click="quantity($event.target.id, dish.id)"
          >
            +
          </button>
        </div>
      </div>

    </div>
    
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;

.containerApp {
  height: calc(100vh - $headerHeight - $footerHeight);
  background-color: white;
  overflow: auto;
  overflow-x: hidden;
}

.leftColumn {
  position: relative;
  color: $darkblue;
  background-color: white;
  text-align: center;
  // min-height: calc(100vh - $headerHeight - $footerHeight);
  border-right: 2px solid rgba($midblue, 0.2);
}

#badgesContainer {
  margin-bottom: 30px;
  .badge {
    display: inline-block;
    margin-right: 10px;

    .typeBadge {
      // border: 3px solid $midblue;
      width: 100%;
      border-radius: 50px;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 120px;
      object-fit: cover;

      span {
        z-index: 2;
        text-shadow: 0px 0px 20px black;
        font-size: 17px;
        letter-spacing: 2px;
        text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
          2px 2px 0 #000;
      }
      .badgeImg {
        position: absolute;
        width: 100%;
        filter: brightness(90%);
      }
    }
  }
}

.rightColumn {
  padding: 0;
  // height: calc(100vh - $headerHeight - $footerHeight);
  overflow: auto;
  // background-color: $midblue;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  align-content: flex-start;
}

.detailCap {
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

// BUTTON
/* BACK BUTTON */

#addButton {
  transform: translate(30%, 7%);
  position: absolute;
  left: 0;
  top: 0;
  align-items: center;
  min-height: 350px;
  text-decoration: none;

  .ballButton {
    height: 40px;
    width: 40px;
    position: relative;
    background-color: white;
    padding: 10px;
    border-radius: 50%;
    position: relative;
    font-size: 1.5rem;
    text-align: center;
    transform: translate3d(0, 0, 0);
    transition: transform ease-out 200ms;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition-duration: 400ms;
    transform: scale(1.1, 1.1) translate3d(0, 0, 0);
    cursor: pointer;
    i {
      color: #2929b9;
    }

    &:hover {
      transform: scale(1.2, 1.2) translate3d(0, 0, 0);
    }
  }
}

button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.btn-primary {
  background-color: #0d6efd;
}

.btn-secondary {
  background-color: grey;
}

// DISH CARD

.dishCard {
  &:first-of-type {
    border-top: 1px solid rgba($midblue, 0.2);
  }
  height: fit-content;
  display: flex;
  background-color: white;
  flex: 0 0 auto;
  color: $darkblue;
  .dishImage {
    height: 80px;
    width: 80px;
    overflow: hidden;
    object-fit: contain;
    display: flex;
    justify-content: center;
    img {
      height: 100%;
      width: auto;
    }
  }
  .dishInfo,
  .dishPrice {
    display: flex;
    border-bottom: 1px solid rgba($midblue, 0.2);
    flex-direction: column;
    justify-content: center;

    * {
      text-transform: capitalize;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      line-height: 30px;
      margin: 0;
    }
  }
}

// QUANTITY SELECTOR
.amountContainer {
  align-items: center;
  display: flex;
  border-bottom: 1px solid rgba($midblue, 0.2);

  // INPUT NUMBER ARROW HIDDEN
  input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    width: 50px;
    height: 30px;
    text-align: center;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  // INPUT NUMBER BUTTONS
  .quantityButton {
    flex-shrink: 0;
    height: 30px;
    width: 30px;
    background-color: $midblue;
    color: white;
    font-size: 20px;
    display: flex;
    justify-content: center;
  }

  .off {
    color: lightgray;
  }
}
</style>
