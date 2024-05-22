<script>
export default {
  data() {
    return {};
  },
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
