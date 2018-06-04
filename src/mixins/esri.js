/* eslint-disable */ 
import { loadModules } from 'esri-loader';
var moment = require('moment');
var esri = {
    data() {
      return {
        trakRout:[],
        coords:[],
        markerSymbol: {
          type: "simple-marker",
          color: [226, 119, 40],
        },
        camionetaPic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/296/296211.svg",
          width: "32px",
          height: "32px"
        },
        pickUpPic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/517/517554.svg",
          width: "32px",
          height: "32px"
        },
        dompePic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/324/324231.svg",
          width: "32px",
          height: "32px"
        },
        truckPic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/296/296217.svg",
          width: "32px",
          height: "32px"
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
        queryDots: null
        //clickPosition: null
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
    
            this.NewGraphic = function(picture){ 
              return new Graphic({
                symbol: picture
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
    
           // this.map.add(this.dotsLayer);
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

            // this.GetClickPosition = function () {
            //     var self = this;
            //     this.getView.on("click", function(event) {
            //         event.stopPropagation(); // overwrite default click-for-popup behavior
            
            //         // Get the coordinates of the click on the view
            //         var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            //         var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
            //         var position = event.mapPoint;
            //         self.clickPosition = position;
            //     });
            // }
    
    
          }).catch(err => {
            // handle any script or module loading errors
            console.error(err);
          });
      },
    created(){
      // let start = Date.now();

      // setTimeout(() => {
      //   console.log(this.GetDateFromMS(Date.now() - start));
      // }, 3000);

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
      GetDateFromMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        return { dias: d, horas: h, minutos: m, segundos: s };
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
            self.getChoferes.slice(1,3).forEach(function(chofer){ 
              geometries = [];
              features.forEach(function(element){
                if(element.attributes.VEHICLE_ID == chofer.VEHICLE_ID){
                    //console.log(chofer.VEHICLE_ID);
                    attributes = element.attributes;
                    geometries.push(element.geometry);
                  }
                  tempVehicle = {attributes: attributes, geometry: geometries};
              });
              self.Vehicles.push({
                VEHICLE_ID: tempVehicle.attributes.VEHICLE_ID, 
                COLOR_VEHI: tempVehicle.attributes.COLOR_VEHI, 
                PLACAS_VEH: tempVehicle.attributes.PLACAS_VEH,
                TIPO_VEHI: tempVehicle.attributes.TIPO_VEHI,
                picture: Math.floor((Math.random() * 100) + 1), 
                nombre: chofer.text, vehicle: tempVehicle, 
                currentCoordIndex: 0,
                lastPlace:'',
                check:[],
                inSide: false,
                outSide: null
              });
              self.$store.state.vehicles = self.Vehicles;
            });
            console.log(self.$store.state.vehicles)
            self.$store.state.vehicles.forEach(function(vehicle){
              self.Simulation(vehicle);
            })
          });
      },
      Simulation(vehicle){
        var self = this;
        vehicle.currentCoordIndex = 0;
          setInterval(function() {
              self.SinglePointMove(vehicle, vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              //self.Intersection(vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              self.Intersection(vehicle, vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              vehicle.currentCoordIndex = (vehicle.currentCoordIndex + 1) % vehicle.vehicle.geometry.length;
          }, 1000);
      },
      SinglePointMove(vehicle, geometry) {
        var self = this;
        vehicle.lastPosition = vehicle.currentPosition;
        var newPosition = this.NewGraphic(self.pickUpPic);
        
        switch(vehicle.COLOR_VEHI){
          case "Rojo":
            newPosition = this.NewGraphic(self.camionetaPic);
          break;
          case "Verde":
            newPosition = this.NewGraphic(self.truckPic);
          break;
          case "Gris":
            newPosition = this.NewGraphic(self.dompePic);
          break;
          case "Blanco":
            newPosition = this.NewGraphic(self.pickUpPic);
          break;
        }
       
          newPosition.geometry = geometry;
          vehicle.currentPosition = newPosition;
          self.getView.graphics.remove(vehicle.lastPosition);
          self.getView.graphics.add(newPosition);
      },
      Intersection(vehicle, carPosition){
        var self = this;
        this.queryCarIntersection.geometry = carPosition;
        this.geoqueryTask.execute(this.queryCarIntersection).then(function(results){
          if(results.features.length > 0){
            //console.log(results.features.length);
            if(!vehicle.inSide){
              let place = results.features[0].attributes.NOMBRE
              let check = {
                inDate: new Date(Date.now()),
                outDate:null,
                time: null,
                Lugar: place
              }
              vehicle.check.push(check);
              vehicle.lastPlace = place;
              vehicle.inSide = true;
              vehicle.outSide = false;
              console.log(vehicle);
            }
          }else {
            //console.log(results.features.length);
            //console.log(vehicle.outSide);
            if(!vehicle.outSide){
              vehicle.check[vehicle.check.length - 1].outDate = new Date( Date.now());
              let dateDiff = self.GetDateFromMS(vehicle.check[vehicle.check.length - 1].outDate - vehicle.check[vehicle.check.length - 1].inDate);
              vehicle.check[vehicle.check.length - 1].time = dateDiff;
              vehicle.inSide = false;
              vehicle.outSide = true;
              console.log(vehicle.check);
            }
          }
        });
          
        this.geoqueryTask.executeForCount(this.queryCarIntersection).then(function(results){
          //console.log(results);
        });
      },
      TrackVehicle(VEHICLE_ID) {
        var self = this;
        if(self.vehicleSelected.VEHICLE_ID != VEHICLE_ID){
          console.log('diferente')
          var vehicle = self.$store.state.vehicles.find(function(element) {
            return element.VEHICLE_ID == VEHICLE_ID;
          });
        
          clearInterval(self.vehicleSelected.isTraked)
          self.vehicleSelected = vehicle;
          self.vehicleSelected.isTraked = setInterval(function() { 
            self.getView.goTo({
              center: vehicle.currentPosition,
              scale: 16000,
            });
          }, 500);
        }else{
          console.log('mismo')
        }

      },
      Report(){

      },
      Test(){
        // GetVehicle(VEHICLE_ID){
        //   var self = this;

        //   if(self.vehicleSelected.attributes.VEHICLE_ID != VEHICLE_ID){
        //     console.log(VEHICLE_ID)
        //     clearInterval(self.vehicleSelected.isTraked);
        //     self.vehicleSelected = {
        //       attributes:{},
        //       geometries:[],
        //       lastPosition:null,
        //       isTraked:null
        //     }

        //     var query = self.NewQuery();
        //       query.orderByFields = ["POSI_ID"];
        //       query.where = `"VEHICLE_ID" = '${VEHICLE_ID}'`;

        //     self.queryDotsPathTask.execute(query).then(function(result){
        //       var features = result.features;
        //       var geometries = [];
        //       var attributes = {};
        //       features.forEach(function(element){
        //         attributes = element.attributes;
        //         geometries.push(element.geometry);
        //       });
        //       self.vehicleSelected = {attributes: attributes, geometry: geometries};
        //       self.Track(self.vehicleSelected.geometry[0]);
        //       self.StarSimulation();
        //     });
        //   }else{
        //     self.Track(self.vehicleSelected.lastPosition);
        //   }
        // },
        // StarSimulation(){
        //   var self = this;
        //   var currentCoordIndex = 0;
        //   self.vehicleSelected.isTraked =  setInterval(function() {
        //         self.PointMove(self.vehicleSelected.geometry[currentCoordIndex]);
        //         self.Intersection(self.vehicleSelected.geometry[currentCoordIndex]);
        //         //self.Track(self.vehicleSelected.geometry[currentCoordIndex]);
        //         currentCoordIndex = (currentCoordIndex + 1) % self.vehicleSelected.geometry.length;
        //     }, 300);
        // },
        // Start(){
        //     var self = this;
        //     self.queryDotsPathTask.execute(self.queryDots).then(function(result){
        //       self.coords = [];
        //       var features = result.features;
        //       features.forEach(function(element){
        //         var color = element.attributes.COLOR_VEHI;
        //         var placas = element.attributes.PLACAS_VEH;
        //         var id = element.attributes.POSI_ID;
        //         var latitude = element.geometry.latitude;
        //         var longitude = element.geometry.longitude;
        //         self.coords.push({"COLOR_VEHI ": color, "PLACAS_VEH ": placas, "POSI_ID": id , "latitude": latitude, "longitude":longitude})
        //         self.trakRout.push(element.geometry);
        //       });
        //       //console.log(self.coords);
        //       self.Track(self.trakRout[0]);
        //       self.Simulation();
        //     });
        // },
        // PointMove(geometry) {
        //     var pointGraphic = this.NewGraphic();
        //     pointGraphic.geometry = geometry;
        //     this.vehicleSelected.lastPosition = geometry;
        //     this.getView.graphics.removeAll();
        //     this.getView.graphics.add(pointGraphic);
        // },
        // ClickMap(name){
        //     var self = this;
        //     self.GetClickPosition();
        //     setTimeout(() => {
        //         self.CreateVeicles(self.clickPosition, name);
        //     }, 500);
        // },
        // CreateVeicles(location, name='nadie'){
        //     var point = {
        //         type: "point", // autocasts as new Point()
        //         longitude: location.longitude,
        //         latitude: location.latitude
        //       };
      
        //       // Create a graphic and add the geometry and symbol to it
        //       var pointGraphic = this.NewGraphic();
        //       pointGraphic.geometry = point;
        //       pointGraphic.attributes = {Nombre: name, Vehiculo: '001', Palacas: 'abc'}
        //       this.getView.graphics.add(pointGraphic);
        // },
        // TestTrak(name){
        //     console.log('Traking: ' + name);
        //     //this.Track(self.trakRout[0]);
        // }
      } 
    }
  }
export default esri;