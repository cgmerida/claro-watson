function agregar( URL ) {
	location.href = URL;
}

function getUrl(idPromo){
	return relativePath + idPromo;
}

function modificar( URL, ID ) {
	$("#fi_disponibilidad").val(ID);
	$("#formulario").attr('action', URL);
	$("#formulario").submit();
}

function eliminar(URL , ID){
	jConfirm("&iquest;Est&aacute;s seguro de eliminar el registro " + ID + "?", "Eliminar Registro", function(r) {
		if(r) {
			$("#fi_disponibilidad").val(ID);
			$("#formulario").attr('action', URL);
			$("#formulario").submit();
		} else {
			
		}
	});	
}

function validar(form){
	if(validaCampos()){
		form.submit();
	}
}

function validaCampos(){
	$('#errorTipo').html('&nbsp;');
	$('#errorDescripcion').html('&nbsp;');
	$('#errorEstatus').html('&nbsp;');
	var aux = 0;
	
	if($('#fc_tipo').val() == "-1" ){
		$('#errorTipo').html('Debe seleccionar el tipo.');
		aux++;
	}
	if($('#fc_descripcion').val().trim() == "" ){
		$('#errorDescripcion').html('Debe introducir una descripci&oacute;n.');
		aux++;
	}
	if($('#fi_activo').val() == "-1" ){
		$('#errorEstatus').html('Debe seleccionar el estatus.');
		aux++;
	}
	
	if(aux == 0)
		return true;
}


function precargar_combos(){
	var filtro1 = $("#combo2").val();
	var filtro2 = $("#combo3").val();
	var filtro3 = $("#combo4").val();
	
	/*
	if(filtro1!=""){
		$("#combo2").val(filtro1);
	}else{
		$("#combo2").val("-1");
	}
	if(filtro3!=undefined && filtro2!=""){
		$("#combo3").val(filtro2);
	}else{
		$("#combo3").val("-1");
	}
	if(filtro3!=undefined && filtro3!=""){
		$("#combo4").val(filtro3);
	}else{
		$("#combo4").val("-1");
	}
	*/
	
}  


function precargar_variables(){
	
	var filtro1 = $("#combo2").val();
	var filtro2 = $("#combo3").val();
	var filtro3 = $("#combo4").val();
	
	/*
	if(filtro1!=""){
		$("#combo2").val(filtro1);
	}else{
		$("#combo2").val("-1");
	}
	if(filtro3!=undefined && filtro2!=""){
		$("#combo3").val(filtro2);
	}else{
		$("#combo3").val("-1");
	}
	if(filtro3!=undefined && filtro3!=""){
		$("#combo4").val(filtro3);
	}else{
		$("#combo4").val("-1");
	}
	*/
	
}  

