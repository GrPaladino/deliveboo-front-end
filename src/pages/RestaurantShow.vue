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
          // console.log("watcher");
          this.filled = true;
          setTimeout(this.cartQuantity, 300);
        }
      },
      deep: true,
    },
    myOrder: {
      handler() {
        if (this.myOrder && this.cartCheck === true) {
          localStorage.setItem("myOrder", JSON.stringify(this.myOrder));
          console.log("Pushed to storage");
          console.log("Old", store.myOrder);

          store.myOrder = this.myOrder;
          console.log("New", store.myOrder);
        }
        if (this.myOrder.dishes && this.myOrder.dishes.length == 0) {
          this.myOrder = [];
          localStorage.removeItem("myOrder");
          console.log("Removed from storage");
          store.myOrder = this.myOrder;
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
    // EMPTY CART OF ALL ITEMS
    emptyCart() {
      localStorage.removeItem("myOrder");
      this.myOrder = [];
      // console.log("localStorage svuotato!");
      let inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.value = 0;
        input.classList.add("off");
      });
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
    // CHECK IF INPUT IS EMPTY
    isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    //DEFINED CHECK
    exists(item) {
      // console.log("controllo", item);
      if (item != undefined && item.length) {
        return true;
      } else {
        return false;
      }
    },
    // CHECK IF CART IS EMPTY
    checkEmpty() {
      if (this.myOrder.dishes && this.myOrder.dishes.length == 0) {
        this.myOrder = [];
        // console.log("MyOrder era vuoto");
      }
    },
    // CONVERT TO EURO FORMAT
    euroCheck(price) {
      let formattedPrice = Number(price).toFixed(2);
      formattedPrice = formattedPrice.replace(".", ",");
      return formattedPrice;
    },
    // PLUS AND MINUS BUTTONS
    quantity(operator, dish) {
      let value = document.getElementById(dish.id);
      console.log("QUANTITY -> questo è dish", dish);
      if (operator == "minus" && value.value > 0) {
        if (value.value == 1) {
          value.classList.add("off");
        }
        value.value--;

        let dishInOrder = this.myOrder.dishes.find((d) => d.id === dish.id);
        if (dishInOrder) {
          dishInOrder.quantity--;
          if (dishInOrder.quantity === 0) {
            this.myOrder.dishes = this.myOrder.dishes.filter(
              (d) => d.id !== dish.id
            );
          }
          this.myOrder.price -= dish.price;
        }
      }
      if (operator == "plus") {
        // SE MYORDER NON ESISTE
        if (!this.myOrder.dishes) {
          this.myOrder = {
            restaurant_id: this.restaurant.id,
            dishes: [],
            price: 0,
          };
        }

        // SE L'ID DEL RISTORANTE COMBACIA CON QUELLO NELL'ORDINE
        if (this.myOrder.restaurant_id == this.restaurant.id) {
          // SE IL VALUE SALE
          if (value.value == 0) {
            value.classList.remove("off");
          }

          let potentialPrice =
            parseFloat(this.myOrder.price) + parseFloat(dish.price);

          if (potentialPrice <= 9999.99) {
            value.value++;
            // console.log(this.restaurant.dishes);
            // LOGICA PLUS

            let dishInOrder = this.myOrder.dishes.find((d) => d.id === dish.id);
            if (dishInOrder) {
              dishInOrder.quantity++;
            } else {
              this.myOrder.dishes.push({ ...dish, quantity: 1 });
            }

            this.myOrder.price =
              parseFloat(this.myOrder.price) + parseFloat(dish.price);
          } else {
            this.cartLimitModal();
          }
        } else {
          this.alertModal();
        }
      }
    },

    // VALIDATION FOR INPUTS
    inputValidation(event, dish) {
      let input = document.getElementById(event);
      if (
        parseInt(input.value) === 0 &&
        (!this.myOrder.dishes || this.myOrder.dishes.length === 0)
      ) {
        return;
      }
      // Inizializza l'ordine se non esiste
      if (!this.myOrder.dishes) {
        this.myOrder = {
          restaurant_id: this.restaurant.id,
          dishes: [],
          price: 0,
        };
      }
      if (!input.value) input.value = 0;
      if (this.myOrder.restaurant_id == this.restaurant.id) {
        if (input.reportValidity()) {
          let dishInOrder = this.myOrder.dishes.find((d) => d.id === dish.id);

          // Calcola la nuova quantità e il nuovo prezzo potenziale
          let newQuantity = parseInt(input.value);
          let potentialNewPrice =
            this.myOrder.price -
            (dishInOrder ? dishInOrder.quantity * dish.price : 0) +
            newQuantity * dish.price;

          // Controlla se il prezzo supera il limite prima di aggiornare l'ordine
          if (potentialNewPrice > 9999.99) {
            // Calcola la quantità massima possibile senza superare il limite
            newQuantity = Math.floor(
              (9999.99 -
                (this.myOrder.price -
                  (dishInOrder ? dishInOrder.quantity * dish.price : 0))) /
                dish.price
            );
            potentialNewPrice =
              this.myOrder.price -
              (dishInOrder ? dishInOrder.quantity * dish.price : 0) +
              newQuantity * dish.price;
            this.cartLimitModal();
            potentialNewPrice;
          }

          // Aggiorna l'ordine solo se la nuova quantità è maggiore di zero
          if (newQuantity > 0) {
            if (dishInOrder) {
              this.myOrder.price = potentialNewPrice;
              dishInOrder.quantity = newQuantity;
            } else {
              this.myOrder.dishes.push({ ...dish, quantity: newQuantity });
              this.myOrder.price = potentialNewPrice;
            }
            input.value = newQuantity;
          } else if (dishInOrder) {
            // Rimuovi il piatto dall'ordine se la quantità è 0
            this.myOrder.dishes = this.myOrder.dishes.filter(
              (d) => d.id !== dish.id
            );
            this.myOrder.price -= dishInOrder.quantity * dish.price;
          }
        }
      } else {
        this.alertModal();
      }
      console.log("INPUT VALIDATION -> myOrder", this.myOrder);
    },

    // RECOVER DATA QUANTITIES FROM ORDER
    cartQuantity() {
      if (this.restaurant) {
        // console.log("partita la funzione");
        // PROVO A RECUPERARE L'ORDINE
        const orderString = localStorage.getItem("myOrder");

        // CONTROLLO SE L'ORDINE ESISTE

        const order = JSON.parse(orderString);

        if (orderString !== null && this.exists(order.dishes)) {
          // console.log("Ordine trovato");
          // console.log(order);
          // MYORDER UGUALE A LOCALSTORAGE
          this.myOrder = order;
          // CONTROLLO SE L'ORDINE CORRISPONDE AL RISTORANTE
          if (this.restaurant.id == order.restaurant_id) {
            // console.log(this.restaurant.id);

            // SCORRO TUTTI I PIATTI E LI TROVO IN PAGINA AGGIORNANDO CLASSE E VALORE
            for (let i = 0; i < order.dishes.length; i++) {
              // console.log("ciclo gli elementi");
              // console.log(order.dishes[i].id);
              let dish = document.getElementById(order.dishes[i].id);
              // console.log(dish);
              dish.value = order.dishes[i].quantity;
              dish.classList.remove("off");
            }
          }
        } else {
          // console.log("Ordine non trovato");
        }
      }
      this.cartCheck = true;
    },

    openModal(dish) {
      let modal = document.getElementById("dish-modal-" + dish);
      console.log("dish-modal-" + dish);
      modal.style.display = "block";
    },
    closeModal(dish) {
      let modal = document.getElementById("dish-modal-" + dish);
      modal.style.display = "none";
    },

    cartLimitModal() {
      let modal = document.getElementById("cartLimitModal");
      modal.style.display = "block";
    },
    cartLimitModalClose() {
      let modal = document.getElementById("cartLimitModal");
      modal.style.display = "none";
    },

    alertModal() {
      let modal = document.getElementById("restaurantOrderModal");
      modal.style.display = "block";
    },

    alertAccept(dish) {
      let input = document.getElementById(dish.id);
      if (input.value == 0) input.value = 1;
      let modal = document.getElementById("restaurantOrderModal");
      modal.style.display = "none";
      this.myOrder = {
        restaurant_id: this.restaurant.id,
        dishes: [],
        price: 0,
      };
      this.myOrder.dishes.push({ ...dish, quantity: input.value });
      this.myOrder.price = dish.price * input.value;
      input.classList.remove("off");
      if (this.myOrder.price > 9999.99) {
        newQuantity = Math.floor(
          (9999.99 -
            (this.myOrder.price -
              (dishInOrder ? dishInOrder.quantity * dish.price : 0))) /
            dish.price
        );
        alert(
          "Il limite di prezzo del carrello di 9999.99€ è stato superato. La quantità è stata aggiustata al valore massimo possibile."
        );
      }
    },
    alertDecline() {
      let modal = document.getElementById("restaurantOrderModal");
      modal.style.display = "none";
      history.back();
    },
  },
  created() {
    this.fetchRestaurants();
  },

  mounted() {},
};
</script>

