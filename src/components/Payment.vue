<script>
// import { store } from "../store";

export default {
  data() {
    return {
      // store,
    };
  },
  props: { authorization: { required: true, type: String } },
  watch: {
    authorization: {
      handler() {
        if (this.authorization) {
          this.dropin();
        }
      },
      deep: true,
    },
  },
  methods: {
    dropin() {
      console.log;
      var button = document.querySelector("#submit-button");

      braintree.dropin.create(
        {
          authorization: this.authorization,
          selector: "#dropin-container",
        },
        function (err, instance) {
          button.addEventListener("click", function () {
            instance.requestPaymentMethod(function (err, payload) {
              // Submit payload.nonce to your server
            });
          });
        }
      );
    },
  },
  created() {},
};
</script>
<template>
  <div>
    <div>
      <!-- <v-braintree
        :authorization="authorization"
        @success="onSuccess"
        @error="onError"
      ></v-braintree> -->
      <div id="dropin-container"></div>
      <button id="submit-button" class="button button--small button--green">
        Purchase
      </button>
    </div>
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
