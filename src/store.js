import Vue from "vue";
import Vuex from "vuex";
/* eslint-disable */ 
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    view: "",
    choferes: [
      { id: 1, picture: 28, VEHICLE_ID: "v2kn:01008985SKYCCFA", color: "Verder", text: "Joseph" },
      { id: 2, picture: 38, VEHICLE_ID: "v2kn:01008985SKYCCFB", color: "Gris", text: "Juan" },
      { id: 3, picture: 48, VEHICLE_ID: "v2kn:01008985SKYCCFC", color: "Rojo", text: "Pedro" },
      { id: 4, picture: 58, VEHICLE_ID: "v2kn:01008985SKYCCFD", color: "Verde", text: "Michelle" }
      // { id: 5, picture: 78, color: "Gris", text: "MKBHD" }
    ],
    coords: [],
    trackCoods: []
  }
});
