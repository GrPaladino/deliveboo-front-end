<script>
import axios from "axios";
import Payment from "../components/Payment.vue";
import AppLoading from "./AppLoading.vue";
import { store, api } from "../store";

export default {
  data() {
    return {
      tokenApi: "",
      store,
      myOrder: [],
    };
  },
  watch: {
    myOrder: {
      handler() {
        if (this.myOrder) {
          localStorage.setItem("myOrder", JSON.stringify(this.myOrder));
          store.myOrder = this.myOrder;
          // console.log("Pushed to storage");
        }
        if (this.myOrder.dishes && this.myOrder.dishes.length == 0) {
          this.myOrder = [];
          localStorage.removeItem("myOrder");
          store.myOrder = this.myOrder;
          // console.log("Removed from storage");
        }
      },
      deep: true,
    },
  },

  components: { Payment, AppLoading },

  methods: {
    fetchOrder() {
      let order = localStorage.getItem("myOrder");
      if (order) {
        this.myOrder = JSON.parse(order);
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
      }

      // console.log(this.myOrder);
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

      if (!input.value) input.value = 0;

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
      console.log("INPUT VALIDATION -> myOrder", this.myOrder);
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
    //DEFINED CHECK
    exists(item) {
      // console.log("controllo", item);
      if (item != undefined && item.length) {
        return true;
      } else {
        return false;
      }
    },
  },

  created() {
    this.fetchOrder();
  },

  async mounted() {
    let response = await axios.get(api.baseApiURI + "order/generate");
    this.tokenApi = response.data.token;
    console.log(this.tokenApi);
  },
};
</script>

<template>
  <app-loading v-if="store.loading" />
  <div class="row justify-content-between containerApp ps-3">
    <div class="col-12 col-md-8 px-2">
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

      <!-- EMPTY CART -->
      <div
        v-if="!this.myOrder.dishes || this.myOrder.dishes.length == 0"
        class="noItems"
      >
        <h1 class="text-danger text-center">Il tuo carrello è vuoto!</h1>
        <router-link to="/">
          <button class="btn btn-primary">Torna alla home</button></router-link
        >
      </div>

      <!-- CART -->
      <div v-if="this.myOrder.dishes && this.myOrder.dishes.length > 0">
        <div class="dishesContainer">
          <div v-for="dish in this.myOrder.dishes" class="dishCard pe-5 col-12">
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
              <h5 class="text-center">€ {{ euroCheck(dish.price) }}</h5>
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
                  :value="dish.quantity"
                  class="off rounded border border-primary-subtle border-2"
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
        <div>
          <h2 class="totalPrice">
            TOTALE € {{ euroCheck(this.myOrder.price) }}
          </h2>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-4 px-2 pe-5">
      <Payment
        :authorization="this.tokenApi"
        :myOrder="this.myOrder"
        v-if="this.myOrder.dishes && this.myOrder.dishes.length > 0"
      ></Payment>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;

.noItems {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.totalPrice {
  color: $secondary;
  text-align: center;
  margin-top: 30px;
}

.customModal {
  text-align: center;
  display: none;
  color: $secondary;
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

// GO TO CART
.goToCart {
  position: absolute;
  background-color: $primary;
  border-radius: 50%;
  aspect-ratio: 1/1;
  max-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  text-shadow: 5px 5px 5px $secondary;
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

.containerApp {
  height: calc(100vh - $headerHeight - $footerHeight);
  background-color: white;
  overflow: auto;
  overflow-x: hidden;
}

#badgesContainer {
  margin-bottom: 30px;
  .badge {
    display: inline-block;
    margin-right: 10px;

    .typeBadge {
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

.leftColumn {
  padding: 0;
  overflow: auto;
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

.dishesContainer {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.dishCard {
  padding: 20px;
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
}

.blueColor {
  background-color: $primary;
  color: white;
}
</style>
