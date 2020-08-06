var marcadores="";	        
var coordLatit, coordLong, map;
var longitudCac,latitudCac;
var infowindow;
var clicBusqueda = 0;

//Latitud y Longitud de capital de GT 
var myLatitud = 15.5000000;//localStorage.getItem("myLatitud");
var myLongitud = -90.2500000;//localStorage.getItem("myLongitud");

var geocoder = new google.maps.Geocoder();
var marker = new google.maps.Marker();
data = {};

if(coordLatit == null && coordLong == null){
   	coordLatit = myLatitud;
   	coordLong = myLongitud;
   	if(myLatitud !=  coordLatit && myLongitud !=  coordLong){
   		localStorage.setItem("myLatitud", coordLatit);
   		localStorage.setItem("myLongitud", coordLong);
	}
}

function tieneLocalizacion()
{
console.log("---------Calcula localizacion---------");	
var respuesta=0;

	if (navigator.geolocation) {
		 navigator.geolocation.getCurrentPosition(function(position) {
			 //myLatitud=position.coords.latitude;
			var lon = position.coords.longitude;
			var lat = position.coords.latitude;
			createCookie("latitud_cac", lat, 7);
			createCookie("longitud_cac", lon, 7);
			var  pos = {
					 lat: position.coords.latitude,
					 lng: position.coords.longitude
			 };
		   console.log('Location found.');
		   console.log("Posicion: " + pos);
		   respuesta=1;
		   console.log("Longuitud: " + lon + " Latitud: " + lat);
		 }, function() {
		   console.log("No se pudo siempre")
		   respuesta=0;
		 });
	} 

}

function tamanoTiendas(){
	$(".mostrarCac").css("width","auto");
}

showMap = function() {
	if(typeof(readCookie("localidad_claro") != "undefined") && readCookie("localidad_claro")!=null){
		$('.textRegion').text(readCookie("localidad_claro"));
	} else {
		if(paisNoLoc=='')
			paisNoLoc='Ecuador';
		
		$('.textRegion').text(paisNoLoc);
	}
	console.log("showMap");
	initMap();
}

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}else var expires = "";               
	
	document.cookie = name + "=" + value + expires + "; path=/ ";
}


function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) 
		return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

function marcadoresByTipo(tipo){
	var lat=myLatitud;
	var longi=myLongitud;
	
	if(typeof(readCookie("latitud_cac") != "undefined") && readCookie("latitud_cac")!=null) {
		lat=readCookie("latitud_cac");
		longi=readCookie("longitud_cac");
	} else if(typeof(readCookie("latitud_claro") != "undefined") && readCookie("latitud_claro")!=null) {
		lat=readCookie("latitud_claro");
		longi=readCookie("longitud_claro");
	} else {
		lat=latitudPais;
		longi=longitudPais;
	}
	
	var mapOptions = {
		zoom: 6,
		draggable: true,
		center: new google.maps.LatLng(lat, longi),
		overviewMapControl: false,
		panControl: false,
		mapTypeControl: true,
		mapTypeControlOptions: {
			position:google.maps.ControlPosition.RIGHT_BOTTOM
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position:google.maps.ControlPosition.LEFT_BOTTOM
		},
		zoomControl: true,
		zoomControlOption: {
			style:google.maps.ZoomControlStyle.SMALL,
			position:google.maps.ControlPosition.BOTTOM_LEFT
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var geocoder = new google.maps.Geocoder();
	
	var clase = "tipoCAC";
	if(tipo == 1) {
		clase = "tipoCACMovil";
	} else if(tipo == 2) {
		clase = "tipoCACExpress";
	} else if(tipo == 3) {
		clase = "tipoCPS";
	} else if(tipo == 5) {
		clase = "tipoST";
	} else if(tipo == 6) {
		clase = "tipoCACFijo";
	} else {
		clase = "tipoCAC";
	}
	var params = tipo+'';
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType:"application/json; charset=utf-8",
		processdata:true,
		data:params, 
		url:"/GT_CAC_WSB_Cacs/services/cacsService/obtenerCACSByTipo", 
		cache: false,
		success: function(data) {
			$.each(data.cacs, function(i, item){
				if(item.activo != "0"){
					var contenido = '<div class="markerCacs ' + clase + '">'+
					'<div class="left"></div>'+
					'<div class="right">'+
					'<h2>'+item.nombre+'</h2>'+
					'<p>'+item.direccion+'</p>'+
					'<p>'+item.horario+'</p>';
					
					//contenido += '<p>';
					//$(item.lstHorarios).each(function(i,itemH) {
					//	if(i > 0)
					//		contenido += ' , ';
					//	contenido += ' '+itemH.fc_descripcion;

					//});
					//contenido += '</p>';
					
					if(item.notas == '' || item.notas == null || item.notas == 'na' || item.notas == 'NA') {
						contenido +='<p></p>';
					} else{
						contenido +='<p>'+item.notas+'</p>';
					}
					
					//if(flagLocalizacion==1)
					//{
					var direccion = $( "#txtDireccion" ).val();
					if(direccion != "" && clicBusqueda == 1){
						contenido +='<div class="cont-btn">'+
						'<a href="https://www.google.es/maps/dir/'+
						lat+
						'+'+longi+
						'/'+item.latitud+'+'+item.longitud+'" class="link route" target="_blank">C&oacute;mo llegar</a>';
					}
					
					
					if(item.telefono == '' || item.telefono == null || item.telefono == 'na' || item.telefono == 'NA') {
						contenido+='</div>'+
						'</div>'+
						'</div>' ;
					} else {
						contenido+='<a href="tel:'+item.telefono+'" class="tel">Tel: '+item.telefono+'</a>'+
						'</div>'+
						'</div>'+
						'</div>';
					}
					
					var pos= new google.maps.LatLng(item.latitud, item.longitud);
					
					var marker = new google.maps.Marker({
						position: pos,
						icon: icon_claro,
						title:item.nombre,
						map: map,
						animation: google.maps.Animation.DROP
					});
					
					marker.addListener('click', function() {
						if (infowindow) infowindow.close();
						infowindow = new google.maps.InfoWindow({
							content: contenido
						});
						infowindow.open(map, marker);
					});
				}
			});
		}
	});	
	/*
	document.getElementById('buscaCacs').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
		
	});
	
	$( "#txtDireccion" ).keypress(function( event ) {
		if ( event.which == 13 ) {
			geocodeAddress(geocoder, map);
		}
	});
	*/
}

