<template>
<v-layout>
  <v-flex>
    <v-card>
        <v-card-text style="height: 90vh; position: relative">
          <div v-on:click="ClickMap" id="viewDiv" class="viewDiv"></div>
          <v-btn style="bottom: 40px; right: 35px" absolute dark fab bottom right color="pink" @click="GetVehicle()" >
            <v-icon>trending_up</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
  </v-flex>
</v-layout>
</template>

<script>
import esriMethos from './../mixins/esri.js';
export default {
  mixins: [esriMethos],
  data: () => ({

  }),
  methods:{

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

