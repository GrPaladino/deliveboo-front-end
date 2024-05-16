import { reactive } from "vue";

export const api = {
  baseApiURI: "http://127.0.0.1:8000/api/",
};

export const store = reactive({
  restaurants: [],
  cart: [],
  orderQuantity: 0,
  orderPrice: "",
  buyerData: "",
  loading: false,

  modal: {
    show: false,
    brand: "",
    model: "",
    fullPrice: "",
    finalPrice: "",
    discount: "",
    isSostenibility: "",
  },

  badgeIncrement() {
    this.orderQuantity++;
  },
  badgeDecrement() {
    this.orderQuantity--;
  },
});
