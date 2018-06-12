<template>
     <v-layout>
    <v-flex>
      <h2>Reporte de Pozos</h2> <br>
       <v-expansion-panel>
        <v-expansion-panel-content v-for="(item, index) in geocercas" :key="index">
          <v-layout slot="header" align-center row spacer>
            <v-flex>
            <span class="body-1"> {{item.lugar}}</span>
            </v-flex>
          </v-layout>
          <v-card>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="item.checks"
                    hide-actions
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-left">{{ props.item.chofer }}</td>
                      <td class="text-left">{{ props.item.TIPO_VEHI }}</td>
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
            text: "Chofer",
            sortable: false
          },
          {
            text: "Tipo de Vehiculo",
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
          geocercas(){
            var checks = this.$store.state.checks;
            var geocercas = [];
            var places = [...new Set(checks.map(item => item.lugar))];

            places.forEach(place => {
              geocercas.push({lugar:place, checks:[]});
            });

            this.$store.state.checks.forEach(check => {
              geocercas.find(geo => {
                if(geo.lugar == check.lugar){
                  geo.checks.push(check);
                }
              })
            });

            return geocercas;
          }
      }
    }
</script>

<style scoped>

</style>