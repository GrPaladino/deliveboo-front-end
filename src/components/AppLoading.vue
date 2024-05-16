<script>
export default {
  data() {
    return {};
  },

  components: {},
};
</script>

<template>
  <div>
    <i class="fa-solid fa-spinner fa-spin fa-2xl"></i>
  </div>
</template>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba($color: #000000, $alpha: 0.5);
  font-size: 6rem;
}
</style>
