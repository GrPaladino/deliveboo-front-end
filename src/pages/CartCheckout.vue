<script>
import axios from "axios";
import Payment from "../components/Payment.vue";
import { store, api } from "../store";

export default {
  data() {
    return {
      tokenApi: "",
      restaurant: [],
      types: [],
      store,
      myOrder: [],
    };
  },

  components: { Payment },

  methods: {
    fetchRestaurants() {
      const restaurantSlug = this.$route.params.slug;
      axios
        .get(api.baseApiURI + `restaurants/${restaurantSlug}`)
        .then((response) => {
          this.restaurant = response.data.restaurants[0];
          this.types = response.data.restaurants[0].types;
        });
    },
    fetchOrder() {
      let order = localStorage.getItem("myOrder");
      if (order) {
        this.myOrder = JSON.parse(order);
        console.log(this.myOrder);
      } else {
        if (confirm("Il tuo carrello è vuoto! Torna ai ristoranti. ")) {
          history.back();
        } else {
          history.back();
        }
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
    this.fetchOrder();

    // this.fetchTypes();
  },

  async mounted() {
    let response = await axios.get(api.baseApiURI + "order/generate");
    this.tokenApi = response.data.token;
    console.log(this.tokenApi);
  },
};
</script>

<template>
  <div class="row justify-content-between containerApp ps-3">
    <div class="col-12 col-md-9 rightColumn px-2">
      <div v-for="dish in myOrder.dishes" class="dishCard pe-5 col-12 col-md-6">
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
        <!-- QUANTITA -->
        <div class="dishPrice col-2">
          <h5>x {{ dish.quantity }}</h5>
        </div>
      </div>
    </div>
    <div>
      <h2 class="totalPrice">€ {{ euroCheck(this.myOrder.price) }}</h2>
    </div>
    <div><Payment :authorization="this.tokenApi"></Payment></div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;

.totalPrice {
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
