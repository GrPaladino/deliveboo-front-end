<script>
import { store } from "../store";
import RestaurantsList from "../components/RestaurantsList.vue";
export default {
  data() {
    return {
      titleComponent: "Home Page",
      store,
    };
  },

  components: { RestaurantsList },

  created() {},
};
</script>

<template>
  <div class="container">
    <div id="splash">
      <img src="../assets/img/jumbo-2.svg" alt="" />
    </div>
    <div class="row align-items-center">
      <div class="col-sm-12 col-md-6 jumboTextContainer">
        <div>
          <h2 class="display-2 title">Ordina subito con Boolivery! 🛵🍝</h2>

          <!-- BUTTON -->
          <div class="btn-restaurant mb-5">
            <!-- <router-link
              :to="{ name: 'restaurants.index' }"
              href="#"
              class="btn btn--action"
              ><span class="guest">Vai ai ristoranti</span></router-link
            > -->
          </div>

          <!-- <h5 class="title">oppure</h5> -->
          <h3 class="display-5 title">Sei un ristoratore?</h3>
          <!-- BUTTON -->
          <div class="btn-restaurant mb-3">
            <a class="btn btn--action" href="http://127.0.0.1:8000/login"
              ><span class="user">Accedi al tuo account</span></a
            >
          </div>
        </div>
      </div>
    </div>
    <restaurants-list></restaurants-list>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/partials/mixins" as *;
@use "../style/partials/variables" as *;
.container {
  overflow: hidden;

  .row {
    min-height: calc(100vh - $headerHeight - $footerHeight);

    .jumboTextContainer {
      text-align: center;
      background-color: white;
      padding: 60px 20px;
      border-radius: 3px;

      // BUTTONS
      .btn-restaurant {
        .btn--action {
          font-size: 1.5rem;
          display: block;
          padding: 1rem;
          border-radius: 100px;
          background-color: $midblue;
          color: white;
          transition: all 0.5s ease 0s;
          box-shadow: 0 10px $darkblue;
        }

        .btn--action span {
          display: inline-block;
          position: relative;
          transition: all 0.5s ease;
        }

        .btn--action span::before {
          display: inline-block;
          position: absolute;
          top: 50%;
          font-size: 2rem;
          transform: translate(-100%, -50%);
          left: 1.5rem;
          opacity: 0;
          transition: all 0.1s ease 0s;
        }
        .btn--action .guest::before {
          content: "🍔";
        }
        .btn--action .user::before {
          content: "🧑🏻‍🍳";
        }
        .btn--action:hover {
          background-color: $darkblue;
        }

        .btn--action:hover span {
          padding-left: 1.5rem;
        }

        .btn--action:hover span:before {
          left: 0;
          opacity: 1;
        }

        .btn--action:active {
          transform: translateY(5px);
        }
      }
      .title {
        color: $midblue;
        margin-bottom: 30px;
        // text-shadow: -2px -2px 15px #4477d5, 2px -2px 15px #4477d5,
        //   -2px 2px 15px #4477d5, 2px 2px 15px #4477d5;
      }
    }
  }
}

// JUMBO IMAGE
#splash {
  z-index: -1;
  position: absolute;
  right: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;

  img {
    min-width: 100vw;
    min-height: calc(100vh - $headerHeight - $footerHeight);
  }
}
</style>
