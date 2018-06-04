import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import moment from "moment";
Vue.prototype.moment = moment;

import { loadScript } from "esri-loader";
// preload the ArcGIS API
const options = {
  url: "https://js.arcgis.com/4.7/"
};
loadScript(options);

import Navigation from "./components/Navigation.vue";
Vue.component("app-navigation", Navigation);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
