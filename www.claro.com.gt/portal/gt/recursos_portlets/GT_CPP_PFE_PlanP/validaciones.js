var params = {};
var producto = "";
var href1 = "";
var href2 = "";
var href3 = "";
var href4 = "";
var precioMayor = 0;

function resetFiltros(){
	$('.contRounded input').on('change', function() {
		var valor;
		valor = formatoMoneda($(this).val());
		return $(this).parent().find('.valores .valMax').text(valor);
	});
}

function formatoMoneda(numero) {
	try {
		numero = numero.toString();
	    // Variable que contendra el resultado final
	    var resultado = "";
	 
	        // Si el numero empieza por el valor "-" (numero negativo)
	    if(numero[0]=="-")
	    {
	        // Cogemos el numero eliminando las posibles comas que tenga, y sin
	        // el signo negativo
	        nuevoNumero=numero.replace(/\,/g,'').substring(1);
	    }else{
	        // Cogemos el numero eliminando las posibles comas que tenga
	        nuevoNumero=numero.replace(/\,/g,'');
	        }
	 
	        // Si tiene decimales, se los quitamos al numero
	    if(numero.indexOf(".")>=0)
	        nuevoNumero=nuevoNumero.substring(0,nuevoNumero.indexOf("."));
	 
	        // Ponemos una coma cada 3 caracteres
	    for (var j, i = nuevoNumero.length - 1, j = 0; i >= 0; i--, j++)
	        resultado = nuevoNumero.charAt(i) + ((j > 0) && (j % 3 == 0)? ",": "") + resultado;
	 
	        // Si tiene decimales, se lo a�adimos al numero una vez forateado con 
	    // los separadores de miles
	    if(numero.indexOf(".")>=0)
	        resultado+=numero.substring(numero.indexOf("."));
	 
	        if(numero[0]=="-")
	    {
			if(resultado.indexOf('.') >=0) {
				var totalCad = resultado.length;
				var pos = resultado.indexOf('.') + 1;
				var numDec = totalCad-pos;
				if(numDec == 1){
					resultado = resultado + '0';
				}
			} else {
				resultado = resultado + '.00';
			}
			 // Devolvemos el valor a�adiendo al inicio el signo negativo
	        return "-"+resultado;
	    }else{
			if(resultado.indexOf('.') >=0) {
				var totalCad = resultado.length;
				var pos = resultado.indexOf('.') + 1;
				var numDec = totalCad-pos;
				if(numDec == 1){
					resultado = resultado + '0';
				}
			} else {
				resultado = resultado + '.00';
			}
	        return resultado;
	    }
	}catch(err) {
		return numero;
	}
}
var lstPreciosIDs = new Array();

