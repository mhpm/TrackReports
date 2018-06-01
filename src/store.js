import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    view: "",
    choferes: [
      { id: 1, picture: 28, color: "Gris", text: "Joseph" },
      { id: 2, picture: 38, color: "Verde", text: "Apple" },
      { id: 3, picture: 48, color: "Blanco", text: "Xbox Ahoy" },
      { id: 4, picture: 58, color: "Rojo", text: "Nokia" }
      // { id: 5, picture: 78, color: "Gris", text: "MKBHD" }
    ],
    coords: [],
    trackCoods: []
  }
});
