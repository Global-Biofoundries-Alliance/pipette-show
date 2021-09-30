import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import mitt from "mitt";

import 'normalize.css';
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);

import VueFinalModal from "vue-final-modal";


import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleLeft,
  faPlus,
  faCloudUploadAlt,
  faDownload,
  faPalette,
  faFileMedical,
  faFill,
  faSignal,
  faCheck,
  faTrashAlt,
  faMagic,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faUndo,
  faCropAlt,
  faHandPaper,
  faQrcode,
  faCamera,
  faEraser,
  faArrowsAltV,
  faHome,
  faCogs,
  faKeyboard,
  faClock,
  faFileCode
} from "@fortawesome/free-solid-svg-icons";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";

library.add(
  faArrowCircleLeft,
  faPlus,
  faCloudUploadAlt,
  faDownload,
  faGoogleDrive,
  faPalette,
  faFileMedical,
  faFill,
  faSignal,
  faCheck,
  faTrashAlt,
  faMagic,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faUndo,
  faCropAlt,
  faHandPaper,
  faQrcode,
  faCamera,
  faCopy,
  faEraser,
  faArrowsAltV,
  faHome,
  faCogs,
  faKeyboard,
  faClock,
  faFileCode
);

const app = createApp(App).use(store).use(router).use(VueFinalModal());
app.config.globalProperties.$eventbus = mitt();
app.mount("#app");
