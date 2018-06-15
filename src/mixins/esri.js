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
        Vehicles:[],
        vehicleSelected:null,
        geoqueryTask: null,
        queryCarIntersection: null,
        queryDotsPathTask: null,
        queryDots: null
      }
    },
    mounted() {
      loadModules([
          'esri/Map',
          "esri/geometry/geometryEngine",
          'esri/views/MapView',
          "esri/WebMap",
          "esri/widgets/BasemapToggle",
          "esri/Graphic",
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/FeatureLayer",
          "vue"
          ])
      .then(([Map, geometryEngine, MapView, WebMap, BasemapToggle, Graphic, QueryTask, Query, FeatureLayer, Vue]) => {
                  
        if(this.$store.state.view == null){
          
          // points layer
          this.dotsLayer = new FeatureLayer({
            url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/arcgis/rest/services/MonitoreoWebMap_WFL1/FeatureServer/2?token=MnKdg3e5qgrvIjCmatideNLBQRsw0wpOFV2OqwHkoUkXPFkyN2UUip4AfO63Jzn_yoVmWMOO_Q7vblnf-Zwt6GxHTf2FtuYhDCs4yZUtiTfqv4ffqxtu7fNEZMoi9LfX_Ar37BR20oUeMd6bv0_Pov8_eRdJOv1HRAaUkdg44ov6pcWfHDWm4saC3EgNKqVgtKUHglW5A9YRNpxl-asgh1dzl4ovrMutKelb2Gv86OZn8dgzih2ox8A4ugO8gqqK"
          });
          
          // geocerca layer
          this.cercasLayer = new FeatureLayer({
            url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/arcgis/rest/services/MonitoreoWebMap_WFL1/FeatureServer/3?token=MnKdg3e5qgrvIjCmatideNLBQRsw0wpOFV2OqwHkoUkXPFkyN2UUip4AfO63Jzn_yoVmWMOO_Q7vblnf-Zwt6GxHTf2FtuYhDCs4yZUtiTfqv4ffqxtu7fNEZMoi9LfX_Ar37BR20oUeMd6bv0_Pov8_eRdJOv1HRAaUkdg44ov6pcWfHDWm4saC3EgNKqVgtKUHglW5A9YRNpxl-asgh1dzl4ovrMutKelb2Gv86OZn8dgzih2ox8A4ugO8gqqK"
          });
          
          // this.$store.state.map = new Map({
          //   basemap: "topo"
          // });
          
          //this.$store.state.map.add(this.dotsLayer);
          //this.$store.state.map.add(this.cercasLayer);

          this.$store.state.map = new WebMap({
            portalItem: { // autocasts as new PortalItem()
              id: "ff80ff0633a14c13bb6e5678ed703da0"
            }
          });
          
          this.$store.state.view = new MapView({
            center: [-93.31210146474633, 18.061566162741393],
            container: "viewDiv",
            map: this.$store.state.map
          });

          var toggle = new BasemapToggle({
            // 2 - Set properties
            view: this.$store.state.view, // view that provides access to the map's 'topo' basemap
            nextBasemap: "streets" // allows for toggling to the 'hybrid' basemap
          });

          this.$store.state.view.ui.add(toggle, "bottom-left");

        }else{
          this.$store.state.view.container = "viewDiv";
        }

        this.GE = Object.assign(geometryEngine);

        this.NewGraphic = function(picture){
          var vehiclePic = {
            type: "picture-marker",
            url: require(`../assets/${picture}.png`),
            width: "32px",
            height: "32px"
          }

          return new Graphic({
            symbol: vehiclePic,
            popupTemplate: {
              title: "Informacion",
              content: [
                {
                  type: "fields",
                  fieldInfos:[{
                    fieldName: "PLACAS_VEH",
                    visible: true,
                    label: "PLACAS"
                  }]
                },
                {
                  type: "fields",
                  fieldInfos:[{
                    fieldName: "TIPO_VEHI",
                    visible: true,
                    label: "Tipo de Vehiculo"
                  }]
                },
                {
                  type: "fields",
                  fieldInfos:[{
                    fieldName: "ALIAS",
                    visible: true,
                    label: "Proceso"
                  }]
                },
                {
                  type: "fields",
                  fieldInfos:[{
                    fieldName: "NOMBRE",
                    visible: true,
                    label: "Chofer"
                  }]
                }
              ]
            },
            outFields: ["*"]
          });
        };

        this.NewGraphicLine = function(){ 
          let lineSymbol = {
            type: "simple-line", 
            color: [255, 0, 0],
            width: 2
          }
          return new Graphic({
            symbol: lineSymbol
          });
        };

        this.NewGraphicPoint = function(){
          return new Graphic({
            symbol: markerSymbol
          })
        };

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

        // path for all geocercas
        this.geoqueryTask = new QueryTask({
          url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/arcgis/rest/services/MonitoreoWebMap_WFL1/FeatureServer/3?token=MnKdg3e5qgrvIjCmatideNLBQRsw0wpOFV2OqwHkoUkXPFkyN2UUip4AfO63Jzn_yoVmWMOO_Q7vblnf-Zwt6GxHTf2FtuYhDCs4yZUtiTfqv4ffqxtu7fNEZMoi9LfX_Ar37BR20oUeMd6bv0_Pov8_eRdJOv1HRAaUkdg44ov6pcWfHDWm4saC3EgNKqVgtKUHglW5A9YRNpxl-asgh1dzl4ovrMutKelb2Gv86OZn8dgzih2ox8A4ugO8gqqK"
        });

        // query for detect intersection with the car
        this.queryCarIntersection = new Query({
          distance: 5,
          units: "meters",
          spatialRelationship: "intersects" // All features that intersect 100 mile buffer
        });

        // path for dots layer
        this.queryDotsPathTask = new QueryTask({
          url: "https://services.arcgis.com/CT0bYvH48f1TEH2t/arcgis/rest/services/MonitoreoWebMap_WFL1/FeatureServer/2?token=2Qiumvvtgtq9B0BHRp-s3TYE-Sr0CrgprrytNVDdZjrkzHaEj4gE31BSRpbKdoc1s_2MWX-amimVt3iKI8lR9M_vn8JgIsb-84e4M0col9J43gSo2AGnXk-53Z5kMoEg_o6MAhInhS40h8DsOFzcd2nLJyN2cadyw2_UeQp4LTAeviIkkE0hWmbXc7PVkHQD9vMyDHCB4cMPLacmNgesUkHYGVT59ItSP1kMZoN-YolLwBLgkkyuikwNI3vvGS2a"
        });

        this.queryDots = new Query({
          outFields: ["*"],
          orderByFields: ["COLOR_VEHI"],
          returnGeometry: true,
          where: "1=1"
        });

      })
      .catch(err => { console.error(err); });
    },
    created(){
    },
    computed:{
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
                Proceso: chofer.Proceso,
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
              self.StartSimulation(vehicle);
            })
          });
      },
      StartSimulation(vehicle){
        var self = this;
        vehicle.currentCoordIndex = 0;
          setInterval(function() {
              self.MoveGraphicVehicle(vehicle, vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              self.Intersection(vehicle, vehicle.vehicle.geometry[vehicle.currentCoordIndex]);
              vehicle.currentCoordIndex = (vehicle.currentCoordIndex + 1) % vehicle.vehicle.geometry.length;
              if(vehicle.currentCoordIndex == 1){
                self.getView.graphics.remove(vehicle.pathHistory);
                vehicle.path = [];
                vehicle.pathHistory = null;
              }
              // vehicle.distance = self.GE.geodesicLength(vehicle.path.geometry, "kilometers").toFixed(2);
          }, 5000);
      },
      MoveGraphicVehicle(vehicle, geometry) {
        var self = this;
        vehicle.lastPosition = vehicle.currentPosition;
        self.getView.graphics.remove(vehicle.lastPosition);
        
        var newVehicleGraphic = self.CreateVehicleGraphic(vehicle.Proceso);
        vehicle.vehicle.attributes.NOMBRE = vehicle.nombre;
        vehicle.vehicle.attributes.TIPO_VEHI = vehicle.TIPO_VEHI;
        vehicle.vehicle.attributes.ALIAS = vehicle.Proceso;
        newVehicleGraphic.attributes = vehicle.vehicle.attributes;
        newVehicleGraphic.geometry = geometry;
        
        vehicle.currentPosition = newVehicleGraphic;
        self.getView.graphics.add(newVehicleGraphic);
        vehicle.path.push(vehicle.currentPosition);
      },
      CreateVehicleGraphic(typeVehicle){
        var self = this;
        var newGraphic = null;    
        switch(typeVehicle){
          case "Nitrógeno":
            newGraphic = self.NewGraphic("pipa");
          break;
          case "Líneas de Acero":
            newGraphic = self.NewGraphic("carga");
          break;
          case "Material Eléctrico":
            newGraphic = self.NewGraphic("truck");
          break;
          case "Aceite":
            newGraphic = self.NewGraphic("carga");;
          break;
        }
        return newGraphic;
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
                lugar: place,
                VEHICLE_ID: vehicle.VEHICLE_ID,
                TIPO_VEHI: vehicle.TIPO_VEHI,
                Proceso: vehicle.Proceso,
                chofer: vehicle.nombre
              }
              vehicle.check.push(check);
              vehicle.lastPlace = place;
              vehicle.inSide = true;
              vehicle.outSide = false;

              self.$store.state.checks.push(check);
            }
          }else {
            if(!vehicle.outSide){
              let check = self.$store.state.checks.find(function(check) {
                return check.VEHICLE_ID == vehicle.VEHICLE_ID;
              });
              let lastCheck = vehicle.check[vehicle.check.length - 1];
              lastCheck.outDate = new Date(Date.now());
              lastCheck.fechaSalida = DateFormat(lastCheck.outDate, 'dddd dd/mmmm/yyyy - HH:MM:ss TT');
              let dateDiff = self.GetDateFromMS(vehicle.check[vehicle.check.length - 1].outDate - vehicle.check[vehicle.check.length - 1].inDate);
              vehicle.check[vehicle.check.length - 1].time = dateDiff;
              vehicle.inSide = false;
              vehicle.outSide = true;
              check = lastCheck;

            }
          }
        });
      },
      TrackVehicle(VEHICLE_ID) {
        var self = this;
        if(self.vehicleSelected == null || self.vehicleSelected.VEHICLE_ID != VEHICLE_ID){

          let vehicle = self.$store.state.vehicles.find(function(element) {
            return element.VEHICLE_ID == VEHICLE_ID;
          });

          if(self.vehicleSelected != null)
            self.RemovePathHistory();

          self.vehicleSelected = vehicle;
          self.getView.goTo({
            center: vehicle.currentPosition,
            scale: 16000,
          });
          
          self.vehicleSelected.isTraked = setInterval(function() { 
            self.DrawVehiclePathHistory();
          }, 0);
        }
      },
      DrawVehiclePathHistory() {
        var self = this;

        if(self.vehicleSelected.pathHistory != null)
          self.getView.graphics.remove(self.vehicleSelected.pathHistory);
          
          var path = this.NewGraphicLine();
          var polyline = {
            type: "polyline",
            paths: []
          };
          self.vehicleSelected.path.forEach(function(graphic){
            if(graphic != undefined){
              polyline.paths.push([graphic.geometry.longitude, graphic.geometry.latitude]);
            }
          });
          
          path.geometry = polyline;
          self.getView.graphics.add(path);
          self.vehicleSelected.pathHistory = path;
          // self.vehicleSelected.distance = this.GE.geodesicLength(path.geometry, "kilometers").toFixed(2);

          if(self.vehicleSelected.currentCoordIndex == 1){
            self.getView.graphics.remove(self.vehicleSelected.pathHistory);
            self.vehicleSelected.path = [];
            self.vehicleSelected.pathHistory = null;
          }
      },
      RemovePathHistory(){
        var self = this;
        self.getView.graphics.remove(self.vehicleSelected.pathHistory);
        clearInterval(self.vehicleSelected.isTraked);
        self.vehicleSelected = null;
      }
    }
  }
export default esri;