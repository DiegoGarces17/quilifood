var marcadores;
var mapa;
var baldosasOsm;
var controlCapas;
var usuario_aut_global;
// Filtra restaurantes 


function filtrar_adicionales(){
  return [];
}
function agregarFuncionesExternasMapaosm(){
  return null
}



function presentarMapaform(usuario_autenticado){
    usuario_aut_global = usuario_autenticado

    // Creación de mapa y sus capas
    baldosasOsm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; Contribuyentes de ' +
        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    var capasBase= {
      //  "Mapbox" : mapboxTiles,
      "OpenStreetMap" : baldosasOsm,
      "Satelite (ArcGIS)": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
      "Oscuro (CartoDB)" : L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')
    };
    
    controlCapas = L.control.layers(capasBase, leerCapasSuperpuestas(), 
      {position: 'topleft'});
    
 
    mapa = L.map('mapa-form', {zoomControl: false, minZoom: 2})
    .addLayer(baldosasOsm)
    .setView([3.0094500, -76.4849400], 15)
    .addControl(controlCapas);
    
    L.control.scale({imperial: false}).addTo(mapa);
    
    var theMarker = {};

   
    // NUEVA
   

     mapa.on('click',function(e){
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        //Clear existing marker, 
        if (theMarker != undefined) {
                mapa.removeLayer(theMarker);
        };
   
        //Add a marker to show where you clicked.
         theMarker = L.marker([lat,lng]).addTo(mapa); 
         mapa.addLayer(theMarker); 
         updateLatLng(lat, lng);
    });
     
     function updateLatLng(lat, lng, reverse) {
        if (reverse) {
           marker.setLatLng([lat, lng]);
           mapa.panTo([lat, lng]);
        } else {
           
           $("#restaurante_lat").val(lat);
           $("#restaurante_lng").val(lng);
           mapa.panTo([lat, lng]);
        }
     }
  }



    

    
    
    
   