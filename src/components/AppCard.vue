<script>
// import { store } from "../store";

export default {
  data() {
    return {
      // store,
    };
  },
  props: { restaurant: Object, index: Number, types: Array },
};
</script>

<template>
  <router-link
    :to="{
      name: 'restaurants.show',
      params: { slug: restaurant.slug },
    }"
    class="router-link"
  >
    <div class="myCard">
      <!-- Restaurant image -->
      <div class="coverImage">
        <img :src="restaurant.image" />
      </div>
      <!-- Restaurant details -->
      <div class="restaurantDetails">
        <h3 class="detailCap">{{ restaurant.name }}</h3>
        <p class="detailCap">{{ restaurant.address }}</p>
      </div>

      <!-- BADGE -->
      <div id="badgesContainer">
        <span
          v-for="badge in restaurant.types"
          class="badge mx-2"
          :style="
            `background-image:url(` +
            badge.image +
            `); background-size: cover; background-repeat: no-repeat; border-radius: 0`
          "
        >
          {{ badge.label }}
          <!-- <div class="typeBadge">
            <div class="badgeImg">
              <img :src="badge.image" alt="" width="100%" />
            </div>
            <span>{{ badge.label }}</span>
          </div> -->
        </span>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;
@use "../style/partials/variables" as *;
.myCard {
  background-color: white;
  height: 100%;
  color: $darkblue;
  border-radius: 5px;
  border: 1px solid $darkblue;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // overflow: hidden;
  // white-space: nowrap;

  .restaurantDetails {
    padding: 0px 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
  }
  &:hover {
    box-shadow: 0 0 7px black;
    transform: scale(1.02);
    transition: all 0.1s ease-in-out 0.1s;
  }

  .coverImage {
    width: 100%;
    overflow: hidden;
    // border-radius: 10px;
    margin-bottom: 15px;
    aspect-ratio: 1 / 1;

    img {
      height: 100%;
    }
  }
}

h3.detailCap {
  font-size: 25px;
}
.detailCap {
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

.router-link {
  text-decoration: none;
}

#badgesContainer {
  margin-bottom: 30px;
  // .badge {
  //   display: inline-block;
  //   margin-right: 10px;

  //   .typeBadge {
  //     // border: 3px solid $midblue;
  //     width: 100%;
  //     border-radius: 60%;
  //     overflow: hidden;
  //     position: relative;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     height: 32px;
  //     width: 100%;
  //     object-fit: cover;

  //     span {
  //       z-index: 2;
  //       text-shadow: 0px 0px 20px black;
  //       font-size: 100%;
  //       letter-spacing: 2px;
  //       text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
  //         2px 2px 0 #000;
  //     }
  //     .badgeImg {
  //       position: absolute;
  //       width: 100%;
  //       filter: brightness(90%);
  //     }
  //   }
  // }
}

.rightColumn {
  padding: 0;
  // height: calc(100vh - $headerHeight - $footerHeight);
  overflow: auto;
  // background-color: $midblue;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  align-content: flex-start;
}

.detailCap {
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}
</style>
