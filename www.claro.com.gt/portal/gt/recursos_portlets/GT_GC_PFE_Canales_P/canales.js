function inicioCanales(){
	for(var cat in categoriasArr){
		for(var dtc in categoriasArr[cat].lstCanal){
			var relacion = JSON.parse(categoriasArr[cat].lstCanal[dtc].lstRelaciones);
			categoriasArr[cat].lstCanal[dtc].lstRelaciones = relacion;
	    }
	}
	
	canales();
	getCanal();
}

//funci�n para canales recibidos por URL
function getCanal() {
    var queryString = window.location.search.substring(1);
    var varArray = queryString.split("=");

    var canal = varArray[1];
    //console.log("canal seleccionado: "+canal);
    if(canal != null || canal != undefined){
    	$("#"+canal).trigger('click');
    	$('html, body').animate({
            scrollTop: $("#"+canal).offset().top
        }, 1000);
    }
}

function resetFiltros(){
	$("#modalidad").val(-1);
	
	$('#senal').find('option').remove();
	$('#senal').append('<option value="-1" selected disabled>Se&ntilde;al</option>');
	$('#senal').attr("disabled", "disabled");
	
	$('#franja').find('option').remove();
	$('#franja').append('<option value="-1" selected disabled>Franja</option>');
	$('#franja').attr("disabled", "disabled");
	
	canales();
}

function getUniqueCanal(data){
	var uniqueNames = [];
	for(i = 0; i< data.length; i++){    
	    if(uniqueNames.indexOf(data[i].fi_canal) === -1){
	        uniqueNames.push(data[i].fi_canal);        
	    }
	}
	return uniqueNames;
}

var htmlCanal = '';
function canales(){
	var categoria = $('#Categorias').val();
	var modalidad = $("#modalidad").val();
	var senal = $("#senal").val();
	var franja = $("#franja").val();
	
	var categoriasFil = [];
	var canalFil = [];
	
	htmlCanal = '';
	
	var lst;
	//obtenemos los canales seg�n los filtros seleccionados.
	if( (modalidad != null && modalidad != '-1' ) && (senal != null && senal != '-1' ) && (franja != null && franja != '-1' ) ){
		lst = JSON.search( categoriasArr, '//*[fi_id_modalidad = '+modalidad+' ] [fi_id_senal = '+senal+' ] [fi_id_franja = '+franja+' ] ' );
	} else if( (modalidad != null && modalidad != '-1' ) && (senal != null && senal != '-1' ) && (franja == null || franja == '-1' )){
		lst = JSON.search( categoriasArr, '//*[fi_id_modalidad = '+modalidad+' ] [fi_id_senal = '+senal+' ]' );
	} else if( (modalidad != null && modalidad != '-1' ) && (senal == null || senal == '-1' ) && (franja == null || franja == '-1' )){
		lst = JSON.search( categoriasArr, '//*[fi_id_modalidad = '+modalidad+' ]' );
	} else if( (modalidad == null || modalidad == '-1' ) && (senal == null || senal == '-1' ) && (franja == null || franja == '-1' )){
		lst = "ALL";
	}
	
	if(lst != "ALL"){
		lst = getUniqueCanal(lst);
		
		//recorremos c/categor�a buscando el/los canales de la lst
		for(var dto in categoriasArr){
			for(var canal in categoriasArr[dto].lstCanal){
				for(var idCanal in lst){
					if(lst[idCanal] == categoriasArr[dto].lstCanal[canal].fi_canal){
						canalFil.push(categoriasArr[dto].lstCanal[canal]);
					}
				}
			}
			if(canalFil.length > 0){
				categoriasFil.push({"fi_categoria":categoriasArr[dto].fi_categoria, "fc_descripcion":categoriasArr[dto].fc_descripcion, "lstCanal":canalFil})
			}
			//reset de lista de canales
			canalFil = [];
			
		}
	} else {
		for(var dto in categoriasArr){
			for(var dtc in categoriasArr[dto].lstCanal){
				canalFil.push(categoriasArr[dto].lstCanal[dtc]);
			}
			if(canalFil.length > 0){
				categoriasFil.push({"fi_categoria":categoriasArr[dto].fi_categoria, "fc_descripcion":categoriasArr[dto].fc_descripcion, "lstCanal":canalFil})
			}
			//reset de lista de canales
			canalFil = [];
		}
	}
	
	for(var dto in categoriasFil){
		htmlCanal += '<dl data-categoria="' + categoriasFil[dto].fc_descripcion.toLowerCase() + '">';
		htmlCanal += '	<dt>' + categoriasFil[dto].fc_descripcion + '</dt>';
		htmlCanal += '	<dd>';
		htmlCanal += '		<ul>';
		
		for(var dtc in categoriasFil[dto].lstCanal){
			var imagen_canal = categoriasFil[dto].lstCanal[dtc].fc_imagen.replace('var/dev-repos/shared_www','portal');
			var relacion = categoriasFil[dto].lstCanal[dtc].lstRelaciones;
			var mod = "";
			var sen = "";
			var fran = "";
			if(relacion != undefined && relacion != null && relacion.length > 0){
				$.each(relacion, function(ind, valor) {
					mod += " "+valor.fi_id_modalidad;
					sen += " "+valor.fi_id_senal;
					fran += " "+valor.fi_id_franja;
				});
				htmlCanal += '<li class="canales">';
			} else 
				htmlCanal += '<li>';
			htmlCanal += '	<a id="' + categoriasFil[dto].lstCanal[dtc].fi_canal + '" data-img="' + imagen_canal + '" data-title="' + categoriasFil[dto].lstCanal[dtc].fc_nombre + '" data-channel="' + categoriasFil[dto].lstCanal[dtc].fc_numero_canal + '" data-description="' + categoriasFil[dto].lstCanal[dtc].fc_descripcion + '"><img src="' + imagen_canal +'"></a>';
			htmlCanal += '</li>';
		}
		
		htmlCanal += '		</ul>';
		htmlCanal += '	</dd>';
		htmlCanal += '</dl>';
		
	}
	
	$('#divCanales').html(htmlCanal);
	
	canal_Onclick();
}

