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
            width: 0
          }
        },
        Vehicles:[],
        vehicleSelected:{
          attributes:{},
          geometries:[],
          lastPosition:null,
          isTraked:null
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
      setTimeout(() => {
        //this.GetAllVehicles()
      }, 0);
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
      },
      getChoferes(){
        return this.$store.state.choferes;
      }
    },
    methods:{
      GetVehicle(VEHICLE_ID){
        var self = this;

        if(self.vehicleSelected.attributes.VEHICLE_ID != VEHICLE_ID){
          console.log(VEHICLE_ID)
          clearInterval(self.vehicleSelected.isTraked);
          self.vehicleSelected = {
            attributes:{},
            geometries:[],
            lastPosition:null,
            isTraked:null
          }

          var query = self.NewQuery();
            query.orderByFields = ["POSI_ID"];
            query.where = `"VEHICLE_ID" = '${VEHICLE_ID}'`;

          self.queryDotsPathTask.execute(query).then(function(result){
            var features = result.features;
            var geometries = [];
            var attributes = {};
            features.forEach(function(element){
              attributes = element.attributes;
              geometries.push(element.geometry);
            });
            self.vehicleSelected = {attributes: attributes, geometry: geometries};
            self.Track(self.vehicleSelected.geometry[0]);
            self.StarSimulation();
          });
        }else{
          self.Track(self.vehicleSelected.lastPosition);
        }
      },
      StarSimulation(){
        var self = this;
        var currentCoordIndex = 0;
        self.vehicleSelected.isTraked =  setInterval(function() {
              self.PointMove(self.vehicleSelected.geometry[currentCoordIndex]);
              self.Intersection(self.vehicleSelected.geometry[currentCoordIndex]);
              //self.Track(self.vehicleSelected.geometry[currentCoordIndex]);
              currentCoordIndex = (currentCoordIndex + 1) % self.vehicleSelected.geometry.length;
          }, 300);
      },
      GetAllVehicles(){
        var self = this;
        self.Vehicles = [];
        var query = self.NewQuery();
          query.orderByFields = ["VEHICLE_ID"],
          query.where = "1=1";

          self.queryDotsPathTask.execute(query).then(function(result){
            var features = result.features;
            var geometries = [];
            var attributes = {};
            var tempVehicle = {};
            self.getChoferes.forEach(function(chofer){ 
              geometries = [];
              features.forEach(function(element){
                if(element.attributes.VEHICLE_ID == chofer.VEHICLE_ID){
                    console.log(chofer.VEHICLE_ID);
                    attributes = element.attributes;
                    geometries.push(element.geometry);
                  }
                  tempVehicle = {attributes: attributes, geometry: geometries};
              });
              self.Vehicles.push({VEHICLE_ID: chofer.VEHICLE_ID, picture: Math.floor((Math.random() * 10) + 1), color: chofer.color, nombre: chofer.text, vehicle: tempVehicle, currentCoordIndex: 0});
              self.$store.state.vehicles = self.Vehicles;
            });
            // console.log(self.Vehicles)
            self.$store.state.vehicles.forEach(function(vehicle){
              self.Simulation(vehicle);
            })
          });
      },
      Start(){
          var self = this;
          self.queryDotsPathTask.execute(self.queryDots).then(function(result){
            self.coords = [];
            var features = result.features;
            features.forEach(function(element){
              var color = element.attributes.COLOR_VEHI;
              var placas = element.attributes.PLACAS_VEH;
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
      Simulation(vehicle){
        var self = this;
        vehicle.currentCoordIndex = 0;
          setInterval(function() {
              self.SinglePointMove(vehicle, vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              self.Intersection(vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              //self.Track(self.trakRout[currentCoordIndex]);
              vehicle.currentCoordIndex = (vehicle.currentCoordIndex + 1) % vehicle.vehicle.geometry.length;
          }, 500);
      },
      SinglePointMove(vehicle, geometry) {
        vehicle.lastPosition = vehicle.currentPosition;
        var newPosition = this.NewGraphic();
        newPosition.geometry = geometry;
        vehicle.currentPosition = newPosition;
          
          this.getView.graphics.remove(vehicle.lastPosition);
          this.getView.graphics.add(newPosition);
      },
      PointMove(geometry) {
          var pointGraphic = this.NewGraphic();
          pointGraphic.geometry = geometry;
          this.vehicleSelected.lastPosition = geometry;
          this.getView.graphics.removeAll();
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
      TrackVehicle(VEHICLE_ID) {
        var vehicle = this.$store.state.vehicles.find(function(element) {
          return element.VEHICLE_ID > VEHICLE_ID;
        });
        this.vehicleSelected = vehicle;
        this.getView.goTo({
            center: vehicle.currentPosition,
            scale: 15000,
        });
    },
      Track(location) {
          var prevLocation = this.getView.center;
          this.getView.goTo({
              center: location,
              scale: 15000,
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