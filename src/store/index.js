import { reactive } from "vue";

export const api = {
  baseApiURI: "http://127.0.0.1:8000/api/",
};

export const store = reactive({
  restaurants: [],
  cart: [],
  orderQuantity: 0,
  buyerData: '',

  badgeIncrement() {
    this.orderQuantity++;
  },
  badgeDecrement() {
    this.orderQuantity--;
  }
});