<template>
  <!-- CODICE -->
  <div
    class="row justify-content-between containerApp ps-3"
    v-if="this.restaurant"
  >
    <div
      class="col-12 bg-white p-0 m-0 restaurantJumbo"
      :style="
        'background-image: url(' +
        restaurant.image +
        ');background-size: cover; background-position: center'
      "
    ></div>
    <!-- RESTAURANT DETAILS -->
    <div id="data">
      <div class="container" id="info">
        <router-link :to="{ name: 'home' }" class="" id="backButton">
          <button class="ballButton" @click="checkEmpty()">
            👈🏻<span class="fs-5">Indietro</span>
          </button>
        </router-link>
        <div class="row">
          <!-- RESTAURANT DATA -->
          <div class="my-3">
            <h1 class="restaurantTitle">
              {{ restaurant.name }}
            </h1>
            <h5>☎️ {{ restaurant.phone }}</h5>
            <h5 class="detailCap">🏠 {{ restaurant.address }}</h5>
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
          <!-- END BADGES -->
          <hr />
          <div class="dishesContainer">
            <!-- MODAL -->
            <div class="customModal" id="cartLimitModal">
              <div class="close" @click="cartLimitModalClose()">
                <i class="fa-solid fa-circle-xmark fa-2xl text-primary"></i>
              </div>
              <div>
                <h3 class="text-danger">ATTENZIONE</h3>
              </div>

              <div>
                <p class="fs-5">
                  Hai raggiunto il limite di 9999.99€! Il carrello contiene la
                  quantità massima di piatti possibile.
                </p>
              </div>
            </div>
            <div
              v-for="dish in restaurant.dishes"
              class="dishCard pe-5 col-12 col-md-6"
            >
              <!-- IMMAGINE -->

              <div class="dishImage col-2" @click="openModal(dish.id)">
                >
                <img :src="dish.image" alt="dish.name" />
              </div>
              <!-- TESTO -->
              <div class="dishInfo col-6 px-2">
                <h5>{{ dish.name }}</h5>
                <p>{{ dish.description }}</p>
              </div>

              <!-- PREZZO -->
              <div class="dishPrice col-4">
                <h5>€ {{ euroCheck(dish.price) }}</h5>
                <!-- QUANTITA -->
                <div class="amountContainer col-2">
                  <button
                    id="minus"
                    class="quantityButton me-2"
                    @click="quantity($event.target.id, dish)"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    :id="dish.id"
                    min="0"
                    step="1"
                    value="0"
                    class="off rounded border border-primary-subtle border-2"
                    @keyup="getClass($event.target.id)"
                    @blur="inputValidation($event.target.id, dish)"
                  />
                  <button
                    id="plus"
                    class="quantityButton ms-2"
                    @click="quantity($event.target.id, dish)"
                  >
                    +
                  </button>
                </div>
              </div>
              <!-- ALERT MODAL -->
              <div class="customModal" id="restaurantOrderModal">
                <div>
                  <h3 class="text-danger">ATTENZIONE</h3>
                </div>
                <div>
                  <p class="fs-5">
                    Il tuo carrello contiene piatti di un altro ristorante. Vuoi
                    svuotare il carrello per procedere?
                  </p>
                  <div class="d-flex justify-content-evenly g-3">
                    <button
                      class="btn btn-primary"
                      @click="this.alertAccept(dish)"
                    >
                      Procedi
                    </button>
                    <button class="btn btn-danger" @click="this.alertDecline()">
                      Annulla
                    </button>
                  </div>
                </div>
              </div>
              <!-- MODAL -->
              <div class="customModal" :id="'dish-modal-' + dish.id">
                <div class="close" @click="closeModal(dish.id)">
                  <i class="fa-solid fa-circle-xmark fa-2xl text-primary"></i>
                </div>
                <div>
                  <h3>{{ dish.name }}</h3>
                </div>
                <div class="modalImage">
                  <img :src="dish.image" :alt="dish.name" />
                </div>
                <div>
                  <p class="fs-5">{{ dish.description }}</p>
                  <span class="fs-2">€ {{ euroCheck(dish.price) }}</span>
                </div>
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

