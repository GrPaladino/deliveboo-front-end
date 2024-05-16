<script>
import { api, store } from "../store";
import { router } from "../router";

export default {
  data() {
    return {
      api,
      store,
      // redirect: false,
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
                router.push({ name: "payment.landing" });
                store.buyerData = data;
                store.loading = false;
                localStorage.removeItem("myOrder");
                store.orderQuantity = 0;
              } else {
                console.log("fail");
              }
            })
            .catch((error) => {
              console.log("error");
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
  <div class="mb-3">
    <div>
      <form
        class="p-0"
        id="payment-form"
        :action="api.baseApiURI + 'order/make/payment'"
        method="post">
        @csrf
        <!-- Name field with pattern restriction for letters only -->
        <div class="card">
          <div class="card-header px-3 pt-3">
            <h2>Dati Cliente</h2>
          </div>
          <div class="card-body px-2">
            <div class="mb-3">
              <label for="customer_name" class="form-label"
                >Nome e Cognome: *</label
              >
              <input
                type="text"
                class="form-control"
                id="customer_name"
                name="customer_name"
                pattern="[A-Za-z\s]+"
                required
                max="200"
                title="Inserire solo lettere." />
            </div>

            <!-- Email field with built-in email validation -->
            <div class="mb-3">
              <label for="email" class="form-label">Email: *</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                required
                max="200" />
            </div>

            <!-- Phone field with pattern restriction for phone numbers -->
            <div class="mb-3">
              <label for="phone" class="form-label"
                >Numero di telefono: *</label
              >
              <input
                type="text"
                class="form-control"
                id="phone"
                name="phone"
                required
                max="20" />
            </div>

            <!-- Address field with minlength and maxlength attributes -->
            <div class="mb-3">
              <label for="address" class="form-label">Indirizzo: *</label>
              <input
                type="text"
                class="form-control"
                id="address"
                name="address"
                max="250"
                required />
            </div>

            <input
              type="hidden"
              class="form-control"
              id="date_time"
              name="date_time"
              required
              readonly />

            <!-- Price field with minimum and maximum value restrictions -->
            <div class="mb-3">
              <label for="price" class="form-label">Totale:</label>
              <input
                type="float"
                class="form-control"
                id="price"
                name="price"
                :value="euroCheck(parseInt(store.orderPrice))"
                required
                readonly />
            </div>

            <input
              type="hidden"
              name="orderData"
              :value="JSON.stringify(myOrder.dishes)" />
            <!-- BRAINTREE DATA -->
            <input
              type="hidden"
              name="amount"
              :value="euroCheck(parseInt(store.orderPrice))" />
            <input type="hidden" name="token" :value="authorization" />

            <div id="dropin-container"></div>

            <div class="text-dark mb-2">
              <i>I dati accompagnati da * sono obbligatori</i>
            </div>
          </div>

          <div class="card-footer">
            <button
              @click="handleLoading()"
              id="submit-button"
              type="submit"
              class="btn submit-button">
              Invia
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;

@use "../style/partials/variables" as *;
label,
h2 {
  color: $darkblue;
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

i {
  font-size: 0.8rem;
}

.submit-button {
  background-color: $midblue;
  color: white;
}
</style>
