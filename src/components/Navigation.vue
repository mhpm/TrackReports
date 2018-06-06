<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed clipped app >
      <v-list dense>
          <v-list-tile v-for="item in items" :key="item.text" @click="RouteTo(item.route)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">Choferes</v-subheader>
        <v-list>
          <v-list-tile v-for="item in vehicles" :key="item.VEHICLE_ID" avatar @click="Imagen(item.img)">
            <v-list-tile-avatar>
              <img :src="require(`../assets/${item.img}.jpg`)" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.nombre" style="cursor: pointer;" @click="TrackVehicle(item.VEHICLE_ID), cardDisplay? cardDisplay=true:cardDisplay=true"></v-list-tile-title>
          </v-list-tile>
        </v-list>
        <!-- <v-list-tile class="mt-3" @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Channels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Subscriptions</v-list-tile-title>
        </v-list-tile> -->
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="blue" dense fixed clipped-left app >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img height="32" src="../assets/brand.png" alt="">
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Raestreo Vehicular</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-layout row align-center style="max-width: 650px">
        <v-text-field
          :append-icon-cb="() => {}"
          placeholder="Search..."
          single-line
          append-icon="search"
          color="white"
          hide-details
        ></v-text-field>
      </v-layout> -->
    </v-toolbar>

    <v-flex v-if="cardDisplay" class="floatCard">
      <v-card>
        <v-card-title primary-title>
           <v-list-tile-avatar>
              <img :src="require(`../assets/${vehicleSelected.img}.jpg`)" alt="">
            </v-list-tile-avatar>
          <div>
            <h3 class="headline mb-0">Placas: {{vehicleSelected.PLACAS_VEH}}</h3>
            <div>
              Chofer: {{vehicleSelected.nombre}}<br>
              Color del Vehiculo: {{vehicleSelected.COLOR_VEHI}} <br>
              Tipo de vehiculo: {{vehicleSelected.TIPO_VEHI}}
            </div>
          </div>
        </v-card-title>
        <v-card-actions>
          <!-- <v-btn flat color="orange">Share</v-btn> -->
          <v-btn flat color="orange" @click="StopTrack(), cardDisplay = !cardDisplay">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import esriMethos from './../mixins/esri.js';
export default {
  mixins: [esriMethos],
  data: () => ({
    cardDisplay:false,
    drawer: false,
    items: [
      { icon: 'map', text: 'Mapa', route:"mapa"},
      { icon: 'assignment_turned_in', text: 'Reporte', route:"report"}
    ]
  }),
  methods:{
    StopTrack(){
      clearInterval(this.vehicleSelected.isTraked)
    },
    RouteTo(route){
      this.$router.push({ name: route });
    },
    Imagen(img){
      console.log(img)
    }
  },
  computed:{
      vehicles(){
          return this.$store.state.vehicles;
      }
  },
  created(){
    //console.log(this.choferes);
    
  }
}
</script>

<style scoped>
.floatCard {
  position: fixed;
  top: 100px;
  right:50px;
  width: auto;
  z-index: 1;
}
.floatCard .card {
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.66) !important;
}
</style>

