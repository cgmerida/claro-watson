var contTema = 0;
var contSubtema = 0;
var contCatalogo = 0;

var catalogoArr = [];
var catalogoArray = [];

var temas = [];
var subtemas = [];

var ordenarTitulo = 0;
var ordenarFecha = 0;
var ordenarVigente = 0;

var aoDataCheck;
var oSettingsCheck;

function inicializaTabla () {	
	$('#top10').dataTable( {
		"searching": false,
		"paging":   true,
		"pageLength": numRegXPag, 
		"info":     false,
		"responsive": true,
		"bFilter" : false,               
		"bLengthChange": false,
		 "columnDefs": [{
			    "defaultContent": "-",
			    "targets": "_all"
			  }]
	});   
}

function obtieneSubtema(fi_tema){
	if(fi_tema == "-1"){
		borrarFiltros();
	}else{
		console.log('obtieneSubtema. fi_tema:' + fi_tema);
		
		var contSubByTema = 0;
		
		$("#fi_subtema").html("");
		$("#fi_subtema").append("<option value='' disabled selected>SUBTEMA</option>");
		for (var i in subtemas){
			if(subtemas[i].fi_tema == fi_tema){
				$("#fi_subtema").append("<option value='"+subtemas[i].fi_subtema+"'>"+subtemas[i].fc_descripcion+" </option>");
				contSubByTema++;
			}
		}
		$("#fi_subtema").append("<option value='-1'>Ver Todos</option>");
		if(contSubByTema > 0){
			$("#fi_subtema").removeAttr('disabled');
		}
		else{
			$("#fi_subtema").attr('disabled', 'disabled');
		}
		
		filtraDocumento();
	}
}

function filSubtema(fi_subtema){
	if(fi_subtema == "-1"){
		var fi_tema =  $("#fi_tema").val();
		obtieneSubtema(fi_tema);
	}else{
		filtraDocumento();
	}
}

var fi_tema;
var fi_subtema;

function filtraDocumento(){
	
	var cont = 0;
	catalogoArray = [];
	
	fi_tema =  $("#fi_tema").val();
	fi_subtema = $("#fi_subtema").val();
	console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&paso 1 fi_tema:" + fi_tema + " fi_subtema:" + fi_subtema);
	if(fi_tema != null && fi_tema != ''){
		console.log("paso 2 fi_tema != null");
		for(var i in catalogoArr){
			console.log("paso 3 recorre catalogoArr.doc:" + catalogoArr[i].fi_documento + " catalogoArr[" + i + "].fi_tema:" + catalogoArr[i].fi_tema + " fi_tema:" + fi_tema);
			if(catalogoArr[i].fi_tema == fi_tema){
				console.log("paso 4 catalogoArr[" + i + "].fi_tema == fi_tema");
				if(fi_subtema != null && fi_subtema != ''){
					console.log("paso 5 fi_subtema != null  catalogoArr[" + i + "].fi_subtema" + catalogoArr[i].fi_subtema + " fi_subtema:" + fi_subtema);
					if(catalogoArr[i].fi_subtema == fi_subtema){
						console.log("paso 6 catalogoArr[i].fi_subtema == fi_subtema");
						catalogoArray[cont] = catalogoArr[i];
						cont++;
					}
				}
				else{
					console.log("paso 7 catalogoArr[" + i + "]" + catalogoArr[i].fi_documento);
					catalogoArray[cont] = catalogoArr[i];
					cont++;
				}
				
			}
		}
	}
	else{
		console.log("paso 8");
		catalogoArray = catalogoArr;
	}
	
	obtieneElementos();
}

function borrarFiltros(){
	$("#fi_tema").val('');
	obtieneSubtema($("#fi_tema").val());
}