function setHTMLPlanes (lstJson) {
	$(".contentPlanPrecio").html('');
	var contadorViables = 0;
	var conDisponibles = 0;
	var lstPrecios = new Array();	
	$.each(jsonPlanes, function( index, value ) {
		var isVisible = 'false';
		var precio =  0;
		console.log('--------aplica_filtro_disponibilidad:' + aplica_filtro_disponibilidad);
		if(aplica_filtro_disponibilidad == true) {
			console.log('--------entro-------:');
			for (var i = 0; i< value.lstDepartamentos.length; i++) {
				console.log('--------entro:' + value.lstDepartamentos[i].fi_valor);
				if(value.lstDepartamentos[i].fi_valor == disponibilidad)
					isVisible = 'true';
			}			
		} else {
			isVisible = 'true';
		}
		console.log('isVisible: ' + isVisible);
		if(isVisible == 'true') {
			planesDisponibilidad[conDisponibles] = value;
			var precioMostrar = validaPrecioMostrar();
			var valPrecio = -1;
			if(precioMostrar == 'NORMAL') {
				valPrecio = value.fi_precio;
			} else if(precioMostrar == 'ESPS') {		
				valPrecio = value.fi_precio_internet_esps;
			} else if(precioMostrar == 'ENPS') {		
				valPrecio = value.fi_precio_telefonia_enps;
			} else if(precioMostrar == 'ESPN') {		
				valPrecio = value.fi_precio_television_espn;
			} else if(precioMostrar == 'ENPN') {		
				valPrecio = value.fi_precio;
			}
			if(value.fi_ban_precio == 1 && value.fi_precio >= 0) {	
				isVisible = 'true';
			} else if(value.fi_ban_precio == 0) {
				isVisible = 'true';
			} else {
				isVisible = 'false';
			}
			if(isVisible == 'true') {							
				lstPrecios[contadorViables] = valPrecio;
				lstPreciosIDs[contadorViables] = [ valPrecio, conDisponibles];
				contadorViables++;
			}
			conDisponibles++;
		}
	});
	
	lstPreciosIDs.sort(function(a,b){
		if(a[0]==b[0]) return a[1]-b[1];
		if(a[0]>b[0]) return 1;
		return -1;
	});
	
	for(var ii = 0; ii < lstPreciosIDs.length; ii++) {	
		console.log('---lstPreciosIDs[ii][1]' + lstPreciosIDs[ii][1]);
		var precioMostrar = validaPrecioMostrar();
		setHTML(planesDisponibilidad[lstPreciosIDs[ii][1]], lstPreciosIDs[ii][1], precioMostrar);	
	}
	if(lstPrecios.length > 0) {
		console.log('--entro111');
		var isFiltroPrecio = $("#val-1").length;
		console.log('--entro222' + isFiltroPrecio);
		if(isFiltroPrecio >= 0 ){
			console.log('--entro333');
			var iniPrecioFiltro = Math.min.apply( Math, lstPrecios );
			var finPrecioFiltro = Math.max.apply( Math, lstPrecios );
			precioMayor = finPrecioFiltro;
			var intervalo = Math.round((finPrecioFiltro - iniPrecioFiltro) /10);
			$(".val-1").html('<dt>Precio</dt><dd><input type="range" id="val-1" value="' + finPrecioFiltro + '" min="' + iniPrecioFiltro +'" max="' + finPrecioFiltro + '" step="' + intervalo +'"><div class="valores"><p class="valMin">' + formatoMoneda(iniPrecioFiltro) + '</p><p class="valMax">' + formatoMoneda(finPrecioFiltro) + '</p></div></dd>');
		}
	} else {
		if(sizeLstFiltrosProducto == 0) {
			$(".calculadorPlan").hide();
			$(".calculadorPlan").html();
		}
	}
}

