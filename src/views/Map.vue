<template>
<v-layout>
  <v-layout>
    <v-flex>
      <v-card>
          <v-card-text style="height: 90vh; position: relative">
            <div id="viewDiv" class="viewDiv"></div>
            <v-btn style="bottom: 50px; right: 50px" absolute dark bottom right color="red" @click="GetAllVehicles" >
              <v-icon></v-icon> Inicial Simulacion
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
  }),
  methods:{
   
  },
  computed:{
     
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
</style>

