<script>
import axios from "axios";

import { store, api } from "../store";
// import AppCard from "../components/AppCard.vue";

export default {
  data() {
    return {
      restaurant: null,
      filled: false,
      cartCheck: false,
      types: [],
      store,
      myOrder: [],
    };
  },
  watch: {
    restaurant: {
      handler() {
        if (this.restaurant && this.filled === false) {
          console.log("watcher");
          this.filled = true;
          setTimeout(this.cartQuantity, 500);
        }
      },
      deep: true,
    },
    myOrder: {
      handler() {
        if (this.myOrder && this.cartCheck === true) {
          localStorage.setItem("myOrder", JSON.stringify(this.myOrder));
          console.log("Pushed to storage");
        }
      },
      deep: true,
    },
  },

  methods: {
    // AXIOS CALL FOR RESTAURANT SHOW
    fetchRestaurants() {
      const restaurantSlug = this.$route.params.slug;
      axios
        .get(api.baseApiURI + `restaurants/${restaurantSlug}`)
        .then((response) => {
          this.restaurant = response.data.restaurants[0];
          this.types = response.data.restaurants[0].types;
        });
    },
    // PLUS AND MINUS BUTTONS
    quantity(operator, dish) {
      let value = document.getElementById(dish);
      if (operator == "minus" && value.value > 0) {
        if (value.value == 1) {
          let thisPlate = document.getElementById(dish);
          thisPlate.classList.add("off");
        }
        value.value--;
        let dishObject = this.restaurant.dishes.find((d) => d.id === dish);
        if (dishObject) {
          let dishInOrder = this.myOrder.dishes.find((d) => d.id === dish);
          if (dishInOrder) {
            dishInOrder.quantity--;
            if (dishInOrder.quantity === 0) {
              // Rimuovere il piatto dall'ordine se la quantità è 0
              this.myOrder.dishes = this.myOrder.dishes.filter(
                (d) => d.id !== dish
              );
            }
            this.myOrder.price -= dishObject.price;
          }
        }
      }
      if (operator == "plus") {
        if (!this.myOrder.dishes) {
          this.myOrder = {
            restaurant_id: this.restaurant.id,
            dishes: [],
            price: 0,
          };
        }
        // SE L'ID DEL RISTORANTE COMBACIA CON QUELLO NELL'ORDINE
        if (this.myOrder.restaurant_id == this.restaurant.id) {
          // SE ORDINE NON ESISTE
          // SE IL VALUE SALE
          if (value.value == 0) {
            let thisPlate = document.getElementById(dish);
            thisPlate.classList.remove("off");
          }
          value.value++;
          // console.log(this.restaurant.dishes);
          // LOGICA PLUS
          let dishObject = this.restaurant.dishes.find((d) => d.id === dish);
          if (dishObject) {
            let dishInOrder = this.myOrder.dishes.find((d) => d.id === dish);
            if (dishInOrder) {
              dishInOrder.quantity++;
            } else {
              this.myOrder.dishes.push({ ...dishObject, quantity: 1 });
            }
          }
          this.myOrder.price =
            parseFloat(this.myOrder.price) + parseFloat(dishObject.price);
        } else {
          if (
            confirm(
              "Il carrello contiene piatti di un altro ristorante! Svuotare il carrello?"
            )
          ) {
            this.myOrder = [];
          } else {
            history.back();
          }
        }
      }

      console.log(this.myOrder);
    },
    // EMPTY CART OF ALL ITEMS
    emptyCart() {
      localStorage.removeItem("myOrder");
      this.myOrder = null;
      console.log("localStorage svuotato!");
    },

    // REMOVE OFF CLASS FROM INPUTS
    getClass(event) {
      let input = document.getElementById(event);
      if (input.value > 0) {
        input.classList.remove("off");
      } else {
        input.classList.add("off");
      }
    },
    // VALIDATION FOR INPUTS
    inputValidation(event) {
      let input = document.getElementById(event);
      if (!input.value) input.value = 0;
      input.reportValidity();
    },
    // CHECK IF INPUT IS EMPTY
    isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },

    // RECOVER DATA QUANTITIES FROM ORDER
    cartQuantity() {
      if (this.restaurant) {
        console.log("partita la funzione");
        // PROVO A RECUPERARE L'ORDINE
        const orderString = localStorage.getItem("myOrder");
        // CONTROLLO SE L'ORDINE ESISTE
        if (orderString !== null) {
          console.log("Ordine trovato");
          const order = JSON.parse(orderString);
          console.log(order);
          // MYORDER UGUALE A LOCALSTORAGE
          this.myOrder = order;
          // CONTROLLO SE L'ORDINE CORRISPONDE AL RISTORANTE
          if (this.restaurant.id == order.restaurant_id) {
            console.log(this.restaurant.id);

            // SCORRO TUTTI I PIATTI E LI TROVO IN PAGINA AGGIORNANDO CLASSE E VALORE
            for (let i = 0; i < order.dishes.length; i++) {
              console.log("ciclo gli elementi");
              console.log(order.dishes[i].id);
              let dish = document.getElementById(order.dishes[i].id);
              console.log(dish);
              dish.value = order.dishes[i].quantity;
              dish.classList.remove("off");
            }
          }
        } else {
          console.log("Ordine non trovato");
        }
      }
      this.cartCheck = true;
    },

    addToCart() {},
    checkEmpty() {
      if (this.myOrder.dishes.length == 0) {
        this.myOrder = [];
        console.log("MyOrder era vuoto");
      }
    },
    euroCheck(price) {
      let formattedPrice = price.toFixed(2);
      formattedPrice = formattedPrice.replace(".", ",");
      return formattedPrice;
    },
  },

  created() {
    this.fetchRestaurants();
  },

  mounted() {},
};
</script>

