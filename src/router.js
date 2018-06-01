import Vue from "vue";
import Router from "vue-router";
import Mapa from "./views/Map.vue";
import Report from "./views/Report.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "map",
      component: Mapa
    },
    {
      path: "/report",
      name: "report",
      component: Report
    }
  ],
  mode: "history"
});
