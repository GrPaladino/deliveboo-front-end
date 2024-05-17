<script>
/* import MyComponent from "./components/MyComponent.vue" */
import axios from "axios";
import { store } from "../store";

export default {
  data() {
    return {
      title: "Hello world",
      store,
    };
  },
};
</script>

<template>
  <div class="payment-landing py-2">
    <div class="container">
      <router-link
        :to="{ name: 'home' }"
        type="button"
        class="btn btn-primary my-3">
        <i class="fa-solid fa-circle-arrow-left fa-beat me-1"></i>
        Torna alla Home
      </router-link>
      <div v-if="store.buyerData.success">
        <!-- <h1 class="mt-4">Risultato del pagamento</h1> -->

        <div class="alert alert-success mb-4" role="alert">
          Pagamento avvenuto con successo
        </div>
        <div>
          <div class="card w-50">
            <div class="card-header">
              <h3>Riepilogo ordine</h3>
            </div>
            <div class="card-body">
              <p>
                <strong>Nome cliente: </strong
                >{{ store.buyerData.customer_name }}
              </p>
              <p><strong>Indirizzo: </strong>{{ store.buyerData.address }}</p>
              <p>
                <strong>Numero di telefono: </strong>{{ store.buyerData.phone }}
              </p>
              <p><strong>Email: </strong>{{ store.buyerData.email }}</p>
              <p>
                <strong>Totale: € </strong
                >{{ store.buyerData.amount.replace(".", ",") }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-danger mt-2 text-center" role="alert">
          <p class="fs-2">Transazione fallita</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/variables" as *;
.payment-landing {
  height: calc(100vh - $headerHeight - $footerHeight);
  color: $darkblue;
  background-color: white;
  overflow: auto;
  overflow-x: hidden;
}
</style>
