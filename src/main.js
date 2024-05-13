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

// * import specific icons */
import {
  faCircleArrowLeft,
  faChevronDown,
  faMagnifyingGlass,
  faUser,
  faBagShopping,
  faStar,
  faHeart,
  faMaximize,
  faEye,
  faChevronLeft,
  faChevronRight,
  faCalendarDays,
  faComments,
  faPlus,
  faLink,
  faLocationDot,
  faPhone,
  faEnvelope,
  faPaperPlane,
  faCopyright,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebookF,
  faTwitter,
  faGooglePlusG,
  faSkype,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

// * add icons to the library */
library.add(
  faCircleArrowLeft,
  faChevronDown,
  faMagnifyingGlass,
  faUser,
  faBagShopping,
  faStar,
  faHeart,
  faMaximize,
  faEye,
  faChevronLeft,
  faChevronRight,
  faCalendarDays,
  faComments,
  faPlus,
  faLink,
  faLocationDot,
  faPhone,
  faEnvelope,
  faPaperPlane,
  faFacebookF,
  faTwitter,
  faGooglePlusG,
  faSkype,
  faInstagram,
  faCopyright,
  faCartShopping
);

import App from "./App.vue";

// * import route
import { router } from "./router";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router).mount("#app");
