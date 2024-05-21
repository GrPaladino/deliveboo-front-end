import { reactive, watch, onMounted } from "vue";

export const api = {
  baseApiURI: "http://127.0.0.1:8000/api/",
};

export const store = reactive({
  restaurants: [],
  myOrder: {
    dishes: [],
  },
  quantity: 0,
  loading: false
});

watch(
  () => store.myOrder.dishes,
  () => {
    store.quantity = 0;
    console.log("store function");
    if (store.myOrder.dishes && store.myOrder.dishes.length > 0) {
      store.myOrder.dishes.forEach((element) => {
        store.quantity += element.quantity;
      });
    }
  },
  {
    deep: true,
  }
);

function loadOrder() {
  const localOrder = localStorage.getItem("myOrder");
  if (localOrder) {
    store.myOrder = JSON.parse(localOrder);
  }
}

loadOrder();
