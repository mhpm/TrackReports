<template>
  <v-layout>
    <v-flex>
      <h2>Reporte de choferes</h2> <br>
       <v-expansion-panel>
        <v-expansion-panel-content v-for="(item, index) in vehicles" :key="index">
          <div slot="header">
            <v-avatar size="30">  <img :src="require(`../assets/${item.img}.jpg`)" alt=""></v-avatar>
            <span class="body-1"> {{item.nombre}}, Placas: {{item.PLACAS_VEH}}</span>
          </div>
          <v-card>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="item.check"
                    hide-actions
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-left">{{ props.item.lugar }}</td>
                      <td class="text-left">{{ props.item.fechaEntrada }}</td>
                      <td class="text-left">{{ props.item.fechaSalida }}</td>
                      <td v-if="props.item.time != null" class="text-left"> {{props.item.time.h}}:{{props.item.time.m}}:{{props.item.time.s}}</td>
                    </template>
                </v-data-table>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      headers:[
        {
          text: "Lugar",
          sortable: false
        },
        {
          text: "Fecha Entrada",
          sortable: false
        },
        {
          text: "Fecha Salida",
          sortable: false
        },
        {
          text: "Tiempo",
          sortable: false
        }
      ]
    }),
    computed:{
        vehicles(){
            return this.$store.state.vehicles;
        }
    }
  }
</script>

<style scoped>

</style>
