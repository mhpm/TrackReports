import Vue from "vue";
import Vuex from "vuex";
/* eslint-disable */ 
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    view: null,
    choferes: [
      { id: 1, VEHICLE_ID: "v2kn:01008985SKYCCFA", text: "Joseph" },
      { id: 2, VEHICLE_ID: "v2kn:01008985SKYCCFB", text: "Juan" },
      { id: 3, VEHICLE_ID: "v2kn:01008985SKYCCFC", text: "Pedro" },
      { id: 4, VEHICLE_ID: "v2kn:01008985SKYCCFD", text: "Carlos" }
      // { id: 5, picture: 78, color: "Gris", text: "MKBHD" }
    ],
    coords: [],
    trackCoods: [],
    vehicles:[]
  }
});