function setHTML(value, idPl, precioMostrar) {
	
	var valPrecio = -1;
	if(precioMostrar == 'NORMAL') {
		valPrecio = value.fi_precio;
	} else if(precioMostrar == 'ESPS') {
		if(value.fi_ban_esps == 0) {
			valPrecio = -1;
		} else {
			valPrecio = value.fi_precio_internet_esps;
		}		
	} else if(precioMostrar == 'ENPS') {
		if(value.fi_ban_enps == 0) {
			valPrecio = -1;
		} else {
			valPrecio = value.fi_precio_telefonia_enps;
		}
	} else if(precioMostrar == 'ESPN') {
		if(value.fi_ban_espn == 0) {
			valPrecio = -1;
		} else {
			valPrecio = value.fi_precio_television_espn;
		}
	} else if(precioMostrar == 'ENPN') {
		if(value.fi_ban_enpn == 0) {
			valPrecio = -1;
		} else {
			valPrecio = value.fi_precio;
		}
	}

	if((value.fi_ban_precio == 1 && valPrecio >= 0) || value.fi_ban_precio == 0) {	
		var htmlPlan = "";
		var tipoClase = "plan__Precio";
		if(value.fc_tipo_plan == 'SAD') {
			tipoClase = "plan__Paquete";
		}	
		htmlPlan += '<article class="' + tipoClase + '">';	
		htmlPlan += '	<dl>';
		
		if(value.fc_tipo_plan == 'SAD') {
			if(value.fi_ban_titulo == '1') {
				htmlPlan += '		<dd class="tituloPaquete"><h3>' + value.fc_nombre + '</h3></dd>';
			} else {
				htmlPlan += '		<dd class="tituloPaquete"><img src="' + value.fc_imagen_logo + '" alt="' + value.fc_nombre + '"></dd>';
			}
		} else {
			htmlPlan += '		<dt><h3>' + value.fc_nombre + '</h3></dt>';
		}
		
		
		htmlPlan += '		<dd class="precio">';
		//if(value.fc_etiqueta_promocion != '' && value.fc_tipo_plan != 'SAD') {
		if(value.fc_etiqueta_promocion != '') {
			htmlPlan += '			<span class="descuento">' + value.fc_etiqueta_promocion + '</span>';
		}
		var precio = 0;
		if(value.fi_ban_precio == 1){		
			if(precioMostrar == 'NORMAL') {
				htmlPlan += '			<p>' + value.fc_etiqueta_periodo + '<span>' + formato_moneda + formatoMoneda(value.fi_precio) + '</span></p>';
			} else if(precioMostrar == 'ESPS') {
				htmlPlan += '			<p>' + value.fc_etiqueta_periodo + '<span>' + formato_moneda + formatoMoneda(value.fi_precio_internet_esps) + '</span></p>';
				htmlPlan += '			<p style="font-size:0.8rem;">Portabilidad Equipo Propio</p>';
			} else if(precioMostrar == 'ENPS') {
				htmlPlan += '			<p>' + value.fc_etiqueta_periodo + '<span>' + formato_moneda + formatoMoneda(value.fi_precio_telefonia_enps) + '</span></p>';
				htmlPlan += '			<p style="font-size:0.8rem;">Portabilidad Equipo en Arriendo</p>';
			} else if(precioMostrar == 'ESPN') {
				htmlPlan += '			<p>' + value.fc_etiqueta_periodo + '<span>' + formato_moneda + formatoMoneda(value.fi_precio_television_espn) + '</span></p>';
				htmlPlan += '			<p style="font-size:0.8rem;">N&uacute;mero Nuevo Equipo Propio</p>';
			} else if(precioMostrar == 'ENPN') {
				htmlPlan += '			<p>' + value.fc_etiqueta_periodo + '<span>' + formato_moneda + formatoMoneda(value.fi_precio) + '</span></p>';
				htmlPlan += '			<p style="font-size:0.8rem;">N&uacute;mero Nuevo Equipo en Arriendo</p>';
			}
			
		} else {
			htmlPlan += '			<p>' + value.fc_etiqueta_periodo + '<span>' + value.fc_etiqueta_texto_auxiliar + '</span></p>';
		}
		if(value.fi_ban_detalle == 1){
			if(value.fc_url_detalle == var_detalle_default)
			{			
				var urlDetalleDefault = jQuery(location).attr('href').split('!')[0];
				if(urlDetalleDefault.indexOf('wps') >=0) {
					urlDetalleDefault = fc_url_detalle;
					urlDetalleDefault += '?idPlan=' + value.fi_plan; 
					if(precioMostrar == 'ESPS' || precioMostrar == 'ENPS' || precioMostrar == 'ESPN') {
						urlDetalleDefault += '&TP=' + precioMostrar; 
					}
				} else {
					if(value.fc_target_detalle == 'lightbox') {
						urlDetalleDefault += value.fi_plan + '_LB';
					} else {
						urlDetalleDefault += value.fi_plan;
					}
					if(precioMostrar == 'ESPS' || precioMostrar == 'ENPS' || precioMostrar == 'ESPN') {
						urlDetalleDefault += '_' + precioMostrar; 
					}
				}
				if(value.fc_target_detalle == 'lightbox') {
					htmlPlan += '			<a href="' + urlDetalleDefault + '" data-fancybox-type="iframe" class="link js-lightbox">' + value.fc_texto_detalle + '</a>';
				} else {
					htmlPlan += '			<a href="' + urlDetalleDefault + '" class="link" target="' + value.fc_target_detalle + '">' + value.fc_texto_detalle + '</a>';
				}
			} else {
				if(value.fc_target_detalle == 'lightbox') {
					htmlPlan += '			<a href="' + value.fc_url_detalle + '" data-fancybox-type="iframe" class="link js-lightbox">' + value.fc_texto_detalle + '</a>';
				} else {
					htmlPlan += '			<a href="' + value.fc_url_detalle + '" class="link" target="' + value.fc_target_detalle + '">' + value.fc_texto_detalle + '</a>';
				}
			}
		}
		htmlPlan += '		</dd>';
		var total_caracteristicas = value.lstCaracteristicas.length;
		var cntadot_caracteristicas = 0;
		$.each(value.lstCaracteristicas , function( ind, carac ) {
			if(cntadot_caracteristicas < no_caracteristicas){
				if(carac.fc_valor_mostrar == 'VAD'){
					if(carac.fc_tipo_campo == 'TXT') {
						htmlPlan += '<dd class="carac-plan">';
						htmlPlan += '<p><strong>' + carac.fc_valor + '</strong> ' +  carac.fc_nombre + '</p>';
						htmlPlan += '</dd>';
					} else if(carac.fc_tipo_campo == 'IMG') {
						htmlPlan += '<dd class="carac-plan">';
						htmlPlan += '<div class="contImg"><img src="' + carac.fc_valor + '"/></div>';
						htmlPlan += '<p>' + carac.fc_nombre + '</p>';
						htmlPlan += '</dd>';
					}			
				} else if(carac.fc_valor_mostrar == 'DVA'){
					if(carac.fc_tipo_campo == 'TXT') {
						htmlPlan += '<dd class="carac-plan">';
						htmlPlan += '<p>' + carac.fc_nombre + ' <strong>' + carac.fc_valor + '</strong></p>';
						htmlPlan += '</dd>';
					} else if(carac.fc_tipo_campo == 'IMG') {
						htmlPlan += '<dd class="carac-plan">';
						htmlPlan += '<p>' + carac.fc_nombre + '</p>';
						htmlPlan += '<div class="contImg"><img src="' + carac.fc_valor + '"/></div>';
						htmlPlan += '</dd>';						
					}
				} else if(carac.fc_valor_mostrar == 'SVA'){
					if(carac.fc_tipo_campo == 'TXT') {
						htmlPlan += '<dd class="carac-plan">';
						htmlPlan += '<p>' + carac.fc_valor + '</p>';
						htmlPlan += '</dd>';
					} else if(carac.fc_tipo_campo == 'IMG') {
						htmlPlan += '<dd class="carac-plan">';
						htmlPlan += '<div class="contImg"><img src="' + carac.fc_valor + '"/></div>';
						htmlPlan += '</dd>';						
					}
				} 		
			}
			cntadot_caracteristicas++;		
		});	
		
		for(var i = total_caracteristicas; i < no_caracteristicas; i++)
		{
			htmlPlan += '<dd class="carac-plan">';
			htmlPlan += '<p></p>';
			htmlPlan += '</dd>';
		}
			
		if(value.fi_ban_contratar == 1) {
			if(value.fc_opcion_contratacion == 'SOL') {
				var urlSol = fc_url_solicitud + '?plan=' + value.fi_plan;
				if(value.fc_target_contratar == 'lightbox') {
					htmlPlan += '		<dd class="call"><a href="' + urlSol + '" data-fancybox-type="iframe" class="btn-rojo js-lightbox">' + value.fc_texto_contratar + '</a></dd>';
				} else {
					htmlPlan += '		<dd class="call"><a href="' + urlSol + '" class="btn-rojo" target="' + value.fc_target_contratar + '">' + value.fc_texto_contratar + '</a></dd>';
				}
			} else {
				if(value.fc_target_contratar == 'lightbox') {
					htmlPlan += '		<dd class="call"><a href="' + value.fc_url_contratar + '" data-fancybox-type="iframe" class="btn-rojo js-lightbox">' + value.fc_texto_contratar + '</a></dd>';
				} else {
					htmlPlan += '		<dd class="call"><a href="' + value.fc_url_contratar + '" class="btn-rojo" target="' + value.fc_target_contratar + '">' + value.fc_texto_contratar + '</a></dd>';
				}
			}
		}
		htmlPlan += '	</dl>';
		htmlPlan += '</article>';
		$(".contentPlanPrecio").append(htmlPlan);
	} 
}