function canal_Onclick(){
	$('.contentPlanTV dd ul li a').on('click',function(){
		$('.mod__channelDesc').remove();
		$('.contentPlanTV dd ul li').removeAttr('style','height').removeClass('active');
		var image = $(this).data('img');
		var title = $(this).data('title');
		var channel = $(this).data('channel');
		var description = $(this).data('description');
		var base = '<div class="mod__channelDesc">'+
						'<div class="cont-img">'+
							'<img src="'+ image + '" />'+
						'</div>'	+
						'<div class="cont-data">'+
							'<h3>'+ title + '</h3>'+
							'<p class="channel"> Canal #: '+ channel + '</p>'+
							'<p class="descrip">'+ description + '</p>'+
						'</div>'	+
						'<div class="close"></div>'	+
					'</div>';
		$(this).parent().append(base);
		var altoCont =  $('.mod__channelDesc').innerHeight() + 105;
		$(this).parent('li').height(altoCont).addClass('active');
		$('.mod__channelDesc .close').on('click',function(){
			$('.mod__channelDesc').remove();
			$('.contentPlanTV dd ul li').removeAttr('style','height').removeClass('active');
		});
	});
}

function getSenales(id) {	
	try {
		var url = "/GT_GC_WSB_Canales/services/catalogosServices/getSenalesDeModalidad";
		$('#senal').find('option').remove();
		$('#franja').find('option').remove();
		$('#franja').append('<option value="-1" selected disabled>Franja</option>');
		$('#franja').attr("disabled", "disabled");
		$.ajax({
			type: "POST",
			dataType: "json",
			contentType:"application/json; charset=utf-8",
			data:id+'',
			url: url,
			async: false,
			cache:false,
			success: function(data) {
				console.log(data);
				var html = '<option value="-1" selected disabled>Se&ntilde;al</option>';
				$.each(data.lstSenal, function(ind, valor) {
					html += '<option value="'+valor.fi_id_senal+'"> '+valor.fc_descripcion+'</option>';
				});
				$('#senal').append(html);
				$('#senal').removeAttr("disabled");
				
					$("#senal option[value=7]").hide();
					
			}, error : function(error) {
				alert(error);
			}
		});//End ajax		
	} catch(err) {
		alert(err);
	}
}

function getFranjas(id) {	
	try {
		var url = "/GT_GC_WSB_Canales/services/catalogosServices/getFranjasDeSenal";
		$('#franja').find('option').remove();
		$.ajax({
			
			type: "POST",
			dataType: "json",
			contentType:"application/json; charset=utf-8",
			data:id+'',
			url: url,
			async: false,
			cache:false,
			success: function(data) {
				console.log(data);
				var html = '<option value="-1" selected disabled>Franja</option>';
				$.each(data.lstFranja, function(ind, valor) {
					html += '<option value="'+valor.fi_id_franja+'"> '+valor.fc_descripcion+'</option>';
				});
				$('#franja').append(html);
				$('#franja').removeAttr("disabled");
			}, error : function(error) {
				alert(error);
			}
		});//End ajax		
	} catch(err) {
		alert(err);
	}
}