// MODAL CLASSES

.customModal {
  display: none;
  background-color: white;
  z-index: 5;
  max-width: 30vw;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 5px 0 rgba(black, 0.2);
  .modalImage {
    width: 100%;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    margin: 20px 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  .close {
    position: absolute;
    right: 30px;
    top: 20px;
    &:hover {
      transform: scale(1.1);
    }
  }
}

.containerApp {
  background-color: white;
  overflow-x: hidden;
}

.restaurantJumbo {
  aspect-ratio: 11 / 3;
  overflow: hidden;
  display: flex;
  position: relative;
}

#data {
  display: flex;

  #info {
    box-shadow: 0 0 10px 0 rgba(black, 0.2);
    flex: 1;
    // position: relative;
    background-color: white;
    z-index: 0;
    margin-top: -15%;
    border-radius: 15px;
    color: $secondary;
    text-align: center;
    .restaurantTitle {
      color: $tertiary;
    }
    padding-bottom: 15px;
  }
  padding-bottom: 30px;
}
#badgesContainer {
  margin-bottom: 30px;
  .badge {
    display: inline-block;
    margin-right: 10px;

    .typeBadge {
      // border: 3px solid $primary;
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
      box-shadow: 0 2px 3px 2px rgba(black, 0.2);

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

#backButton {
  transform: translate(0, -150%);
  position: absolute;
  left: 0;
  top: 0;
  align-items: center;
  text-decoration: none;

  .ballButton {
    background-color: $primary;
    box-shadow: 0 0 10px 0 rgba(black, 0.2);
    position: relative;
    color: white;
    padding: 5px 10px 10px 10px;
    border-radius: 500px;
    position: relative;
    font-size: 2rem;
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
    span {
      line-height: 50px;
      transform: translateY(10%);
    }
  }
}

button {
  // background-color: transparent;
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

.dishesContainer {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.dishCard {
  padding-bottom: 20px;
  height: fit-content;
  display: flex;
  background-color: white;
  flex: 0 0 auto;
  color: $secondary;
  border-bottom: 1px solid rgba($primary, 0.2);

  .dishImage {
    height: 100px;
    width: 100px;
    overflow: hidden;
    object-fit: contain;
    display: flex;
    border-radius: 500px;
    justify-content: center;
    img {
      height: 100%;
      width: auto;
    }
  }
  .dishInfo,
  .dishPrice {
    display: flex;
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
  justify-content: center;

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
    border-radius: 500px;
    background-color: $primary;
    color: white;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      transform: scale(0.9);
      background-color: $tertiary;
    }
  }

  .off {
    color: lightgray;
  }
}

.blueColor {
  background-color: $primary;
  color: white;
}
</style>