function resetFiltro (precioMostrar, var_inicio) {
	if(precioMostrar != 'NORMAL') {
		var isFiltroPrecio = $("#val-1").length;
		var filtroPrecio = 0;
		if(isFiltroPrecio > 0 ){
			filtroPrecio = $("#val-1").val();
		}
		var lstPrecios = new Array();
		lstPreciosIDs = new Array();
		var conta = 0;
		$.each(planesDisponibilidad, function( index, value ) {
			if(precioMostrar == 'NORMAL') {
				valPrecio = value.fi_precio;
			} else if(precioMostrar == 'ESPS') {		
				valPrecio = value.fi_precio_internet_esps;
			} else if(precioMostrar == 'ENPS') {		
				valPrecio = value.fi_precio_telefonia_enps;
			} else if(precioMostrar == 'ESPN') {		
				valPrecio = value.fi_precio_television_espn;
			} else if(precioMostrar == 'ENPN') {		
				valPrecio = value.fi_precio;
			}
			if(valPrecio >= 0) {
				lstPrecios[conta] = valPrecio;
				lstPreciosIDs[conta] = [ valPrecio, index];
				conta++;
			}
		});
		
		lstPreciosIDs.sort(function(a,b){
			if(a[0]==b[0]) return a[1]-b[1];
			if(a[0]>b[0]) return 1;
			return -1;
		});
			
		if(lstPrecios.length > 0) {
			var iniPrecioFiltro = Math.min.apply( Math, lstPrecios );
			var finPrecioFiltro = Math.max.apply( Math, lstPrecios );
			precioMayor = finPrecioFiltro;
			var intervalo = Math.round((finPrecioFiltro - iniPrecioFiltro) /10);
			
			if(filtroPrecio > finPrecioFiltro){
				filtroPrecio = finPrecioFiltro;
			} else if(filtroPrecio < iniPrecioFiltro) {
				filtroPrecio = iniPrecioFiltro;
			}
			if(var_inicio == true) {
				filtroPrecio = finPrecioFiltro;
			} 
			$(".val-1").html('<dt>Precio</dt><dd><input type="range" id="val-1" value="' + filtroPrecio + '" min="' + iniPrecioFiltro +'" max="' + finPrecioFiltro + '" step="' + intervalo +'"><div class="valores"><p class="valMin">' + formatoMoneda(iniPrecioFiltro) + '</p><p class="valMax">' + formatoMoneda(finPrecioFiltro) + '</p></div></dd>');		
		} 
	}
}