function marcadoresByHora(horario){
	var lat=myLatitud;
	var longi=myLongitud;
	
	if(typeof(readCookie("latitud_cac") != "undefined") && readCookie("latitud_cac")!=null) {
		lat=readCookie("latitud_cac");
		longi=readCookie("longitud_cac");
	} else if(typeof(readCookie("latitud_claro") != "undefined") && readCookie("latitud_claro")!=null) {
		lat=readCookie("latitud_claro");
		longi=readCookie("longitud_claro");
	} else {
		lat=latitudPais;
		longi=longitudPais;
	}
	
	var mapOptions = {
		zoom: 6,
		draggable: true,
		center: new google.maps.LatLng(lat, longi),
		overviewMapControl: false,
		panControl: false,
		mapTypeControl: true,
		mapTypeControlOptions: {
			position:google.maps.ControlPosition.RIGHT_BOTTOM
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position:google.maps.ControlPosition.LEFT_BOTTOM
		},
		zoomControl: true,
		zoomControlOption: {
			style:google.maps.ZoomControlStyle.SMALL,
			position:google.maps.ControlPosition.BOTTOM_LEFT
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var geocoder = new google.maps.Geocoder();
	
	var params = horario+'';
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType:"application/json; charset=utf-8",
		processdata:true,
		data:params, 
		url:"/GT_CAC_WSB_Cacs/services/cacsService/obtenerCACSByHorario", 
		cache: false,
		success: function(data) {
			$.each(data.cacs, function(i, item){
				if(item.activo != 0){
					var tipo = item.tipoCac;
					var clase = "tipoCAC";
					if(tipo == 1) {
						clase = "tipoCACMovil";
					} else if(tipo == 2) {
						clase = "tipoCACExpress";
					} else if(tipo == 3) {
						clase = "tipoCPS";
					} else if(tipo == 5) {
						clase = "tipoST";
					} else if(tipo == 6) {
						clase = "tipoCACFijo";
					} else {
						clase = "tipoCAC";
					}
					
					var contenido = '<div class="markerCacs ' + clase + '">'+
					'<div class="left"></div>'+
					'<div class="right">'+
					'<h2>'+item.nombre+'</h2>'+
					'<p>'+item.direccion+'</p>'+
					'<p>'+item.horario+'</p>';
					
					//contenido += '<p>';
					//$(item.lstHorarios).each(function(i,itemH) {
					//	if(i > 0)
					//		contenido += ' , ';
					//	contenido += ' '+itemH.fc_descripcion;
					//});
					//contenido += '</p>';
					
					if(item.notas == '' || item.notas == null || item.notas == 'na' || item.notas == 'NA') {
						contenido +='<p></p>';
					} else{
						contenido +='<p>'+item.notas+'</p>';
					}
					
					//if(flagLocalizacion==1)
					//{
					var direccion = $( "#txtDireccion" ).val();
					if(direccion != "" && clicBusqueda == 1){
						contenido +='<div class="cont-btn">'+
						'<a href="https://www.google.es/maps/dir/'+
						lat+
						'+'+longi+
						'/'+item.latitud+'+'+item.longitud+'" class="link route" target="_blank">C&oacute;mo llegar</a>';
					}
					//}
					
					
					if(item.telefono == '' || item.telefono == null || item.telefono == 'na' || item.telefono == 'NA') {
						contenido+='</div>'+
						'</div>'+
						'</div>' ;
					} else {
						contenido+='<a href="tel:'+item.telefono+'" class="tel">Tel: '+item.telefono+'</a>'+
						'</div>'+
						'</div>'+
						'</div>';
					}
					
					var pos= new google.maps.LatLng(item.latitud, item.longitud);
					
					var marker = new google.maps.Marker({
						position: pos,
						icon: icon_claro,
						title:item.nombre,
						map: map,
						animation: google.maps.Animation.DROP
					});
					
					marker.addListener('click', function() {
						if (infowindow) infowindow.close();
						infowindow = new google.maps.InfoWindow({
							content: contenido
						});
						infowindow.open(map, marker);
					});
				}
			
			});
		}
	});	
	/*
	document.getElementById('buscaCacs').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
		
	});
	
	$( "#txtDireccion" ).keypress(function( event ) {
		if ( event.which == 13 ) {
			geocodeAddress(geocoder, map);
		}
	});
	*/
}

