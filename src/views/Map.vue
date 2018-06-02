<template>
<v-layout>
  <v-navigation-drawer v-model="drawer" fixed clipped app >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" @click="">
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
          <v-list-tile v-for="item in vehicles" :key="item.VEHICLE_ID" avatar @click="">
            <v-list-tile-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.nombre" style="cursor: pointer;" @click="TrackVehicle(item.VEHICLE_ID), cardDisplay? cardDisplay=true:cardDisplay=true"></v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3" @click="">
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
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="red" dense fixed clipped-left app >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-icon class="mx-3">fab fa-youtube</v-icon> -->
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Track Report</span>
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
        <div>
          <h3 class="headline mb-0">ID: {{vehicleSelected.attributes.VEHICLE_ID}}</h3>
          <div>Located two hours south of Sydney in the <br>Southern Highlands</div>
        </div>
      </v-card-title>
      <v-card-actions>
        <v-btn flat color="orange">Share</v-btn>
        <v-btn flat color="orange" @click="StopTrack(), cardDisplay = !cardDisplay">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
  <v-layout>
    <v-flex>
      <v-card>
          <v-card-text style="height: 90vh; position: relative">
            <div v-on:click="ClickMap" id="viewDiv" class="viewDiv"></div>
            <v-btn style="bottom: 50px; right: 50px" absolute dark fab bottom right color="pink" @click="GetAllVehicles" >
              <v-icon>trending_up</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
</v-layout>
</template>

<script>
import esriMethos from './../mixins/esri.js';
export default {
  mixins: [esriMethos],
  data: () => ({
    cardDisplay:false,
    drawer: false,
    items: [
        { icon: 'trending_up', text: 'Reporte General' },
        { icon: 'subscriptions', text: 'Subscriptions' },
        { icon: 'history', text: 'History' },
        { icon: 'featured_play_list', text: 'Playlists' },
        { icon: 'watch_later', text: 'Watch Later' }
    ]
  }),
  methods:{
    StopTrack(){
      clearInterval(this.vehicleSelected.isTraked)
    }
  },
  computed:{
      choferes(){
          return this.$store.state.choferes;
      },
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
.viewDiv {
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.floatCard {
  position: fixed;
  top: 100px;
  right: 50px;
  width: auto;
  z-index: 1;
}
.floatCard .card {
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.66) !important;
}
</style>

