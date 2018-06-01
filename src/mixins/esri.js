/* eslint-disable */ 
import { loadModules } from 'esri-loader';
var esri = {
    data() {
      return {
        trakRout:[],
        coords:[],
        markerSymbol: {
          type: "simple-marker",
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        },
        geoqueryTask: null,
        queryCarIntersection: null,
        queryDotsPathTask: null,
        queryDots: null,
        clickPosition: null
      }
    },
    mounted() {
        loadModules([
          'esri/Map',
          'esri/views/MapView',
          "esri/Graphic",
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/FeatureLayer",
          "vue"
          ])
        .then(([Map, MapView, Graphic, QueryTask, Query, FeatureLayer, Vue]) => {
    
            this.NewGraphic = function(){ 
              return new Graphic({
                symbol: this.markerSymbol
              })
            };

            // Vehicles 

    
            // points layer
            this.dotsLayer = new FeatureLayer({
              url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/ArcGIS/rest/services/RastreoVehicular/FeatureServer/0"
            });
    
            // geocerca layer
            this.cercasLayer = new FeatureLayer({
              url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/ArcGIS/rest/services/RastreoVehicular/FeatureServer/1"
            });
      
            this.map = new Map({
              basemap: "topo"
            });
    
            this.map.add(this.dotsLayer);
            this.map.add(this.cercasLayer);
    
            this.$store.state.view = new MapView({
              center: [-93.31210146474633, 18.061566162741393],
              container: "viewDiv",
              map: this.map,
              zoom: 13
            });
    
            // path for all geocercas
            this.geoqueryTask = new QueryTask({
              url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/ArcGIS/rest/services/RastreoVehicular/FeatureServer/1"
            });
    
            // query for detect intersection with the car
            this.queryCarIntersection = new Query({
              distance: 5,
              units: "meters",
              spatialRelationship: "intersects" // All features that intersect 100 mile buffer
            });
    
            // path for dots layer
            this.queryDotsPathTask = new QueryTask({
              url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/ArcGIS/rest/services/RastreoVehicular/FeatureServer/0"
            });
    
            this.queryDots = new Query({
              outFields: ["*"],
              orderByFields: ["COLOR_VEHI"],
              returnGeometry: true,
              where: "1=1"
            });

            this.NewQuery = function() {
              return new Query({
                outFields: ["*"],
                orderByFields: ["POSI_ID"],
                returnGeometry: true
              })
            }

            this.GetClickPosition = function () {
                var self = this;
                this.getView.on("click", function(event) {
                    event.stopPropagation(); // overwrite default click-for-popup behavior
            
                    // Get the coordinates of the click on the view
                    var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                    var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
                    var position = event.mapPoint;
                    self.clickPosition = position;
                });
            }
    
    
          }).catch(err => {
            // handle any script or module loading errors
            console.error(err);
          });
      },
    created(){
    },
    computed:{
      getCoords(){
        return this.$store.state.coords;
      },
      getTrakRout(){
        return this.$store.state.trackCoods;
      },
      getView(){
        return this.$store.state.view;
      }
    },
    methods:{
        GetVehicle(color){
          var self = this;
          var query = self.NewQuery();
          query.where = `"COLOR_VEHI" = '${color}'`;
          console.log(color + ' ' + query.where);
          
          self.queryDotsPathTask.execute(query).then(function(result){
            self.coords = [];
            var features = result.features;
            features.forEach(function(element){
              var color = element.attributes.COLOR_VEHI ;
              var placas = element.attributes.PLACAS_VEH  ;
              var id = element.attributes.POSI_ID;
              var latitude = element.geometry.latitude;
              var longitude = element.geometry.longitude;
              self.coords.push({"COLOR_VEHI ": color, "PLACAS_VEH ": placas, "POSI_ID": id , "latitude": latitude, "longitude":longitude})
              self.trakRout.push(element.geometry);
            });
            //console.log(self.coords);
            self.$store.state.coords = self.coords;
            self.$store.state.trackCoods = self.trakRout;
            self.Track(self.getTrakRout[0]);
            self.Simulation();
            //console.log(self.$store.state.coords);
          });
        },
        Start(){
            var self = this;
            self.queryDotsPathTask.execute(self.queryDots).then(function(result){
              self.coords = [];
              var features = result.features;
              features.forEach(function(element){
                var color = element.attributes.COLOR_VEHI ;
                var placas = element.attributes.PLACAS_VEH  ;
                var id = element.attributes.POSI_ID;
                var latitude = element.geometry.latitude;
                var longitude = element.geometry.longitude;
                self.coords.push({"COLOR_VEHI ": color, "PLACAS_VEH ": placas, "POSI_ID": id , "latitude": latitude, "longitude":longitude})
                self.trakRout.push(element.geometry);
              });
              //console.log(self.coords);
              self.Track(self.trakRout[0]);
              self.Simulation();
            });
        },
        Simulation(){
            var currentCoordIndex = 0;
            var self = this;
            setInterval(function() {
                self.PointMove(self.getCoords[currentCoordIndex]);
                self.Intersection(self.getTrakRout[currentCoordIndex]);
                //self.Track(self.trakRout[currentCoordIndex]);
                currentCoordIndex = (currentCoordIndex + 1) % self.coords.length;
            }, 300);
        },
        PointMove(coords) {
            var point = {
                type: "point",
                longitude: coords.longitude,
                latitude: coords.latitude,
            };
            var pointGraphic = this.NewGraphic();
            pointGraphic.geometry = point;
            pointGraphic.attributes = {Nombre: 'Michelle', Vehiculo: '001', Palacas: 'abc'}
            //this.getView.graphics.removeAll();
            this.getView.graphics.add(pointGraphic);
        },
        Intersection(carPosition){
            this.queryCarIntersection.geometry = carPosition;
            this.geoqueryTask.execute(this.queryCarIntersection).then(function(results){
                //if(results.features != null)
                console.log("Esta en: " + results.features[0].attributes.NOMBRE);
            });

            this.geoqueryTask.executeForCount(this.queryCarIntersection).then(function(results){
                //console.log(results);
            });
        },
        Track(location) {
            var prevLocation = this.getView.center;
            this.getView.goTo({
                center: location,
                scale: 14000,
            });
            prevLocation = location.clone();
        },
        ClickMap(name){
            var self = this;
            self.GetClickPosition();
            setTimeout(() => {
                self.CreateVeicles(self.clickPosition, name);
            }, 500);
        },
        CreateVeicles(location, name='nadie'){
            var point = {
                type: "point", // autocasts as new Point()
                longitude: location.longitude,
                latitude: location.latitude
              };
      
              // Create a graphic and add the geometry and symbol to it
              var pointGraphic = this.NewGraphic();
              pointGraphic.geometry = point;
              pointGraphic.attributes = {Nombre: name, Vehiculo: '001', Palacas: 'abc'}
              this.getView.graphics.add(pointGraphic);
        },
        TestTrak(name){
            console.log('Traking: ' + name);
            //this.Track(self.trakRout[0]);
        }
    }
  }
export default esri;