function ordenar(prop){
	
	catalogoArray.sort(function(a, b) {
	  var propA = a[prop].toUpperCase(); // ignore upper and lowercase
	  var propB = b[prop].toUpperCase(); // ignore upper and lowercase
	  if (propA < propB) {
		return -1;
	  }
	  if (propA > propB) {
		return 1;
	  }

	  // names must be equal
	  return 0;
	});
	
	if(prop == 'fc_titulo'){
		
		if(ordenarTitulo > 0){
			catalogoArray.reverse();
			ordenarTitulo=0;
		}
		else{
			ordenarTitulo++;
		}
		
		ordenarFecha = 0;
		ordenarVigente = 0;
	}
	else if(prop == 'fd_fecha_publicacion_number'){
		
		if(ordenarFecha > 0){
			catalogoArray.reverse();
			ordenarFecha=0;
		}
		else{
			ordenarFecha++;
		}
		
		ordenarTitulo = 0;
		ordenarVigente = 0;
	}
	else if(prop == 'fc_vigencia'){
		
		if(ordenarVigente > 0){
			catalogoArray.reverse();
			ordenarVigente=0;
		}
		else{
			ordenarVigente++;
		}
		
		ordenarTitulo = 0;
		ordenarFecha = 0;
	}
	
	obtieneElementos();
}

function obtieneElementos(){
	
	html = '';

	var fc_columna_titulo = $("#fc_columna_titulo").val();
	var fc_columna_fecha = $("#fc_columna_fecha").val();
	var fc_columna_vigencia = $("#fc_columna_vigencia").val();
	
	html += '	<table class="table table-bordered table-hover table-striped tablesorter" id="top10">' +
			'		<thead>' +
			'			<tr role="row">' +
			'				<th tabindex="0" aria-controls="top10" rowspan="1" colspan="1" aria-label="'+fc_columna_titulo + ': activate to sort column ascending" style="width: 817px;" class="sorting"><i class="fa fa-sort"></i> '+ fc_columna_titulo +'</th>' +
			'				<th tabindex="0" aria-controls="top10" rowspan="1" colspan="1" aria-label="'+fc_columna_fecha + ': activate to sort column ascending" style="width: 159px;" aria-sort="descending" class="sorting_desc"><i class="fa fa-sort"></i> '+ fc_columna_fecha +'</th>' +
			'				<th tabindex="0" aria-controls="top10" rowspan="1" colspan="1" aria-label="'+fc_columna_vigencia + ': activate to sort column ascending" class="sorting"><i class="fa fa-sort"></i> '+ fc_columna_vigencia +'</th>' +			  
			'			</tr>' +
			'		</thead>' +
			'		<tbody id="NavPosicionBody" >';
	
	for(var i in catalogoArray){
		if(i%2 === 0){
			html += '<tr role="row" class="odd">';
		}
		else{
			html += '<tr role="row" class="even">';
		}
		
		html += '<td>';
		
		if(catalogoArray[i].fc_tipo_documento == 'LGT'){
			html += '<a href="' + catalogoArray[i].fc_url_documento + '" data-fancybox-type="iframe" class="link js-lightbox">' + catalogoArray[i].fc_titulo + '</a>';
			//html += '<a href="' + catalogoArray[i].fc_url_documento + '" data-fancybox-type="iframe" class="js-lightbox-iframe">' + catalogoArray[i].fc_titulo + '</a>';
		}
		else{
			html += '<a href="' + catalogoArray[i].fc_url_documento + '" target="' + catalogoArray[i].fc_target + '" class="link">' + catalogoArray[i].fc_titulo + '</a>';
			//html += '<a href="' + catalogoArray[i].fc_url_documento + '" class="link" target="${ lst.fc_target }">' + catalogoArray[i].fc_titulo + '</a>';
		}
		
		html += '</td>';
		html += '<td class="sorting_1">' + catalogoArray[i].fd_fecha_publicacion + '</td>';
		html += '<td>' + catalogoArray[i].fc_vigencia_descripcion + '</td>';
		
		html += '</tr>';
	}
	
	html += '		</tbody>' +
			'	</table>';
	
	
	
	$('#contenedorTabla').html(html);
	
	//agrega paginador
	inicializaTabla ();
	
	//oculta paginador
	if($('.paginate_button').length <= 3){ 
		$('.dataTables_paginate').hide();
	}
	
	
}

/* ------------------------------------------------------------- */
/* ********************** [INI] Paginador ********************** */
/* ------------------------------------------------------------- */