<template>
  <div
    class="row justify-content-between containerApp ps-3"
    v-if="this.restaurant"
  >
    <div class="col-sm-12 col-md-3 bg-white pe-0 leftColumn">
      <router-link
        :to="{ name: 'home' }"
        class="col-lg-3 col-md-6 col-sm-12"
        id="addButton"
      >
        <!-- <div class="col-lg-3 col-md-6 col-sm-12" id="addButton"> -->
        <button class="ballButton" @click="checkEmpty()">👈🏻</button>
      </router-link>
      <!-- </div> -->
      <!-- RESTAURANT DETAILS -->
      <img :src="restaurant.image" :alt="restaurant.name" class="w-100" />
      <div class="my-3">
        <h1>
          {{ restaurant.name }}
        </h1>
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

        <div
          class="dishImage col-2"
          data-bs-toggle="modal"
          :data-bs-target="`#dish-` + dish.id"
        >
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
        </div>
        <!-- MODAL CONTENT -->
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
                <img :src="dish.image" alt="dish.name" class="modalImage" />
                <p>Descrizione: {{ dish.description }}</p>
                <h6>Prezzo: €{{ dish.price }}</h6>
              </div>
              <div
                class="modal-footer d-flex flex-column justify-content-center align-items-center"
              >
                <button
                  type="button"
                  class="btn btn-secondary mb-2"
                  data-bs-dismiss="modal"
                >
                  Chiudi
                </button>
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
          <input
            type="number"
            :id="dish.id"
            min="0"
            value="0"
            class="off"
            @keyup="getClass($event.target.id)"
            @blur="inputValidation($event.target.id)"
          />
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

    <!-- <router-link
      :to="{
        name: 'restaurants.checkout',
        params: { slug: restaurant.slug },
      }"
      class="router-link"
    > -->
    <div class="bin" @click="emptyCart()">🗑️</div>
    <div
      class="goToCart"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasScrolling"
      aria-controls="offcanvasScrolling"
    >
      🛒
    </div>

    <!-- </router-link
    > -->
  </div>

  <!-- CART OFFCANVAS -->

  <div
    class="offcanvas offcanvas-start"
    data-bs-scroll="true"
    data-bs-backdrop="false"
    tabindex="-1"
    id="offcanvasScrolling"
    aria-labelledby="offcanvasScrollingLabel"
  >
    <div class="offcanvas-header">
      <h2 class="offcanvas-title" id="offcanvasScrollingLabel">
        Il tuo carrello
      </h2>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <div v-for="dish in myOrder.dishes" class="dishCard pe-5">
        <!-- IMMAGINE -->

        <div
          class="dishImage col-2"
          data-bs-toggle="modal"
          :data-bs-target="`#dish-` + dish.id"
        >
          <img :src="dish.image" alt="dish.name" />
        </div>
        <!-- TESTO -->
        <div class="dishInfo col-6 px-2">
          <h5>{{ dish.name }}</h5>
          <p>{{ dish.description }}</p>
        </div>
        <!-- PREZZO -->
        <div class="dishPrice col-2">
          <h5>x {{ dish.quantity }}</h5>
        </div>
      </div>
    </div>
    <div
      class="offcanvas-footer d-flex flex-column justify-content-center mb-5"
      v-if="this.myOrder.dishes"
    >
      <h4 class="text-center mb-2">PREZZO TOTALE</h4>

      <h2 class="text-center mb-5">€{{ euroCheck(this.myOrder.price) }}</h2>

      <router-link
        :to="{ name: 'restaurants.checkout' }"
        class="router-link text-center"
      >
        <button type="button" class="btn btn-primary btn-lg">
          Procedi al pagamento
        </button>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;

// GO TO CART
.bin {
  position: absolute;
  background-color: red;
  border-radius: 50%;
  aspect-ratio: 1/1;
  max-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  text-shadow: 0 1px 5px black;
  right: 150px;
  bottom: 30px;

  &:hover {
    transform: scale(1.1);
    transition: all 0.08s ease 0.08s;
  }
  &:hover {
    transform: scale(1.1);
    transition: all 0.08s ease 0.08s;
  }
}

// GO TO CART
.goToCart {
  position: absolute;
  background-color: $midblue;
  border-radius: 50%;
  aspect-ratio: 1/1;
  max-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  text-shadow: 5px 5px 5px $darkblue;
  right: 30px;
  bottom: 30px;

  &:hover {
    transform: scale(1.1);
    transition: all 0.08s ease 0.08s;
  }
  &:hover {
    transform: scale(1.1);
    transition: all 0.08s ease 0.08s;
  }
}

// MODAL CLASSES

.modalImage {
  width: 100%;
  margin-bottom: 20px;
}

.containerApp {
  height: calc(100vh - $headerHeight - $footerHeight);
  background-color: white;
  overflow: auto;
  overflow-x: hidden;
}

.leftColumn {
  height: 100%;
  position: relative;
  color: $darkblue;
  background-color: white;
  text-align: center;
  // min-height: calc(100vh - $headerHeight - $footerHeight);
  border-right: 2px solid rgba($midblue, 0.2);
  border-bottom: 2px solid rgba($midblue, 0.2);
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

.blueColor {
  background-color: $midblue;
  color: white;
}
</style>
