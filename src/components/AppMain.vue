<script>
import AppHome from "../pages/AppHome.vue";
export default {
  data() {
    return {};
  },

  components: { AppHome },
};
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;
@use "../style/partials/variables" as *;

// div {
//   min-height: calc(100vh - $footerHeight - $headerHeight);
// }
</style>