function paginar(pagina){
	
	html = '';
	htmlPaginador='';
	inicio = numRegXPag * (pagina - 1);
	fin = catalogoArray.length <= ((numRegXPag * pagina) - 1) ? catalogoArray.length : ((numRegXPag * pagina));
	paginas = Math.ceil(catalogoArray.length / numRegXPag);
	
	console.log("paginar. paginas:" + paginas + " pagina:" + pagina + " inicio:" + inicio + " fin:" + fin + " numRegXPag:" + numRegXPag + " catalogoArray.length:" + catalogoArray.length);
	
	//[INI] Generacion html de catalogoArray
	
	html = '';
	for(var i=inicio; i<fin; i++){
		
		if(i%2 === 0){
			html += '<tr role="row" class="even">';
		}
		else{
			html += '<tr role="row" class="odd">';
		}
		
		html += '<td>';
		
		if(catalogoArray[i].fc_tipo_documento == 'LGT'){
			html += '<a href="' + catalogoArray[i].fc_url_documento + '" data-fancybox-type="iframe" class="link js-lightbox">' + catalogoArray[i].fc_titulo + '</a>';
			//html += '<a href="' + catalogoArray[i].fc_url_documento + '" data-fancybox-type="iframe" class="js-lightbox-iframe">' + catalogoArray[i].fc_titulo + '</a>';
		}
		else{
			html += '<a href="' + catalogoArray[i].fc_url_documento + '" target="' + catalogoArray[i].fc_target + '" class="link">' + catalogoArray[i].fc_titulo + '</a>';
			//html += '<a href="' + catalogoArray[i].fc_url_documento + '" class="link" target="${ lst.fc_target }">' + catalogoArray[i].fc_titulo + '</a>';
		}
		
		html += '</td>';
		html += '<td class="sorting_1">' + catalogoArray[i].fd_fecha_publicacion + '</td>';
		html += '<td>' + catalogoArray[i].fc_vigencia_descripcion + '</td>';
		
		html += '</tr>';
		
	}
	
	//[FIN] Generacion html del catalogoArray
	
	//[INI] Generacion html del paginador
	htmlPaginador='<ul class="pagination pull-right">';
	htmlPaginador += '<li><a href="javascript://;" onclick="javascript:paginar( ' + 1 + ' )">|&lt;</a></li>';
	for(var i=1; i<=paginas; i++){
		if(i==1){
			if(i==pagina){
				htmlPaginador += '<li><a href="javascript://;">&lt;&lt;</a></li><li class="active"><a href="javascript://;">' + i + '</a></li>';
			}
			else{
				htmlPaginador += '<li><a href="javascript://;" onclick="javascript:paginar( ' + i + ' )">&lt;&lt;</a></li><li><a href="javascript://;" onclick="javascript:paginar( ' + i + ' )">' + i + '</a></li>';
			}
			
			if(i==paginas){
				htmlPaginador += '<li><a href="javascript://;" >&gt;&gt;</a></li>';
			}
		}
		else if(i>1 && i<paginas){
			if(i==pagina){
				htmlPaginador += '<li class="active"><a href="javascript://;" onclick="javascript:paginar( ' + i + ' )">' + i + '</a></li>';
			}
			else{
				htmlPaginador += '<li><a href="javascript://;" onclick="javascript:paginar( ' + i + ' )">' + i + '</a></li>';
			}
		}
		else if(i==paginas){
			if(i==pagina){
				htmlPaginador += '<li class="active"><a href="javascript://;">' + i + '</a></li><li><a href="javascript://;" >&gt;&gt;</a></li>';
			}
			else{
				htmlPaginador += '<li><a href="javascript://;" onclick="javascript:paginar( ' + i + ' )">' + i + '</a></li><li><a href="javascript://;" onclick="javascript:paginar( ' + i + ' )">&gt;&gt;</a></li>';
			}
		}
		
	}
	htmlPaginador += '<li><a href="javascript://;" onclick="javascript:paginar( ' + paginas + ' )">&gt;|</a></li>';
	htmlPaginador += '</ul>';
	
	//$('#idPaginador').html(htmlPaginador);
	//[FIN] Generacion html del paginador
	
	console.log("htmlPaginador:" + htmlPaginador);
	
	$('#NavPosicionBody').html(html);
	$('#NavPosicionBodyPages').html(htmlPaginador);
	
	//agrega paginador
	inicializaTabla ();
	
}

/* ------------------------------------------------------------- */
/* ********************** [FIN] Paginador ********************** */
/* ------------------------------------------------------------- */