function cargaSegCacs(){
	initMap2();
	obtieneTiposCACS();
	obtieneHorarios();
}


function initMap2(){ 	
	console.log("initMap2");
	var latitudInit=0;
	var longitudInit=0;
	if(typeof(readCookie("latitud_claro") != "undefined") && readCookie("latitud_claro")!=null) {
		latitudInit=readCookie("latitud_claro");
		longitudInit=readCookie("longitud_claro");
	} else if(typeof(readCookie("latitud_cac") != "undefined") && readCookie("latitud_cac")!=null) {
		latitudInit=readCookie("latitud_cac");
		longitudInit=readCookie("longitud_cac");
	} else {
		latitudInit=latitudPais;
		longitudInit=longitudPais;
	}
	var mapOptions = {
		zoom: 8,
		draggable: true,
		center: new google.maps.LatLng(latitudInit, longitudInit),
		overviewMapControl: false,
		panControl: false,
		mapTypeControl: true,
		mapTypeControlOptions: {
			position:google.maps.ControlPosition.RIGHT_BOTTOM
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position:google.maps.ControlPosition.LEFT_BOTTOM
		},
		zoomControl: true,
		zoomControlOption: {
			style:google.maps.ZoomControlStyle.SMALL,
			position:google.maps.ControlPosition.BOTTOM_LEFT
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	var geocoder = new google.maps.Geocoder();
	/*
	document.getElementById('buscaCacs').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
	});
	
	$( "#txtDireccion" ).keypress(function( event ) {
		if ( event.which == 13 ) {
			geocodeAddress(geocoder, map);
		}
	});
	*/
}

function initMap() {
	console.log("initMap");
	var latitudInit=0;
	var longitudInit=0;
	if(typeof(readCookie("latitud_claro") != "undefined") && readCookie("latitud_claro")!=null) {
		latitudInit=readCookie("latitud_claro");
		longitudInit=readCookie("longitud_claro");
	} else {
		latitudInit=latitudPais;
		longitudInit=longitudPais;
	}
	var mapOptions = {
		zoom: 10,
		draggable: true,
		
		center: new google.maps.LatLng(latitudInit, longitudInit),
		overviewMapControl: false,
		panControl: false,
		mapTypeControl: true,
		mapTypeControlOptions: {
			position:google.maps.ControlPosition.RIGHT_BOTTOM
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position:google.maps.ControlPosition.LEFT_BOTTOM
		},
		zoomControl: true,
		zoomControlOption: {
			style:google.maps.ZoomControlStyle.SMALL,
			position:google.maps.ControlPosition.BOTTOM_LEFT
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var geocoder2 = new google.maps.Geocoder();
	
	var myLatLng = {lat: parseFloat(latitudInit), lng: parseFloat(longitudInit) };
	
	
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: 'Ubicaci&oacute;n Actual'
	});
	
	
	document.getElementById('buscaCacsRegion').addEventListener('click', function() {
		geocodeAddress2(geocoder2, map);
	});
	
}

function geocodeAddress(geocoder, resultsMap) {
    
	var address = document.getElementById('txtDireccion').value;
	console.log("address: " + address );

	if (address != "") {
    	clicBusqueda=1;	
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);


	        console.log("latitud: " + results[0].geometry.location.lat());
            console.log("longitud: " + results[0].geometry.location.lng());
            createCookie("latitud_cac", results[0].geometry.location.lat(), 7);
            createCookie("longitud_cac", results[0].geometry.location.lng(), 7);
            
            var tipo = $("#sTipo").val();
    		console.log("Tipo: " + tipo);
    		if(tipo != "0"){
    			//setTimeout(marcadoresByTipo(tipo), 1000);
    			marcadoresByTipo(tipo);
    		}
            
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            //alert('Geocode was not successful for the following reason: ' + status);
          }
        });
            	
	}	

}

