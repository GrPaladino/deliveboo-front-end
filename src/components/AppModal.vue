<script>
export default {
  data() {
    return {};
  },

  components: {},

  emits: ["modal-close", "empty-cart"],
};
</script>

<template>
  <div class="wrapper">
    <div class="col-4">
      <!-- <div class="card">
        <p class="fs-2">
          Il carrello contiene piatti di un altro ristorante! Svuotare il
          carrello?
        </p>
      </div> -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Attenzione!</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary"></h6>
          <p class="card-text">
            Il carrello contiene piatti di un altro ristorante! Svuotare il
            carrello?
          </p>
          <button
            @click="$emit('modal-close')"
            type="button"
            class="btn btn-danger me-3">
            Annulla
          </button>

          <button
            @click="$emit('empty-cart')"
            type="button"
            class="btn btn-success">
            Si
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
</style>
