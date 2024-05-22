<script>
import { api, store } from "../store";

export default {
  data() {
    return {
      api,
      store,
      username: "",
      email: "",
      phone: "",
      address: "",
    };
  },
  props: { authorization: { required: true, type: String }, myOrder: Object },
  watch: {
    authorization: {
      handler() {
        if (this.authorization) {
          this.dropin();
        }
      },
      deep: true,
    },
  },
  methods: {
    handleLoading() {
      if (this.username && this.email && this.phone && this.address)
        store.loading = true;
    },

    dropin() {
      console.log;
      var button = document.querySelector("#submit-button");

      braintree.dropin.create(
        {
          authorization: this.authorization,
          selector: "#dropin-container",
        },
        function (err, instance) {
          if (err) {
            console.error(err);
            return;
          }
          button.addEventListener("click", function () {
            instance.requestPaymentMethod(function (err, payload) {
              if (err) {
              } else {
              }
            });
          });
        }
      );
    },
    euroCheck(price) {
      let formattedPrice = price.toFixed(2);
      // formattedPrice = formattedPrice.replace(".", ",");
      return formattedPrice;
    },
    getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // paymentModalSuccess() {},
    // paymentModalFail() {},
    paymentModalClose(element) {
      let modal = document.getElementById(element);
      modal.style.display = "none";
      if (element === "paymentModalSuccess") {
        window.location.href = "/";
        store.myOrder = [];
        localStorage.removeItem("myOrder");
      }
    },

    formCatch() {
      document
        .getElementById("payment-form")
        .addEventListener("submit", function (e) {
          e.preventDefault(); // Previene il comportamento di default del form

          var formData = new FormData(this);

          fetch(this.action, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("successo");
                let modal = document.getElementById("paymentModalSuccess");
                modal.style.display = "block";
                store.loading = false;

              } else {
                console.log("fail");
                this.paymentModalFail();
                store.loading = false;

              }
            })
            .catch((error) => {
              let modal = document.getElementById("paymentModalFail");
              modal.style.display = "block";
              store.loading = false;

            });
        });
    },
  },
  created() {},
  mounted() {
    document.getElementById("date_time").value = this.getCurrentDateTime();
    this.formCatch();
  },
};
</script>
<template>
  <div>
    <!-- PAYMENT MODAL SUCCESS -->
    <div class="customModal" id="paymentModalSuccess">
      <div class="close" @click="paymentModalClose('paymentModalSuccess')">
        <i class="fa-solid fa-circle-xmark fa-2xl text-primary"></i>
      </div>
      <div>
        <i
          class="fa-solid fa-circle-check display-1 fa-bounce text-success"
        ></i>
      </div>

      <div>
        <h3 class="text-success">L'ordine è avvenuto con successo!</h3>
        <span class="text-success"
          >Controlla la tua casella di posta elettronica.</span
        >
      </div>
    </div>

    <!-- PAYMENT MODAL FAIL -->
    <div class="customModal" id="paymentModalFail">
      <div class="close" @click="paymentModalClose('paymentModalFail')">
        <i class="fa-solid fa-circle-xmark fa-2xl text-primary"></i>
      </div>
      <div>
        <i class="fa-solid fa-circle-xmark display-1 fa-bounce text-danger"></i>
      </div>

      <div>
        <h3 class="text-danger">L'ordine è stato rifiutato!</h3>
      </div>
    </div>

    <!-- FORM -->
    <div>
      <form
        id="payment-form"
        :action="api.baseApiURI + 'order/make/payment'"
        method="post"
      >
        @csrf
        <!-- Name field with pattern restriction for letters only -->
        <div class="mb-3">
          <label for="customer_name" class="form-label"
            >Nome e Cognome: *</label
          >
          <input
          v-model="username"
            type="text"
            class="form-control"
            id="customer_name"
            name="customer_name"
            pattern="[A-Za-z\s]+"
            required
            title="Name should only contain letters."
          />
        </div>

        <!-- Email field with built-in email validation -->
        <div class="mb-3">
          <label for="email" class="form-label">Email: *</label>
          <input
          v-model="email"
            type="email"
            class="form-control"
            id="email"
            name="email"
            required
          />
        </div>

        <!-- Phone field with pattern restriction for phone numbers -->
        <div class="mb-3">
          <label for="phone" class="form-label">Numero di telefono: *</label>
          <input
          v-model="phone"
            type="tel"
            class="form-control"
            id="phone"
            name="phone"
            pattern="\d{10}"
            required
            title="Phone number should be 10 digits."
          />
        </div>

        <!-- Address field with minlength and maxlength attributes -->
        <div class="mb-3">
          <label for="address" class="form-label">Indirizzo: *</label>
          <input
          v-model="address"
            type="text"
            class="form-control"
            id="address"
            name="address"
            minlength="10"
            maxlength="250"
            required
          />
        </div>

        <input
          type="hidden"
          class="form-control"
          id="date_time"
          name="date_time"
          required
          readonly
        />

        <!-- Price field with minimum and maximum value restrictions -->
        <div class="mb-3">
          <label for="price" class="form-label">Totale:</label>
          <input
            type="float"
            class="form-control"
            id="price"
            name="price"
            :value="euroCheck(myOrder.price)"
            required
            readonly
          />
        </div>
        <input
          type="hidden"
          name="orderData"
          :value="JSON.stringify(myOrder.dishes)"
        />
        <!-- BRAINTREE DATA -->
        <input type="hidden" name="amount" :value="euroCheck(myOrder.price)" />
        <input type="hidden" name="token" :value="authorization" />

        <div id="dropin-container"></div>
        <button  @click="handleLoading()" type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;
label {
  color: $secondary;
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

.button {
  cursor: pointer;
  font-weight: 500;
  left: 3px;
  line-height: inherit;
  position: relative;
  text-decoration: none;
  text-align: center;
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
  -webkit-appearance: none;
  -moz-appearance: none;
  display: inline-block;
}

.button--small {
  padding: 10px 20px;
  font-size: 0.875rem;
}

.button--green {
  outline: none;
  background-color: #64d18a;
  border-color: #64d18a;
  color: white;
  transition: all 200ms ease;
}

.button--green:hover {
  background-color: #8bdda8;
  color: white;
}
</style>