function geocodeAddress2(geocoder, resultsMap) {
	var address = document.getElementById('txtDireccionRegion').value;
	geocoder.geocode({'address': address},
	function(responses, status) {
		console.log("response geo2");
		
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(responses[0].geometry.location);
			
			var marker = new google.maps.Marker ({
				map: resultsMap,
				position: responses[0].geometry.location
			});
			$('.textRegion').text( responses[0].formatted_address);
			
			createCookie("latitud_claro", responses[0].geometry.location.lat(), 7);
			createCookie("longitud_claro", responses[0].geometry.location.lng(), 7);
			createCookie("localidad_claro", responses[0].formatted_address, 7);
		}
		
		if (responses && responses.length > 0) {
			po = responses[0];				
			for (var i=0; i <responses[0].address_components.length; i++) {
				for (var b=0; b < responses[0].address_components[i].types.length; b++) {
					if (responses[0].address_components[i].types[b] == "country") {
						pais = responses[0].address_components[i];
						setLocalStorage("myPais", pais.long_name);
						break;
					}
				}
			}
			
			setLocalStorage("myLatitud", responses[0].geometry.location.lat());
			setLocalStorage("myLongitud", responses[0].geometry.location.lng());
			
			for (var i=0; i <responses[0].address_components.length; i++) {
				for (var b=0; b < responses[0].address_components[i].types.length; b++) {
					if (responses[0].address_components[i].types[b] == "locality") {
						ciudad = responses[0].address_components[i];
						setLocalStorage("myCiudad", ciudad.long_name);
						break;
					}
					
					if (pais.short_name === "AR") {
						console.log("Argentina");
						if (responses[0].address_components[i].types[b] == "administrative_area_level_1") {
							//provincia
							estado = responses[0].address_components[i];
							break;
						}							
						if (responses[0].address_components[i].types[b] == "sublocality") {
							//barrio
							colonia = responses[0].address_components[i];
							setLocalStorage("myColonia", colonia.long_name);
							break;
						}																	
					} else if (pais.short_name === "CO"){
						if (responses[0].address_components[i].types[b] == "administrative_area_level_1") {
							//departamento
							estado = responses[0].address_components[i];
							setLocalStorage("myEdo", estado.long_name);
							break;
						}
						if (responses[0].address_components[i].types[b] == "neighborhood") {
							//colonia
							colonia = responses[0].address_components[i];
							setLocalStorage("myColonia", colonia.long_name);
							break;
						}
					} else if (pais.short_name === "MX"){
						console.log("Mexico");
						
						if (responses[0].address_components[i].types[b] == "administrative_area_level_1") {
							estado = responses[0].address_components[i];
							setLocalStorage("myEdo", estado.long_name);
							break;
						}
						if (responses[0].address_components[i].types[b] == "sublocality") {
							colonia = responses[0].address_components[i];
							setLocalStorage("myColonia", colonia.long_name);
							break;
						}
						if (responses[0].address_components[i].types[b] == "administrative_area_level_3") {
							delegacion = responses[0].address_components[i];
							setLocalStorage("myDeleg", delegacion.long_name);
							break;
						}	
					} else if(pais.short_name === "US"){
						console.log("USA");
						if (responses[0].address_components[i].types[b] == "neighborhood") {
							colonia = responses[0].address_components[i];
							break;
						}
						if (responses[0].address_components[i].types[b] == "administrative_area_level_2") {
							condado = responses[0].address_components[i];
							break;
						}
					}
					if (responses[0].address_components[i].types[b] == "route") {
						calle = responses[0].address_components[i];
						break;
					}
					if (responses[0].address_components[i].types[b] == "street_number") {
						numero = responses[0].address_components[i];
						break;
					}
				}
			}
		}
	}
	);
}

