<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import {store} from "../store/index.js";

export default {
    data () {
        return{
            store,
        }
    }
};
</script>

<template>
    <div class="container">

        <div class="card my-3">lista prodotti carrello</div>
        
        <div class="card my-3">Resoconto carrello</div>

        
        
        <button type="button">Checkout pagamento</button>
    </div>
</template>

<style lang="scss" scoped>
</style>