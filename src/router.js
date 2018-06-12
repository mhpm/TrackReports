import Vue from "vue";
import Router from "vue-router";
import Mapa from "./views/Map.vue";
import Report from "./views/Report.vue";
import GeoCercas from "./views/GeoCercas.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "mapa",
      component: Mapa
    },
    {
      path: "/report",
      name: "report",
      component: Report
    },
    {
      path: "/geocercas",
      name: "geocercas",
      component: GeoCercas
    }
  ],
  mode: "history"
});