var dataevent_obtenerPromoFiltro;
function event_obtenerPromoFiltro(){
	var option = "OBTENERPROMOFILTRO";
	var fc_url_submit = $("#fc_url_submit").val();
	var filtro1 = $("#combo2").val() == null || $("#combo2").val() == '' ? "-1" : $("#combo2").val();
	var filtro2 = $("#combo3").val() == null || $("#combo3").val() == '' ? "-1" : $("#combo3").val();
	var filtro3 = $("#combo4").val() == null || $("#combo4").val() == '' ? "-1" : $("#combo4").val();
	
	//si no esta definido el combo de vigencia, se mostraran los vigentes
	var filtroVigencia = $("#comboVigencia").val() === undefined || $("#comboVigencia").val() == null || $("#comboVigencia").val() == '' ? "1" : $("#comboVigencia").val();
	
	console.log('event_obtenerPromoFiltro ');
	
	var urlImg = $("#urlImg").val();
	var urlDetalle = relativePath; //$("#urlDetalle").val();
	var urlWS = $("#urlWS").val();
	var sufijo = $("#sufijoPais").val();
	var tipo = $("#tipo").val();
	var segmento = $("#segmento").val();
	$.ajax({
		type: "post",
		dataType: "json",			
		data:{LIST:option,FILTRO1:filtro1,FILTRO2:filtro2,FILTRO3:filtro3,FILTROVIGENCIA:filtroVigencia,SEGMENTO:segmento,URLWS:urlWS,SUFIJO:sufijo,TIPO:tipo},					
		url: fc_url_submit,  
		cache:false,
		async:false,
		success: function(data) 
		{
			dataevent_obtenerPromoFiltro = data;
			  var elementos = "";
			  if(data[0]["promociones"]!=null && data[0]["promociones"].length>0){
				  for(var i =0 ; i<data[0]["promociones"].length ; i++){
					  if(filtroVigencia == "0"){
						  elementos+="<article class='noVigente'>";
					  }
					  else{
						  elementos+="<article>";
					  }
				  elementos+="<img src='"+urlImg + data[0]["promociones"][i]["fc_url_imagen_min"] + "'>";
				  elementos+="<div class='dataPromo'>";
				  elementos+="<h2>"+ data[0]["promociones"][i]["fc_nombre"] + "</h2>";
					  elementos+="<p>"+ data[0]["promociones"][i]["fc_descripcion"] +"</p>";
					  

					  if(data[0]["promociones"][i]["fd_fecha_fin"] != ''){
						elementos+="<p class='small'>Hasta el " + data[0]["promociones"][i]["fd_fecha_fin"] + "</p>";
					  }
					  
					  	if(data[0]["promociones"][i]["fc_url_html_detalle"] != '$URL_DEFAULT_DETALLE$'){
					  		elementos+="<p class='small'></p><a href='"+ data[0]["promociones"][i]["fc_url_html_detalle"] + "' target='" + data[0]["promociones"][i]["fc_target"] + "' class='link'>" + data[0]["promociones"][i]["fc_texto_detalle"] + "</a>";
					  	}
					  	else{
					  		elementos+="<p class='small'></p><a href='" +urlDetalle + data[0]["promociones"][i]["fi_promocion"] + "' target='" + data[0]["promociones"][i]["fc_target"] + "' class='link'>" + data[0]["promociones"][i]["fc_texto_detalle"] + "</a>";
					  	}
					  
						  elementos+="</div>";
							  elementos+="</article>";
				  }
				  elementos+="<div id='page-selection' class='paginador' style='text-align:right;' ></div>";
				  $("#promos_lista").html(elementos);
				  if(data[0]["numeroPaginas"]>1){
					  $('#page-selection').bootpag({ total:data[0]["numeroPaginas"], page: 1, maxVisible: 5 }).on("page", function(event, num){	event_obtenerPromoPagina(num);	 });
				  }
		 }else{
			  $("#promos_lista").html("<p>No se encuentran promociones con los filtros especificados</p>");
			  //$('#page-selection').bootpag({ total:1, page: 1, maxVisible: 5 }).on("page", function(event, num){	event_obtenerPromoPagina(num);	 });
		  }
		},
		error:function(){
			
			
			
		}
	});
	
	
}


