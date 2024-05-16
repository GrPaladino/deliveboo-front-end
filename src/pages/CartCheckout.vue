<script>
import axios from "axios";
import Payment from "../components/Payment.vue";
import AppLoading from "../components/AppLoading.vue";
import { store, api } from "../store";

export default {
  data() {
    return {
      tokenApi: "",
      myOrder: [],
      store,
      orderQuantity: "",
    };
  },

  components: { Payment, AppLoading },

  methods: {
    fetchOrder() {
      let order = localStorage.getItem("myOrder");
      if (order) {
        this.myOrder = JSON.parse(order);
        // console.log(this.myOrder.dishes.length);
      }
    },

    getClass(event) {
      let input = document.getElementById(event);
      if (input.value > 0) {
        input.classList.remove("off");
      } else {
        input.classList.add("off");
      }
    },

    // CONVERT TO EURO FORMAT

    euroCheck(price) {
      let formattedPrice = Number(price).toFixed(2);
      formattedPrice = formattedPrice.replace(".", ",");
      store.orderPrice = formattedPrice;
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
        store.badgeDecrement();

        let dishInOrder = this.myOrder.dishes.find((d) => d.id === dish.id);
        if (dishInOrder) {
          dishInOrder.quantity--;

          this.value = dishInOrder.quantity;

          if (dishInOrder.quantity === 0) {
            this.myOrder.dishes = this.myOrder.dishes.filter(
              (d) => d.id !== dish.id
            );
          }
          this.myOrder.price -= dish.price;
        }
      }
      if (operator == "plus") {
        // SE MY ORDER NON ESISTE
        if (!this.myOrder.dishes) {
          this.myOrder = {
            restaurant_id: this.restaurant.id,
            dishes: [],
            price: 0,
          };
        }

        // SE L'ID DEL RISTORANTE COMBACIA CON QUELLO NELL'ORDINE

        // SE ORDINE NON ESISTE
        // SE IL VALUE SALE
        if (value.value == 0) {
          value.classList.remove("off");
        }

        let potentialPrice =
          parseFloat(this.myOrder.price) + parseFloat(dish.price);

        if (potentialPrice <= 9999.99) {
          value.value++;
          store.badgeIncrement();
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
          alert(
            "Aggiungendo questo piatto, si supererebbe il limite di prezzo del carrello di 9999.99€."
          );
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
          alert(
            "Il limite di prezzo del carrello di 9999.99€ è stato superato. La quantità è stata aggiustata al valore massimo possibile."
          );
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

    // EMPTY CART OF ALL ITEMS
    emptyCart() {
      localStorage.removeItem("myOrder");
      store.orderQuantity = 0;
      // this.myOrder = [];
      // console.log("localStorage svuotato!");
      let inputs = document.getElementsByName("input");
      inputs.forEach((input) => {
        input.value = 0;
        input.classList.add("off");
      });
    },
  },

  created() {
    this.fetchOrder();
  },

  async mounted() {
    let response = await axios.get(api.baseApiURI + "order/generate");
    this.tokenApi = response.data.token;
    // console.log(this.tokenApi);
  },
};
</script>

<template>
  <App-loading v-show="store.loading" />
  <div v-if="!this.myOrder.dishes" class="text-center mt-2">
    <h1 class="text-danger">Il tuo carrello è vuoto!</h1>
    <router-link :to="{ name: 'home' }">
      <button class="btn btn-primary">Torna alla home</button>
    </router-link>
  </div>
  <div v-else class="container d-flex justify-content-center py-3">
    <div class="row justify-content-center containerApp px-4 container">
      <div class="col-12 col-md-7 px-2 mt-4">
        <div class="card">
          <div class="card-header px-3 pt-3">
            <h2>Il tuo ordine</h2>
          </div>
          <div class="card-body">
            <div v-if="this.myOrder.dishes.length">
              <div
                v-for="dish in myOrder.dishes"
                class="dishCard pe-2 col-12 col-md-6 w-100 mb-1">
                <!-- IMMAGINE -->

                <div
                  class="dishImage col-2"
                  data-bs-toggle="modal"
                  :data-bs-target="`#dish-` + dish.id">
                  <img :src="dish.image" alt="dish.name" />
                </div>
                <!-- TESTO -->
                <div class="dishInfo col-6 col-sm-5 col-md-6 px-2">
                  <h5>{{ dish.name }}</h5>
                  <p>{{ dish.description }}</p>
                </div>
                <div class="col-4 col-sm-5 col-md-4 row">
                  <!-- PREZZO -->
                  <div class="dishPrice col-xl-6 col-lg-12">
                    <h5>€ {{ euroCheck(dish.price) }}</h5>
                  </div>

                  <!-- QUANTITA -->
                  <div class="amountContainer col-xl-6 col-lg-12">
                    <button
                      id="minus"
                      class="quantityButton rounded-start"
                      @click="quantity($event.target.id, dish)">
                      -
                    </button>
                    <input
                      name="input"
                      type="number"
                      class="number_dishes input"
                      :id="dish.id"
                      min="0"
                      :value="dish.quantity"
                      @keyup="getClass($event.target.id)"
                      @blur="inputValidation($event.target.id, dish)" />
                    <button
                      id="plus"
                      class="quantityButton rounded-end"
                      @click="quantity($event.target.id, dish)">
                      +
                    </button>
                  </div>
                </div>
              </div>
              <!-- QUANTITA
          <div class="dishPrice col-2">
            <h5>x {{ dish.quantity }}</h5>
          </div> -->
            </div>
          </div>
          <div class="card-footer pb-3">
            <div id="totalPrice">
              <h3 class="totalPrice mt-2">TOTALE</h3>
              <p class="m-0 fs-3">€ {{ euroCheck(this.myOrder.price) }}</p>
            </div>
          </div>
          <button
            @click="emptyCart()"
            type="button"
            class="btn btn-outline-warning empty-cart m-2 w-50">
            Svuota carrello
          </button>
        </div>
      </div>
      <div class="col-12 col-md-5 py-4">
        <Payment
          :authorization="this.tokenApi"
          :myOrder="this.myOrder"></Payment>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;

.totalPrice,
h2 {
  color: $darkblue;
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
  /* height: calc(100vh - $headerHeight - $footerHeight); */
  background-color: white;
  overflow: auto;
  overflow-x: hidden;
}

// .leftColumn {
//   height: 100%;
//   position: relative;
//   color: $darkblue;
//   background-color: white;
//   text-align: center;
//   // min-height: calc(100vh - $headerHeight - $footerHeight);
//   border-right: 2px solid rgba($midblue, 0.2);
//   border-bottom: 2px solid rgba($midblue, 0.2);
// }

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

.leftColumn {
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
  border-bottom: 1px solid rgba($midblue, 0.2);

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
    /*   border-bottom: 1px solid rgba($midblue, 0.2); */
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
  /* border-bottom: 1px solid rgba($midblue, 0.2); */

  // INPUT NUMBER ARROW HIDDEN
  input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    width: 40px;
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

#totalPrice {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
