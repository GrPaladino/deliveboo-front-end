import { createApp } from "vue";

// * Import genreral scss
import "./style/general.scss";

// * Import bootstrap scss
import * as bootstrap from "bootstrap";

// * import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

// * import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// * import braintree */
import vueBraintree from "vue-braintree";

import App from "./App.vue";

// * import route
import { router } from "./router";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router).mount("#app");