function filtrar(var_inicio) {
	
	var precioMostrar_Ini = validaPrecioMostrar();
	
	resetFiltro(precioMostrar_Ini, var_inicio);
	
	$(".contentPlanPrecio").html('');
	var filtros = $(".contRounded input, .contRounded select");
	var isFiltroPrecio = $("#val-1").length;
	var filtroPrecio = 0;
	if(isFiltroPrecio > 0 ){
		filtroPrecio = $("#val-1").val();
	}
	
	var filtrosValores = new Array();
	var filtrosCombo = new Array();
	var contFil = 0;
	var contCom = 0;
	for(var i = 0; i < filtros.length; i++) {
		if(filtros[i].type == 'select-one') {
			var dtoFiltros = [];
			dtoFiltros[0] = filtros[i].id;
			dtoFiltros[1] = filtros[i].value;			
			var isEspecial = $(filtros[i]).attr('isEspecial');
			if(isEspecial) {
				dtoFiltros[2] = true;
			}else {
				dtoFiltros[2] = false;
			}
			
			filtrosCombo[contCom] = (dtoFiltros);
			contCom++;
		} else {
			var idFiltrosPre = filtros[i].id.replace("val", '');
			if(idFiltrosPre > 0) {				
				var dtoFiltros = [];
				dtoFiltros[0] = filtros[i].id;
				dtoFiltros[1] = filtros[i].value;
				filtrosValores[contFil] = (dtoFiltros);
				contFil++;
			}
		}
	}
	
	var planesFiltros = jQuery.parseJSON('[{}]');
	var conta1 = 0;
	var contaResultados = 0;
	for(var ii = 0; ii < lstPreciosIDs.length; ii++) {
		var value = planesDisponibilidad[lstPreciosIDs[ii][1]];		
		if(isFiltroPrecio > 0 ) { 
			var precioMostrar = validaPrecioMostrar();
			var valPrecio = -1;
			if(precioMostrar == 'NORMAL') {
				valPrecio = value.fi_precio;
			} else if(precioMostrar == 'ESPS') {		
				valPrecio = value.fi_precio_internet_esps;
			} else if(precioMostrar == 'ENPS') {		
				valPrecio = value.fi_precio_telefonia_enps;
			} else if(precioMostrar == 'ESPN') {		
				valPrecio = value.fi_precio_television_espn;
			} else if(precioMostrar == 'ENPN') {		
				valPrecio = value.fi_precio;
			}
			
			if(valPrecio >= 0) {
				if(valPrecio <= filtroPrecio) {
					var isVisible = validaFiltros(value, filtrosCombo, filtrosValores);
					if(isVisible == true) {
						var precioMostrar = validaPrecioMostrar();
						if(precioMostrar == 'ESPS') {
							isVisible = validaPrecio(value.fi_precio_internet_esps);						
						} else if(precioMostrar == 'ENPS') {
							isVisible = validaPrecio(value.fi_precio_telefonia_enps);						
						} else if(precioMostrar == 'ESPN') {
							isVisible = validaPrecio(value.fi_precio_television_espn);						
						}
						if(isVisible == true) {
							setHTML(value, ii, precioMostrar);
							contaResultados ++;
						}
					}
				}
			}
		} else {
			var isVisible = validaFiltros(value, filtrosCombo, filtrosValores);
			if(isVisible == true) {
				var precioMostrar = validaPrecioMostrar();
				if(precioMostrar == 'ESPS') {
					isVisible = validaPrecio(value.fi_precio_internet_esps);						
				} else if(precioMostrar == 'ENPS') {
					isVisible = validaPrecio(value.fi_precio_telefonia_enps);						
				} else if(precioMostrar == 'ESPN') {
					isVisible = validaPrecio(value.fi_precio_television_espn);						
				}
				if(isVisible == true) {
					setHTML(value, ii, precioMostrar);
					contaResultados ++;
				}
			}
		}
	}
		
	if(contaResultados == 0){
		 $(".contentPlanPrecio").html('No encontramos productos con ese criterio de busqueda.<span class="frown"></span> <a class="resetFilter link" onclick="reset();">Borrar filtros</a>');
	}	
}


