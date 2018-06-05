<template>
  <v-layout>
    <v-flex>
      <v-card>
         <v-card-title primary-title>
           <div>
            <h3 class="headline mb-0"><v-icon x-large>trending_up</v-icon> Reporte General</h3>
           </div>
          </v-card-title>
         <v-list>
          <v-list-group prepend-icon="directions_car" v-for="(item, index) in vehicles" :key="index">
            <v-list-tile slot="activator">
              <v-list-tile-title> Vehiculo: {{item.VEHICLE_ID}} - Placas: {{item.PLACAS_VEH}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-avatar size="30">
                <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
              </v-list-tile-avatar>
              <v-list-tile-title>Chofer: {{item.nombre}}</v-list-tile-title>
            </v-list-tile>
            <v-list-group v-for="(subItem, index) in item.check" :key="index" sub-group no-action >
              <v-list-tile slot="activator">
                <v-list-tile-title>{{subItem.lugar}}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-sub-title>Entrada: {{subItem.inDate}}</v-list-tile-sub-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-sub-title>Salida: {{subItem.outDate}}</v-list-tile-sub-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-sub-title v-if="subItem.time != null">Tiempo: {{subItem.time.h}}:{{subItem.time.m}}:{{subItem.time.s}}</v-list-tile-sub-title>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-card>
       <!-- <v-expansion-panel>
        <v-expansion-panel-content v-for="(item,i) in 5" :key="i">
          <div slot="header">
            <v-avatar size="30">  <img :src="`https://randomuser.me/api/portraits/men/10.jpg`" alt=""></v-avatar> Michelle
          </div>
          <v-card>
            <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel> -->
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({}),
    computed:{
        vehicles(){
            return this.$store.state.vehicles;
        }
    }
  }
</script>

<style scoped>

</style>
