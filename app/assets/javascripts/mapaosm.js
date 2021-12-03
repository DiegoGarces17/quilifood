var marcadores;
var mapa;
var baldosasOsm;
var controlCapas;
var usuario_aut_global;

function filtrar_adicionales(){
  return [];
}
function agregarFuncionesExternasMapaosm(){
  return null
}
function leerCapasSuperpuestas(){
  var capasSuperpuestas= {
    "Transporte (OpenPtmap)" : L.tileLayer('http://www.openptmap.org/tiles/{z}/{x}/{y}.png'),
  };
  return capasSuperpuestas
}
function presentarMapaOsm(usuario_autenticado) {
    usuario_aut_global = usuario_autenticado
    // Borrar clase container y ocultar pie de página
    $('.navbar').addClass('navbarosm');
    $('.card-body').addClass('cardbodyosm');
    $('.card').addClass('cardosm');

    // Creación de mapa y sus capas
    baldosasOsm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; Contribuyentes de ' +
        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    var filtro = L.control({position: 'topleft'});
    filtro.onAdd = function (mapa) {
      this._div = L.DomUtil.get('filtro-osm');
      return this._div;
    };
  
    var capasBase= {
      //  "Mapbox" : mapboxTiles,
      "OpenStreetMap" : baldosasOsm,
      "Satelite (ArcGIS)": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
      "Oscuro (CartoDB)" : L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')
  
    };
    
    controlCapas = L.control.layers(capasBase, leerCapasSuperpuestas(), 
      {position: 'topleft'});
    
  
    if (L.DomUtil.get('agrega-capa') != null && 
      L.DomUtil.get('descarga-capa') != null) {
      // Con Mapbox sería: mapa = L.mapbox.map('mapa-osm', null, {zoomControl: false, minZoom: 2})
      var descargamapaBtn = L.control({position:'bottomleft'});
      descargamapaBtn.onAdd = function (mapa){
        this._div = L.DomUtil.get('descarga-mapa');
        return this._div;
      };
  
      var agregaCapaBtn = L.control({position: 'bottomleft'});
      agregaCapaBtn.onAdd = function (mapa) {
        this._div = L.DomUtil.get('agregaCapa');
        return this._div;
      };
  
      mapa = L.map('mapa-osm', {zoomControl: false, minZoom: 2})
        //  .addLayer(mapboxTiles) seria con Mapbox
        .addLayer(baldosasOsm)
        .addControl(filtro)
        
        .setView([4.6682, -74.071], 6)
        .addControl(controlCapas)
        .addControl(agregaCapaBtn)
        .addControl(descargamapaBtn);
    } else {
      mapa = L.map('mapa-osm', {zoomControl: false, minZoom: 2})
        .addLayer(baldosasOsm)
        .addControl(filtro)
        .setView([3.0094500, -76.4849400], 15)
        .addControl(controlCapas);
    }
  
    L.control.scale({imperial: false}).addTo(mapa);
    
  
  
    //Crea los cúmulos de casos y agrega casos
    marcadores = L.markerClusterGroup(); 
    window.setTimeout(agregarCasosOsm(usuario_autenticado), 0);
    delete L.Icon.Default.prototype._getIconUrl;
 
  
    // Cierra el info al acercar/alejar
    mapa.on('zoom', function() {
      if (info != undefined) {
        info.remove(mapa);
      }
    });
  }

  function mostrarCargador() {
    $('#cargador').show();
  }
  
  function ocultarCargador() {
    $('#cargador').hide();
  }
  
  function descargarUrl(url, retrollamada) {
    var request = window.ActiveXobject ?
      new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        retrollamada(request);
      }
    };
    request.open('GET', url, true);
    request.send(null);
  }
  
  // Construye URL para consulta agregando el punto de montaje antes de
  // ruta_sin_puntomontaje y los filtros acordes a lo elegido a continuación
  function armarRutaConsulta(root, rutaSinPuntomontaje, usuarioAutenticado) {
    var ruta = rutaSinPuntomontaje
    var urlSolicitud = ruta 
    return urlSolicitud;
  }
  
  
  function agregarCasosOsm(usuario_autenticado) {

    var root = window;
    
    urlSolicitud = armarRutaConsulta(root, '/restaurantes.json', usuario_autenticado) 
    mostrarCargador();
    descargarUrl(urlSolicitud, function(req) {
      var data = req.responseText;
      
 
      var listaMarcadores = []
      var o = JSON.parse(data);
      var numResultados = 0;
      
      for(var codigo in o) {
        var lat = o[codigo].lat;
        var lng = o[codigo].lng;
        if (lat == null || lat == '' || lat == 'NaN') {
          continue;
        }
        if (lng == null || lng == '' || lng == 'NaN') {
          continue;
        }
        latf = parseFloat(lat);
        lngf = parseFloat(lng);
        numResultados++;
        var punto = new L.LatLng(latf, lngf);
        listaMarcadores.push(creaMarcador(punto, o[codigo], o[codigo].nombre));
        
      }
      marcadores.addLayers(listaMarcadores);
      mapa.addLayer(marcadores);
      $('#nrcasos').html(numResultados + ' Restaurantes mostrados!');
      ocultarCargador();
    });
  }
  
  
  function creaMarcador(punto, codigo, titulo) {
    // Exportar los casos a formato GeoJson
    var marcadorCaso = new L.Marker(punto)
    
    //Acción al hacer clic en caso en el mapa
    marcadorCaso.on('click', clicMarcadorCaso);
    function clicMarcadorCaso() {
      mostrarCargador();
      var root = window;
      var ruta ='restaurantes/';
      
      var urlSolicitud = ruta + codigo.id + ".json";  
      descargarUrl(urlSolicitud, function(req) {
        data = req.responseText;
        if (data == null || data.substr(0, 1) != '{') {
          ocultarCargador();
          
          window.alert("El URL " + urlSolicitud +
            " no retorno detalles del restaurante\n " + data);
          return;
        }
        
        var o = JSON.parse(data);
        var id = (typeof o.id != 'undefined') ? o.id : -1;
        var titulo = (typeof o.nombre != 'undefined') ? 
          o.nombre : '';
        var descripcionCont = '<div>' +
          '<h3>' + titulo + '</h3>';
        
        var t = JSON.parse(data);
        var id = (typeof t.id != 'undefined') ? t.id : -1;
        var phone = (typeof t.telefono != 'undefined') ? 
          t.telefono : '';
        var urlres = (typeof t.telefono != 'undefined') ? ('/restaurantes/' + t.id) : ''
       
        //var victimasCont = obtener_info_victimas(victimas, prresp, o);
        capaInfo(descripcionCont, phone, urlres);
        ocultarCargador();
      });
    }
  
    return marcadorCaso;
  }
  
  function obtener_info_victimas(victimas, prresp, caso){
    var victimasCont = '<div><table>' +
    '<tr><td>Victimas:</td><td>';
    for(var cv in victimas) {
      var victima = victimas[cv];
      victimasCont += ((typeof victima != 'undefined') && 
        victima != "") ? victima + '<br />' : 'SIN INFORMACIÓN';
    }
    victimasCont += '</td></tr><tr>' +
      '<td>Presuntos Responsables:</td><td>';
    for(var cp in prresp) {
      var prrespel = prresp[cp];
      victimasCont += ((typeof prrespel != 'undefined') && prrespel != "") ? 
        prrespel + '<br />' : 'SIN INFORMACIÓN';
    }
    victimasCont += '</td></tr></table></div>';
    return victimasCont
  }
  
  
  // Variable global donde se carga la capa flotante
  var info;
  // Capa flotante donde se muestra información al pulsar un marcador
  function capaInfo(des, tel, urlres){
    if (info != undefined) { // si ya tenia información se quita primero
      info.remove(mapa); 
    }
    info = L.control();
    info.onAdd = function (mapa) {
      this._div = L.DomUtil.create('div', 'info card');
      this.update(des, tel, urlres);
      return this._div;
    };
    info.update = function (des, tel, urlres) {
      this._div.innerHTML = 
      ' <div class="card-body">' +
              ' <h3>'+ des +'</h3>' +
              ' <p>Teléfono: '+ tel +'</p>' +  
              '<a href='+ urlres +'>Visitar restaurante</a>'    
      '</div>'
      ;
    };
    info.addTo(mapa);
  }
  
  // Cierra la capa flotante desde el boton cerrar
  $(document).on('click','#boton-cerrar', function() {
    if (info != undefined) {
      info.remove(mapa);
    }
  });
  
  // Cierra la capa flotante desde el boton cerrar
  $(document).on('click','#boton-cerrar-ag-capa', function() {
    if (agregaCapaDiv != undefined) {
      agregaCapaDiv.remove(mapa);
    }
  });
  
  //Limpia el mapa de casos cada que se filtra
  $(document).on('click', '#agregar-casos-osm', function(){
    marcadores.clearLayers(); 
    agregarCasosOsm(usuario_aut_global);
  });
  
  
  //Descargar capa de casos
  $(document).on('click', '#descargar-mapa', function() {
    var geojson = marcadores.toGeoJSON();
    var dataStr = "data:text/json;charset=utf-8," + 
      encodeURIComponent(JSON.stringify(geojson));
    var descargaGeo = document.getElementById('enlace-descarga');
    descargaGeo.setAttribute("href",     dataStr     );
    descargaGeo.setAttribute("download", "casos.geojson");
  });
  
  //Funciones de agregar supercapas
  $(document).on('click', '#agregar-capa', function(){
    agregarCapa();
    var contenidoGeoJson;
  
    // Función que sube la capa del usuario
    document.getElementById('archivoGeo').addEventListener(
      'change', leerArchivo, false);
    function leerArchivo(e){
      var archivo = e.target.files[0];
      if (!archivo) {
        return;
      }
      var lector = new FileReader();
      lector.onload = function(e) {
        contenidoGeoJson = e.target.result;
      };
      lector.readAsText(archivo);
    }
    $('#subirCapa').on('click', function(){
      nombreCapanueva = $('#nombreCapaNueva').val();
      var geoJsonReconocido = jQuery.parseJSON(contenidoGeoJson);
      var capaGeoJson = L.geoJSON(geoJsonReconocido);
      mapa.addLayer(capaGeoJson);
      controlCapas.addOverlay(capaGeoJson, nombreCapanueva);
      agregaCapaDiv.remove(mapa);
      alert("Capa agregada con éxito");
    });
  });
  
  // Botón agregar capas
  var agregaCapaDiv;
  function agregarCapa() {
    if (agregaCapaDiv != undefined) { // si había información se elimina
      agregaCapaDiv.remove(mapa); 
    }
    agregaCapaDiv = L.control();
    agregaCapaDiv.onAdd = function (mapa) {
      this._div = L.DomUtil.create('div', 'agregaCapaDiv');
      this.updateAgregaCapaDiv();
      return this._div;
    };
  
    agregaCapaDiv.updateAgregaCapaDiv = function () {
      this._div.innerHTML = '<div class="card border-primary"> ' +
        '<div class="card-body">' +
        '<button type="button" id="boton-cerrar-ag-capa" class="close" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button>' +
        '<h5>Agregar capa al mapa</h5>' +
        '<input id="nombreCapaNueva" class="form-group form-control campo-subir" type="text" placeholder="Nombre de la Capa">' +
        '<div class="form-group custom-file campo-subir">' +
        '<input id="archivoGeo" type="file" class="custom-file-input" id="customFileLang" lang="es">' +
        '<label class="custom-file-label" for="customFileLang">Seleccionar archivo GeoJSON</label></div>' +
        '<button id="subirCapa" class="form-group btn btn-primary">Subir</button></div></div>';
    };
    agregaCapaDiv.addTo(mapa);
  }

  
  