function validaPrecio (precio) {
	var isVisible = false;
	try {		
		if(precio > 0) {
			isVisible = true;
		}
	} catch (err) {
		isVisible = false;
	}	
	return isVisible;
}


function validaPrecioMostrar() {
	try {
		var filtros = $(".contRounded select");
		var tempPre = '';
		for(var i = 0; i < filtros.length; i++) {
			var isEspecial = $(filtros[i]).attr('isEspecial');
			if(isEspecial == 'true') {
				var tipo = $(filtros[i]).val();
				tempPre += tipo;
			}
		}
		if(tempPre != '' && tempPre != '-1') {
			if(tempPre == 'ESPS' || tempPre == 'PSES') tempPre = 'ESPS';
			if(tempPre == 'ENPS' || tempPre == 'PSEN') tempPre = 'ENPS';
			if(tempPre == 'ESPN' || tempPre == 'PNES') tempPre = 'ESPN';
			if(tempPre == 'ENPN' || tempPre == 'PNEN') tempPre = 'ENPN';
		} else {
			tempPre = 'NORMAL';
		}
	} catch(err) {
		tempPre = 'NORMAL';
	}
	return tempPre;
}



function validaFiltros(plan, filtrosCombo, filtrosValores) {	
	var isVisible = false;	
	var con = 0;
	var continuar = true;
	if(filtrosCombo.length > 0) {
		for(var j=0; j < filtrosCombo.length; j++) {
			if(con > 0) {
				if(isVisible == false) {
					continuar = false;
				}
			}
			if(continuar) {		
				if(filtrosCombo[j][1] == -1 || filtrosCombo[j][2] == true) {
					isVisible = true;
				} else {
					if(plan.lstFiltros.length == 0) {
						isVisible = false;
					} else {
						$.each(plan.lstFiltros, function(ind, valor) {
							if(valor.fi_tipo_filtro == 1 || valor.fi_tipo_filtro == 4) {
								if("val" + valor.fi_filtro == filtrosCombo[j][0]) {
									if(filtrosCombo[j][1] == valor.fi_opcion_filtro || filtrosCombo[j][1] == -1) {
										isVisible = true;										
									} else {
										isVisible = false;
									}
								} 								
							}
						})
					}
				}
			}
			con++;
		}	
	} else {
		isVisible = true;
	}
	
	if(isVisible) {
		con = 0;
		continuar = true;
		if(filtrosValores.length > 0) {
			for(var j=0; j < filtrosValores.length; j++) {
				if(con > 0) {
					if(isVisible == false) {
						continuar = false;
					}
				}
				if(continuar) {	
					$.each(plan.lstFiltros, function(ind, valor) {
						if(valor.fi_tipo_filtro == 2) {
							if("val" + valor.fi_filtro == filtrosValores[j][0]) {
								if(valor.fc_valor <= filtrosValores[j][1]) {
									isVisible = true;										
								} else {
									isVisible = false;
								}
							}		
						}
					});			
				}
				con++;
			}
		} else {
			isVisible = true;
		}
	}
	return isVisible;
}

