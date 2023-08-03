import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//moon
import { faMoon } from "@fortawesome/free-solid-svg-icons";
//sun
import { faSun } from "@fortawesome/free-solid-svg-icons";
//caret
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
//caret
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
//sort
import { faSort } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faMoon);
library.add(faSun);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faSort);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
