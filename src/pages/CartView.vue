<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import dropin from "braintree-web-drop-in";
import { store } from "../store/index.js";

export default {
  data() {
    return {
      store,
    };
  }
};

/**
 * to do implementare il metodo per il pagamento
 * Tokenization Key: "sandbox_rz8tc8v5_9bpqhpnxss37n4yn"
 * 
 * */


</script>

<template>
  <div class="container ps-2 pt-2">

    <div class="card my-3">lista prodotti carrello</div>

    <div class="card my-3">Resoconto totale carrello</div>


    <!-- todo: legare il form alla chiamata per la conferma del pagamento -->
    <form class="col-3" action="">

      <div id="dropin-container"></div>
      <button id="submit-button" class="button button--small button--green">Acquista</button>

    </form>


  </div>
</template>

<style lang="scss" scoped>
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