var dataevent_obtenerPromoPagina;
function event_obtenerPromoPagina(pagina){
	console.log('event_obtenerPromoPagina '+ pagina);
	var option = "OBTENERPROMOPAGINA";
	var fc_url_submit = $("#fc_url_submit").val();
	var filtro1 = $("#combo2").val() == null || $("#combo2").val() == '' ? "-1" : $("#combo2").val();
	var filtro2 = $("#combo3").val() == null || $("#combo3").val() == '' ? "-1" : $("#combo3").val();
	var filtro3 = $("#combo4").val() == null || $("#combo4").val() == '' ? "-1" : $("#combo4").val();
	
	//si no esta definido el combo de vigencia, se mostraran los vigentes
	var filtroVigencia = $("#comboVigencia").val() === undefined || $("#comboVigencia").val() == null || $("#combo4").val() == '' ? "1" : $("#comboVigencia").val();
		
	var urlImg = $("#urlImg").val();
	var urlDetalle = relativePath;//$("#urlDetalle").val();
	var urlWS = $("#urlWS").val();
	var sufijo = $("#sufijoPais").val();
	var tipo = $("#tipo").val();
	var segmento = $("#segmento").val();
	$.ajax({
		type: "post",
		dataType: "json",			
		data:{LIST:option,FILTRO1:filtro1,FILTRO2:filtro2, FILTRO3:filtro3,FILTROVIGENCIA:filtroVigencia,SEGMENTO:segmento,PAGINA:pagina,URLWS:urlWS,SUFIJO:sufijo,TIPO:tipo},					
		url: fc_url_submit,  
		cache:false,
		async:false,
		success: function(data) 
		{
			dataevent_obtenerPromoPagina = data;
			var elementos = "";
			if(data[0]["promociones"]!=null && data[0]["promociones"].length>0){
				for(var i =0 ; i<data[0]["promociones"].length ; i++){
					if(filtroVigencia == "0"){
						elementos+="<article class='noVigente'>";
					} else{
					  elementos+="<article>";
					}
					elementos+="<img src='"+urlImg + data[0]["promociones"][i]["fc_url_imagen_min"] + "'>";
					elementos+="<div class='dataPromo'>";
					elementos+="<h2>"+ data[0]["promociones"][i]["fc_nombre"] + "</h2>";
					elementos+="<p>"+ data[0]["promociones"][i]["fc_descripcion"] +"</p>";
					  
					if(data[0]["promociones"][i]["fd_fecha_fin"] != ''){
						elementos+="<p class='small'>Hasta el " + data[0]["promociones"][i]["fd_fecha_fin"] + "</p>";
					}
					  
				  	if(data[0]["promociones"][i]["fc_url_html_detalle"] != '$URL_DEFAULT_DETALLE$'){
				  		elementos+="<p class='small'></p><a href='"+ data[0]["promociones"][i]["fc_url_html_detalle"] + "' target='" + data[0]["promociones"][i]["fc_target"] + "' class='link'>" + data[0]["promociones"][i]["fc_texto_detalle"] + "</a>";
				  	}
				  	else{
				  		elementos+="<p class='small'></p><a href='"+urlDetalle+ data[0]["promociones"][i]["fi_promocion"] + "' target='" + data[0]["promociones"][i]["fc_target"] + "' class='link'>" + data[0]["promociones"][i]["fc_texto_detalle"] + "</a>";
				  	}
						  
				  elementos+="</div>";
					  elementos+="</article>";
				  }
				  
				  elementos+="<div id='page-selection' class='paginador' style='text-align:right;' ></div>";
				  $("#promos_lista").html(elementos);
				  if(data[0]["numeroPaginas"]>1){
					  $('#page-selection').bootpag({ total:data[0]["numeroPaginas"], page: pagina, maxVisible: 5 }).on("page", function(event, num){	event_obtenerPromoPagina(num);	 });
				  }
				  } else {
					  $("#promos_lista").html("<p>No se encuentran promociones con los filtros especificados</p>");
					  //$('#page-selection').bootpag({ total:1, page: 1, maxVisible: 5 }).on("page", function(event, num){	event_obtenerPromoPagina(num);	 });
			  }
		},
		error:function(err){
			console.log('err' + err);
		}
	});
}

	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function prefiltrar(pNombreCombo, pFiltroName, pFiltroSettings){
		var pFiltroValue = getParameterByName(pFiltroName);
		
		if(pFiltroValue != undefined && pFiltroValue != null && pFiltroValue != ''){
			$("#" + pNombreCombo + " option[value=" + pFiltroValue + "]").prop('selected', 'selected');
			$("#" + pNombreCombo).change();
		} else if(pFiltroSettings != undefined && pFiltroSettings != null && pFiltroSettings != ''){
			$("#" + pNombreCombo + " option[value=" + pFiltroSettings + "]").prop('selected', 'selected');
			$("#" + pNombreCombo).change();
		}
}

