/* eslint-disable */ 
import { loadModules } from 'esri-loader';
import DateFormat from 'dateformat'
  DateFormat.i18n = {
    dayNames: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'viernes', 'Sabado'
    ],
    monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
  };

var esri = {
    data() {
      return {
        trakRout:[],
        coords:[],
        markerSymbol: {
          type: "simple-marker",
          color: [255, 255, 0],
          width: "8px",
          height: "8px"
        },
        camionetaPic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/296/296211.svg",
          width: "40px",
          height: "40px"
        },
        pickUpPic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/517/517554.svg",
          width: "40px",
          height: "40px"
        },
        dompePic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/324/324231.svg",
          width: "40px",
          height: "40px"
        },
        truckPic: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "https://image.flaticon.com/icons/svg/296/296217.svg",
          width: "40px",
          height: "40px"
        },
        Vehicles:[],
        vehicleSelected:null,
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
          "esri/widgets/BasemapToggle",
          "esri/Graphic",
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/FeatureLayer",
          "vue"
          ])
      .then(([Map, MapView, BasemapToggle, Graphic, QueryTask, Query, FeatureLayer, Vue]) => {
            
        this.NewGraphic = function(picture){
          // var choferPich = {
          //   type: "picture-marker",
          //   url: `https://randomuser.me/api/portraits/men/${picture}.jpg`,
          //   width: "32px",
          //   height: "32px"
          // }

          return new Graphic({
            symbol: picture
          })
        };

        this.NewGraphicPoint = function(){
          return new Graphic({
            symbol: markerSymbol
          })
        };

        
        if(this.$store.state.view == null){
          
          // points layer
          this.dotsLayer = new FeatureLayer({
            url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/ArcGIS/rest/services/RastreoVehicular/FeatureServer/0"
          });
          
          // geocerca layer
          this.cercasLayer = new FeatureLayer({
            url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/ArcGIS/rest/services/RastreoVehicular/FeatureServer/1"
          });
          
          this.$store.state.map = new Map({
            basemap: "topo"
          });
          
          //this.$store.state.map.add(this.dotsLayer);
          this.$store.state.map.add(this.cercasLayer);
          
          this.$store.state.view = new MapView({
            center: [-93.31210146474633, 18.061566162741393],
            container: "viewDiv",
            map: this.$store.state.map,
            zoom: 13
          });

          var toggle = new BasemapToggle({
            // 2 - Set properties
            view: this.$store.state.view, // view that provides access to the map's 'topo' basemap
            nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
          });

          this.$store.state.view.ui.add(toggle, "bottom-left");

        }else{
          this.$store.state.view.container = "viewDiv";
        }

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

        this.NewPopUp = function(){
          return  new PopupTemplate({
            title: "Results title",
            content: "Results: Attributes"
          });
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
  
  
        })
      .catch(err => { console.error(err); });
    },
    created(){},
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
        return { d: d, h: h, m: m, s: s };
      },
      GetAllVehicles(){
        var self = this;
        self.Vehicles = [];
        var query = self.NewQuery();
          query.orderByFields = ["POSI_ID"],
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
                TIPO_VEHI: chofer.type,
                picture: Math.floor((Math.random() * 50) + 1),
                img: chofer.img, 
                nombre: chofer.text,
                vehicle: tempVehicle, 
                currentCoordIndex: 0,
                lastPlace:'',
                check:[],
                inSide: false,
                outSide: null,
                path:[],
                isTraked: null
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
              self.Intersection(vehicle, vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              vehicle.currentCoordIndex = (vehicle.currentCoordIndex + 1) % vehicle.vehicle.geometry.length;
          }, 2000);
      },
      SinglePointMove(vehicle, geometry) {
        var self = this;
        vehicle.lastPosition = vehicle.currentPosition;
        //let newPosition = self.NewGraphic(vehicle.picture);
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
         // newPosition.popup = this.NewPopUp();
       
          newPosition.geometry = geometry;
          vehicle.currentPosition = newPosition;
          vehicle.path.push(vehicle.lastPosition);
          self.getView.graphics.remove(vehicle.lastPosition);
          self.getView.graphics.add(newPosition);
      },
      VehiclePathHistory() {
        var self = this;  
        console.log('si');
        self.vehicleSelected.pathHistory = [];
        self.vehicleSelected.path.forEach(function(graphic){
          if(graphic != undefined){
            graphic.symbol = self.markerSymbol;
            self.vehicleSelected.pathHistory.push(graphic);
            self.getView.graphics.add(graphic);
          }
        });
      },
      Intersection(vehicle, carPosition){
        var self = this;
        this.queryCarIntersection.geometry = carPosition;
        this.geoqueryTask.execute(this.queryCarIntersection).then(function(results){
          if(results.features.length > 0){
            if(!vehicle.inSide){
              let place = results.features[0].attributes.NOMBRE
              let check = {
                inDate: new Date(Date.now()),
                fechaEntrada: DateFormat(new Date(Date.now()), 'dddd dd/mmmm/yyyy - HH:MM:ss TT'),
                fechaSalida: null,
                outDate:null,
                time: null,
                lugar: place
              }
              vehicle.check.push(check);
              vehicle.lastPlace = place;
              vehicle.inSide = true;
              vehicle.outSide = false;
            }
          }else {
            if(!vehicle.outSide){
              let lastCheck = vehicle.check[vehicle.check.length - 1];
              lastCheck.outDate = new Date(Date.now());
              lastCheck.fechaSalida = DateFormat(lastCheck.outDate, 'dddd dd/mmmm/yyyy - HH:MM:ss TT');
              let dateDiff = self.GetDateFromMS(vehicle.check[vehicle.check.length - 1].outDate - vehicle.check[vehicle.check.length - 1].inDate);
              vehicle.check[vehicle.check.length - 1].time = dateDiff;
              vehicle.inSide = false;
              vehicle.outSide = true;
              // Save on Database
            }
          }
        });
      },
      TrackVehicle(VEHICLE_ID) {
        var self = this;
        if(self.vehicleSelected == null || self.vehicleSelected.VEHICLE_ID != VEHICLE_ID){
          var vehicle = self.$store.state.vehicles.find(function(element) {
            return element.VEHICLE_ID == VEHICLE_ID;
          });

          if(self.vehicleSelected != null){
            console.log('clear traked');
            clearInterval(self.vehicleSelected.isTraked);
            self.RemovePathHistory();
          }

          self.vehicleSelected = vehicle;
          self.getView.goTo({
            center: vehicle.currentPosition,
            scale: 16000,
          });
          
          self.vehicleSelected = vehicle;
          self.vehicleSelected.isTraked = setInterval(function() { 
            self.VehiclePathHistory();
          }, 2000);
        }
      },
      RemovePathHistory(){
        var self = this;
        self.vehicleSelected.path.forEach(function(graphic){
          if(graphic != undefined){
            self.getView.graphics.remove(graphic);
          }
        });
        clearInterval(self.vehicleSelected.isTraked);
        self.vehicleSelected = null;
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