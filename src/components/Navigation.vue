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
          <v-list-tile v-for="item in vehicles" :key="item.VEHICLE_ID" avatar @click="TrackVehicle(item.VEHICLE_ID)">
            <v-list-tile-avatar>
              <img :src="require(`../assets/${item.img}.jpg`)" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.nombre" style="cursor: pointer;" @click="cardDisplay? cardDisplay=true:cardDisplay=true"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="blue" dense fixed clipped-left app >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img height="32" src="../assets/brand.png" alt="">
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Monitoreo del programa operativo semanal</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
              Vehiculo: {{vehicleSelected.TIPO_VEHI}} <br>
              Proceso: {{vehicleSelected.Proceso}}
              <!-- Distancia recorrida: {{vehicleSelected.distance}} Km -->
            </div>
          </div>
        </v-card-title>
        <v-card-actions>
          <!-- <v-btn flat color="orange">Share</v-btn> -->
          <v-btn flat color="orange" @click="RemovePathHistory(), cardDisplay = !cardDisplay">Cerrar</v-btn>
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
      { icon: 'assignment_ind', text: 'Reporte de choferes', route:"report"},
      { icon: 'assignment_turned_in', text: 'Reporte de Pozos', route:"geocercas"}
    ]
  }),
  methods:{
    StopTrack(){
      clearInterval(this.vehicleSelected.isTraked)
    },
    RouteTo(route){
      this.$router.push({ name: route });
    }
  },
  computed:{
      vehicles(){
          return this.$store.state.vehicles;
      }
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