function obtieneTiposCACS() {
	$('#sTipo').find('option').remove();
	$('#sTipo').append('<option value="0">Tipos de sucursal:</option>');
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType:"application/json; charset=utf-8",
		processdata:true,
		url:"/GT_CAC_WSB_Cacs/services/cacsService/obtenerTipoCACS", 
		cache: false,
		success: function(data){
			$.each(data.tiposCACS, function(i, item){
				if(item.activo != '0'){
					$("#sTipo").append("<option value=\""+item.idTipo+"\">"+item.descripcion+"</option>");
				}
			});
		}
	});
}

function obtieneHorarios() {
	$('#sHorario').find('option').remove();
	$('#sHorario').append('<option value="0">Horarios</option>');
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType:"application/json; charset=utf-8",
		processdata:true,
		url:"/GT_CAC_WSB_Cacs/services/cacsService/obtenerHorarios", 
		cache: false,
		success: function(data){
			$.each(data.horarios, function(i, item){
				if(item.fi_activo != '0'){
					$("#sHorario").append("<option value=\""+item.fi_horario+"\">"+item.fc_descripcion+"</option>");
				 }
			});
		}
	});
}

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;
	
	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');
		
		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};

function muestraCacsGet() {
	$(".mostrarCac").click();
}


function getParamUrl(){
	
	var loc = document.location.href;
	if(loc.indexOf('?')>0){
		var getCadena = loc.split('?')[1];
		var GET = getCadena.split('&');
		var get = {};
		
		for(var i = 0, l = GET.length; i < l; i++){
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return get;
	}	
}

function abreZonaCac(){
	console.log("funcion abreZonaCac");
	$("#mostrarCacs").click();
	//cargaSegCacs();
	//viewCacs();
}

$( document ).ready(function() {
	
	var tipo;
	var horario;
	
	console.log( "ready! params tema portal login "+getUrlParameter("showMiClaro")+" cacs "+getUrlParameter("showCacs") );
	
	if(getUrlParameter("showMiClaro")=="true")
		$( ".miClaro" ).removeClass( "miClaro autogestion" ).addClass( "miClaro autogestion hover" );
	
	if(getUrlParameter("showCacs")=="true") {
		$(".mostrarCac").click();
		setTimeout(muestraCacsGet, 2000);
	}
	
	if(myLatitud==null) {
		setLocalStorage("myColonia", "Santiago");
		setLocalStorage("myPais", "Chile");
	}
	/*
	var valores = getParamUrl();
	if(valores){
		for(var index in valores){
			console.log("Indice: " + index + " -- " + "valores: " + valores[index]);
			if(index=="abrirCacs" && valores[index] == "true"){
				console.log("parametros correctos");
				setTimeout(abreZonaCac(), 5000);
			}      
		}
		valores = "";
	}else{
		console.log("No hay parametros");
	}
	*/
	
	
	document.getElementById('buscaCacs').addEventListener('click', function() {
		geocodeAddress(geocoder, map);		

		tipo = $("#sTipo").val();
		console.log("Tipo: " + tipo);
		if(tipo != "0"){
			marcadoresByTipo(tipo);
		}
			
	});
	
	$( "#txtDireccion" ).keypress(function( event ) {
		
		if ( event.which == 13 ) {
			geocodeAddress(geocoder, map);
		
			tipo = $("#sTipo").val();
			console.log("Tipo: " + tipo);
			if(tipo != "0"){
				marcadoresByTipo(tipo);
			}

		}


	});
	
});	