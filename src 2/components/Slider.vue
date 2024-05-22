<script>
// import { store } from "../store";
import { register } from "swiper/element/bundle";

import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles

// import required modules

import { Autoplay, Navigation, Pagination } from "swiper/modules";

register();

export default {
  data() {
    return {};
  },
  props: { types: Object },
  methods: {},
  emits: ["filter"],
  created() {},
};
</script>

<template>
  <!-- Repeat this block for each card -->
  <swiper-container
    slidesPerView="auto"
    freeMode="true"
    loop="true"
    allowTouchMove="false"
    :autoplay="{
      delay: 0,
      disableOnInteraction: true,
    }"
    :breakpoints="{
      320: { slidesPerView: 1 },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 6.5,
      },
    }"
    speed="10000"
  >
    <swiper-slide v-for="item in types" class="my-2" id="carousel">
      <div class="card" @click="this.$emit('filter', item.label)">
        <img :src="item.image" class="card-img-top" :alt="item.label" />
        <div class="card-body">
          <h5 class="card-title">{{ item.label }}</h5>
        </div>
      </div>
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;
@use "../style/partials/variables" as *;

@import "/node_modules/swiper/swiper-bundle.css";

@import "/node_modules/swiper/modules/pagination.css";
@import "/node_modules/swiper/modules/navigation.css";

.card {
  height: auto; /* Adjust based on your content */
  margin-right: 20px;
  box-shadow: 0 0 5px 0 $secondary;
}

.card-img-top {
  width: 100%;
  height: 100px; /* Adjust height as needed */
  object-fit: cover;
  overflow: hidden;
}
.card-body {
  text-align: center;
  padding: 10px 0;

  .card-title {
    margin: 0;
  }
}
</style>
