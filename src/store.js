import Vue from "vue";
import Vuex from "vuex";
/* eslint-disable */ 
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    view: null,
    map: null,
    choferes: [
      { id: 1, VEHICLE_ID: "v2kn:01008985SKYCCFA", text: "Michelle Perez",   img:"pic1",  type: "Nitrógeno"  },
      { id: 2, VEHICLE_ID: "v2kn:01008985SKYCCFB", text: "Roymel Gomez"  ,   img:"pic4",  type: "Líneas de Acero"  },
      { id: 3, VEHICLE_ID: "v2kn:01008985SKYCCFC", text: "Raul toledano"  ,  img:"pic3",  type: "Material Eléctrico"  },
      { id: 4, VEHICLE_ID: "v2kn:01008985SKYCCFD", text: "Hermilo Nazario" , img:"pic2",  type: "Aceite"  }
    ],
    coords: [],
    trackCoods: [],
    vehicles:[]
  }
});
