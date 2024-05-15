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
  <div class="payment-landing">
    <div class="container">
      <h1 class="my-4">Risultato del pagamento</h1>
      <div class="alert alert-success mb-4" role="alert">
        Pagamento avvenuto con successo
      </div>
      <div>
        <div class="card w-50">
          <div class="card-header">
            <h3>Riepilogo ordine</h3>
          </div>
          <div class="card-body">
            <p><strong>Nome cliente: </strong>{{ store.buyerData.customer_name }}</p>
            <p><strong>Indirizzo: </strong>{{ store.buyerData.address }}</p>
            <p><strong>Numero di telefono: </strong>{{ store.buyerData.phone }}</p>
            <p><strong>Email: </strong>{{ store.buyerData.email }}</p>
            <p><strong>Totale:</strong>{{ store.buyerData.amount }}</p>
          </div>
          <div class="card-footer">
            <!-- 
            <div v-for="dish in myOrder.dishes" class="dishCard pe-5">
              <div
                class="dishImage col-2"
                data-bs-toggle="modal"
                :data-bs-target="`#dish-` + dish.id"
              >
                <img :src="dish.image" alt="dish.name" />
              </div>

              <div class="dishInfo col-6 px-2">
                <h5>{{ dish.name }}</h5>
                <p>{{ dish.description }}</p>
              </div>

              <div class="dishPrice col-2">
                <h5>x {{ dish.quantity }}</h5>
              </div>
            </div> -->
          </div>
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