function reset(){
	$('.select > select').prop('selectedIndex',0);
	var barras = $(".contRounded .valMax");
	$.each($(".contRounded input"), function(ind, valor) {
		if(valor.id != 'val-1'){
			$(valor).val($(valor).attr('max'));
			$(barras[ind]).html($(valor).attr('max'));
		}		
	});
	$.each($(".contRounded dl#isHidden"), function( index, value ) {
		$(value).hide();
	});
	setHTMLPlanes(jsonPlanes);
};

$( window ).load(function() {
	resetFiltros();
});


function validaMuestraFiltros(filtro) {
	if($('.contRounded dl#isHidden').length > 0) {
		var filtrosHabilita = $("#val" + filtro + " option:selected").attr('filtroparent');
		if(filtrosHabilita != '') {		
			filtrosHabilita = filtrosHabilita.split("|");
			for(var i = 0; i <filtrosHabilita.length; i++) {
				$.each($(".contRounded dl#isHidden"), function( index, value ) {
					var idfiltro = $(value).attr('idfiltro');
					if(idfiltro == filtrosHabilita[i]){
						$(value).show();
					}
				});
			}
		} else {
			$.each($(".contRounded dl#isHidden"), function( index, value ) {
				$(value).hide();
			});
		}
		
		$('.contRounded dl#isHidden .select> select').prop('selectedIndex',0);
		var barras = $(".contRounded dl#isHidden .valMax");
		$.each($(".contRounded dl#isHidden input"), function(ind, valor) {		
			$(valor).val($(valor).attr('max'));
			$(barras[ind]).html($(valor).attr('max'));
		});
	}
}
