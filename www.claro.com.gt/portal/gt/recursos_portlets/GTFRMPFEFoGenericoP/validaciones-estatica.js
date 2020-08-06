
//------[INICIO]Nuevas funciones --------------
var idAux="";
function okp_checkSoloNumeros(evt)
{
	//-- Valida numeros estrictamente, es decir no permite ni espacios, solo numeros, backspace, suprimir, flechas
	var charCode = (document.all) ? evt.keyCode : evt.which; 
	if (charCode > 31 && (charCode < 48 || charCode> 57) ) 
	{
		return false;
	}
	return true;
}

function okp_checkSoloLetras(evt)
{
	//-- Valida que se introduzcan letras (incluidas las vocales acentuadas) pero tambien permite espacios, backspace, delete, inicio, fin, flechas
	var charCode = (document.all) ? evt.keyCode : evt.which;
	//alert("charCode: " + charCode);
	if( ( (charCode >= 33 && charCode <= 64) || 
			 (charCode >=91 && charCode <=96 ) || 
			 (charCode >=123 && charCode <=192 ) || 
			 (charCode >=194 && charCode <=199 ) )&&
			 (charCode != 193 && charCode != 201 &&  charCode != 205 && charCode != 211 && charCode != 218 && charCode != 225 && charCode != 233 && charCode != 237 && charCode != 243 && charCode != 250)
	  ) 
	{
		return false;
	}
	return true;
}

function okp_checkCorreo(evt)
{
	//-- Permite caracteres de una direccion de correo electronico letras(no acentuadas), guion bajo, medio arroba y numeros
	var charCode = (document.all) ? evt.keyCode : evt.which; 
	if( (charCode >= 32 && charCode <= 44) || (charCode==47) || (charCode >=58 && charCode <=63 ) || (charCode >=91 && charCode <=94 ) || (charCode ==96) || (charCode >=123) ) 
	{
		return false;
	}
	return true;
}


function okp_checkTextoAbierto(evt)
{
	//-- Permite cualquier texto abierto, impide comillas simples, dobles y el pipe.
	var charCode = (document.all) ? evt.keyCode : evt.which; 
	if( (charCode==34)  || (charCode==39) || (charCode==124))
	{
		return false;
	}
	return true;
}

function okp_checkNoComillasSimples(evt)
{
	//-- Permite cualquier texto abierto, impide comillas simples y el pipe.
	var charCode = (document.all) ? evt.keyCode : evt.which; 
	if( (charCode==39) || (charCode==124))
	{
		return false;
	}
	return true;
}


function okp_checkAlfanumerico(evt)
{
	//-- Esta funcion solo permite letras y numeros, no caracteres acentuados, no espacios.
	var charCode = (document.all) ? evt.keyCode : evt.which; 
	//alert("charCode: " + charCode);
	if ((charCode >= 32 && charCode <= 47) || (charCode >=58  && charCode <=64) || (charCode >=91  && charCode <=96) || (charCode >=123) )
	{
		return false;
	}
	return true;
}

function okp_checkComentario(evt,pObj,pnuLong)
{
	//---- Evita las comillas simples y el pipe
	var charCode = (document.all) ? evt.keyCode : evt.which; 
	//alert("charcode: " + charCode);
	if( (charCode==39) || (charCode==124) || (charCode == 10) || (charCode == 13) )
	{
		return false;
	}
	
	if(pObj.value.length >= pnuLong)
	{
		return false;
	}
	
	return true;
}


function onsubmit_checkSoloNumeros(pstValor)
{
	//--- Permite solo numeros y sin espacios
	if(pstValor.search(/[^0-9]/) != -1)
	{
	 	return false;
	}
	return true
}

function onsubmit_checkSoloLetras(pstValor)
{
	//--- Permite solo letras, vocales acentuadas y espacio
	//if(pstValor.search(/[^a-zA-ZÁÉÍÓÚÑ/) != -1)
//	if(pstValor.search(/[^a-zA-Z]/) != -1)
//	{
//		return false;
//	}
//	return true;
	var reg = /^([a-z ñáéíóú]{2,60})$/i;
	if(reg.test(pstValor))  {
		return true;
	}
	return false;
}

function onsubmit_checkCorreoElectronico(pstValor)
{
	/**
	if( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(pstValor)) )
	{
		return false;
	}
	return true;
	*/
	
	 if(pstValor.search(/^[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}$/) == -1)
	       return false;
	     else
	       return true; 
}

function onsubmit_checkTextoAbierto(pstValor)
{
	//---Permite un texto abierto menos las comillas dobles o simples o los pipes
	if( pstValor.search(["\""]) != -1 || 
				pstValor.search(["\'"]) != -1 ||
					pstValor.search(/\x7C/) != -1)
	{
		return false;
	}
	return true;
}

function onsubmit_checkNoComillasSimples(pstValor)
{
	//---Permite un texto abierto menos las comillas dobles o simples o los pipes
	if( pstValor.search(["\'"]) != -1 ||
		pstValor.search(/\x7C/) != -1)
	{
		return false;
	}
	return true;
}

function onsubmit_checkAlfaNumerico(pstValor)
{
	//---Permite solo letras (no acentuadas) y numeros. No espacios ni ningun otro caracter
	if(pstValor.search(/[^0-9a-zA-Z]/) != -1)
	{
	 	return false;
	}
	return true
}


function onsubmit_checkComentario(pstValor, pnuLong)
{
	//---Permite un texto abierto menos las comillas simples o los pipes y verifica que tenga la longitud establecida
	if( pstValor.search(["\'"]) != -1 ||
		pstValor.search(/\x7C/) != -1)
	{
		return false;
	}
	else if(pstValor.length > pnuLong)
	{
		return false;
	}
	return true;
}

//------[FIN]Nuevas funciones -----------------

function stringLeftTrim(s)
{
	return s.replace(/^ +/, "");
}
function stringRightTrim(s)
{
	return s.replace(/ +$/, "");
}
function stStringTrim(s)
{
	return stringRightTrim(stringLeftTrim(s));
}

function checkSendData(formaFDin) 
{
	
	var opciones="";
	var lnuAuxiliar	= 0;
	var lnuTotalCampos = gobIdsCampos.length;
	
	for(xElementos = 0; xElementos < lnuTotalCampos; xElementos++)
	{
		var lObjForm 	= document.getElementById(gobIdsCampos[xElementos]);
		var lstIdCampo	= gobIdsCampos[xElementos];		
		var auxID=lObjForm.getAttribute('id');
		
		var tipo;
		if(lObjForm!=null)
			tipo=lObjForm.getAttribute('type');
		
		if(xElementos>0){	
			var anterior=document.getElementById(gobIdsCampos[xElementos-1]);
			var tipoAnterior=anterior.getAttribute('type');
			
			if(tipo=="text"&&tipoAnterior=="checkbox"){
				$("#"+auxID).val(opciones);
				opciones="";
			}
		}
		
		if(tipo=="checkbox"){
			//CAMBIO
			var id=lObjForm.getAttribute('id');
			if($("#"+id).is(':checked')){
				var valor=lObjForm.getAttribute('value');
				opciones=opciones+"|"+valor;				
			}
			
			try{
				var next=document.getElementById(gobIdsCampos[xElementos+1]);
				var tipoNext=next.getAttribute('type');
				if(tipoNext!="checkbox"){
					campoNext=gobIdsCampos[xElementos+1];
					 					
				//	$("#"+campoNext).val(opciones);
					
					//opciones="";
				}
			}catch(e){
				$("#"+idAux).val(opciones);
				opciones="";
			}
		}

		
		if(lObjForm.getAttribute('required')!=null)
		if(lObjForm.getAttribute('required').toUpperCase() == 'SI' || lObjForm.getAttribute('required').toUpperCase() == '1' )
		{
			//alert("Id: " + gobIdsCampos[xElementos] + " Requerido: " + lObjForm.getAttribute('required'));
			//alert("form.value= "+ lObjForm.type.toUpperCase());
			if(lObjForm.type.toUpperCase() == "TEXT")
			{
				if(lObjForm.value.length == 0 || stStringTrim(lObjForm.value) == "")
				{
					lnuAuxiliar ++;
					fActivarError("err_"+lstIdCampo);
				}
				else
					fDesactivarError("err_"+lstIdCampo);
			}//Termina			
			else if(lObjForm.type.toUpperCase() == "SELECT-ONE")
		 	{
		 		if(lObjForm.options[lObjForm.selectedIndex].value == "-1")
		 		{
		 			lnuAuxiliar ++;
		 			fActivarError("err_"+lstIdCampo);
		 		}
		 		else
		 			fDesactivarError("err_"+lstIdCampo);
		 	}//Termina  
			else if(lObjForm.type.toUpperCase() == "TEXTAREA")
			{
				if(lObjForm.value.length == 0 || stStringTrim(lObjForm.value) == "")
				{
					lnuAuxiliar ++;
					fActivarError("err_"+lstIdCampo);
				}
				else
					fDesactivarError("err_"+lstIdCampo);
			}
			else if(lObjForm.type.toUpperCase() == "CHECKBOX")
			{
				
				if(!lObjForm.checked)
				{
					lnuAuxiliar ++;
					fActivarError("err_"+lstIdCampo);
				}
				else
					fDesactivarError("err_"+lstIdCampo);
			
			}
		}//Termina
		
		
		//alert("Id: " + gobIdsCampos[xElementos] + " Datatype: " + lObjForm.getAttribute('datatype'));
		if(lObjForm.getAttribute('datatype').toUpperCase() == "SOLONUMEROS")
		{
			if(!onsubmit_checkSoloNumeros(lObjForm.value) && (stStringTrim(lObjForm.value) != ""))
			{
				lnuAuxiliar ++;
				fActivarError("formato_"+lstIdCampo);
			}
			else
				fDesactivarError("formato_"+lstIdCampo);
			
		}//Termina SOLONUMEROS
		
		if(lObjForm.getAttribute('datatype').toUpperCase() == "SOLOLETRAS")
		{
			//alert("Solo letras: " + onsubmit_checkSoloLetras(lObjForm.value) + " lObjForm.value: _" + stStringTrim(lObjForm.value) + "_");
			if(!onsubmit_checkSoloLetras(lObjForm.value) && (stStringTrim(lObjForm.value) != ""))
			{
				//alert("Paso 2");
				lnuAuxiliar ++;
				fActivarError("formato_"+lstIdCampo);
			}
			else
				fDesactivarError("formato_"+lstIdCampo);
		}//Termina SOLOLETRAS
				
		if(lObjForm.getAttribute('datatype').toUpperCase() == "CORREO")
		{
			if( !onsubmit_checkCorreoElectronico(lObjForm.value) && (stStringTrim(lObjForm.value) != "") )
			{
				lnuAuxiliar ++;
				fActivarError("formato_"+lstIdCampo);
		 	}
			else
				fDesactivarError("formato_"+lstIdCampo);
			
		}//Termina CORREO
		
		if(lObjForm.getAttribute('datatype').toUpperCase() == "TEXTOABIERTO")
		{
			if( !onsubmit_checkNoComillasSimples(lObjForm.value) && (stStringTrim(lObjForm.value) != ""))
			{
				lnuAuxiliar ++;
				fActivarError("formato_"+lstIdCampo);
			}
			else
				fDesactivarError("formato_"+lstIdCampo);
		}//Termina TEXTOABIERTO
		
		if(lObjForm.getAttribute('datatype').toUpperCase() == "ALFANUMERICO")
		{
			if( !onsubmit_checkAlfaNumerico(lObjForm.value)	&& (stStringTrim(lObjForm.value) != ""))
			{
				lnuAuxiliar ++;
				fActivarError("formato_"+lstIdCampo);
			}
			else
				fDesactivarError("formato_"+lstIdCampo);
		}//Termina ALFANUMERICO
		
		if(lObjForm.getAttribute('datatype').toUpperCase() == "COMENTARIO")
		{
			if(!onsubmit_checkComentario(lObjForm.value) && (stStringTrim(lObjForm.value) != ""))
			{
				lnuAuxiliar ++;
				fActivarError("formato_"+lstIdCampo);
			}
			else
				fDesactivarError("formato_"+lstIdCampo);
		}//Termina COMENTARIO
		
		if( stStringTrim(lObjForm.getAttribute('minlength')) != "" )
		{
			//alert("Id: " + gobIdsCampos[xElementos] + " Minlenght: " + lObjForm.getAttribute('minlength') + " lObjForm.value.length:" + lObjForm.value.length + " Comp: " + (lObjForm.value.length < parseInt(lObjForm.getAttribute('minlength'),10)));
			if( (lObjForm.value.length < parseInt(lObjForm.getAttribute('minlength'),10)) && 
				(stStringTrim(lObjForm.value)!= "") )
			{
				lnuAuxiliar ++;
				fActivarError("min_"+lstIdCampo);
			}
			else
				fDesactivarError("min_"+lstIdCampo);
		}//Termina 
		
		if( stStringTrim(lObjForm.getAttribute('maxlen')) != "" )
		{
			//alert("Id: " + gobIdsCampos[xElementos] + " Maxlenght: " + lObjForm.getAttribute('maxlen') );
			if( lObjForm.value.length > parseInt(lObjForm.getAttribute('maxlen'),10) && 
				(stStringTrim(lObjForm.value)!= "")  )
			{
				lnuAuxiliar ++;
				fActivarError("max_"+lstIdCampo);
			}
			else
				fDesactivarError("max_"+lstIdCampo);
		}//Termina 
	}//Termina for(xElementos = 0; xElementos < lnuTotalCampos; xElementos++)
		
	//---Verificacion de Kaptcha
	if( document.getElementById("hdRequiereCaptcha").value.length > 0  && stStringTrim(document.getElementById("hdRequiereCaptcha").value) == "SI" )
	{
		
		if($("#g-recaptcha-response").val() != '') {
			$("#error-captcha").html("");
			$("#error-captcha").removeClass("active");
		} else {
			lnuAuxiliar++;
			$("#error-captcha").html("El captcha es obligatorio");
			$("#error-captcha").addClass("active");
		}
	}
	
	//---Verificacion de Terminos
	if( document.getElementById("hdRequiereTerminos").value.length > 0  && stStringTrim(document.getElementById("hdRequiereTerminos").value) == "SI" )
	{
		if ( !document.getElementById('cb_casillaTerminos').checked )
		{	
			document.getElementById('casillaTerminos_ValidationError').innerHTML='Debes aceptar los t&eacuterminos y condiciones del servicio.';

			document.getElementById('casillaTerminos_ValidationError').setAttribute("class","error active");
			lnuAuxiliar++;
		}
		else{
			document.getElementById('casillaTerminos_ValidationError').innerHTML='';
		}
	}
	//alert("lnuAuxiliar:" + lnuAuxiliar);
	if(lnuAuxiliar > 0)
	{
		fActivarError("err_MensajeGral");
		$(".ventana_emergente#err_general").addClass("active");
	 	document.getElementById('err_MensajeGral').scrollIntoView( false );
	 	//refreshKaptchaGEN();
	 	//document.getElementById('inputCaptchaGEN').value='';
	 	return;
	 }
	 else
	 {
		 fDesactivarError("err_MensajeGral");
		 $(".ventana_emergente#err_general").removeClass("active");
		 idAux="";
		// alert($("#70").val());
		 //alert("Aqui enviaria a submit...");
		 //formaFDin.submit();
		 formSubmit(formaFDin);
	 }
	
}


function formSubmit(formaFDin){	
	console.log($(formaFDin).serialize());
	$.ajax({
		type: "POST",
		dataType: "html",
		data: $(formaFDin).serialize(),							
		url: "/GT_FRM_SRV_FormularioGenerico/ProcessServlet",		
		success: function(data) {
			console.log("data result: "+data);
			if(data.indexOf("SUCCESS")>0){
				$('#frmDesc').hide();
				$('#frmSection').hide();
				$('#result').html(data);
				$('#seccion_thanks').show();
			} else if (data.indexOf == 'ERROR'){
				$('#frmDesc').show();
				$('#frmSection').show();
			 	$('#err_MensajeGral').html(data);
				fActivarError("err_MensajeGral");
				$(".ventana_emergente#err_general").addClass("active");
			 	document.getElementById('err_MensajeGral').scrollIntoView( false );
			}
		},
		error: function(error){
			console.log("error: "+error);
		}
	});	
}

function fActivarError(pstNombre)
{
	document.getElementById(pstNombre).style.display = "block";
	document.getElementById(pstNombre).parentElement.setAttribute("class","error active");
}
 
function fDesactivarError(pstNombre)
{
	document.getElementById(pstNombre).style.display = "none";
	document.getElementById(pstNombre).parentElement.setAttribute("class","error active");
}
 
function resetData(formaFC)
{
	var lnuTotalCampos = gobIdsCampos.length;
	for(xElementos = 0; xElementos < lnuTotalCampos; xElementos++)
	{
		var lObjForm 	= document.getElementById(gobIdsCampos[xElementos]);
		var lstIdCampo	= gobIdsCampos[xElementos];
		
		if(lObjForm.type.toUpperCase() == "TEXT")
		{
			lObjForm.value = "";
		}
		else if(lObjForm.type.toUpperCase() == "SELECT-ONE")
		{
			lObjForm.selectedIndex=0;
		}
		else if(lObjForm.type.toUpperCase() == "TEXTAREA")
		{
			lObjForm.value = "";
		}
		
		fDesactivarError("err_"+lstIdCampo);
		fDesactivarError("formato_"+lstIdCampo);
		fDesactivarError("min_"+lstIdCampo);
		fDesactivarError("max_"+lstIdCampo);
		
	}

	/*if( document.getElementById("hdRequiereCaptcha").value.length > 0  && stStringTrim(document.getElementById("hdRequiereCaptcha").value) == "SI" )
	{
 	 	with (formaFC)
 	 	{
 			caracteresCaptcha.value="";
 			//document.getElementById('err_Kaptcha').innerHTML='';
 	 	} 		
	}*/
			
	fDesactivarError("err_MensajeGral");
	document.getElementById('tdPlaceToGo').scrollIntoView( false );
 	
 }
 
function obtenerValoresDependientes(pais, jdbc, idCampo, idCampoDependiente, valorDependiente, ambiente)
{
	var combo = $('#'+idCampo);	
	console.log("entra a obtener valores depensentes");
	$.ajax({
		type: "post",
		dataType: "json",
		data:{PAIS: pais, JDBC: jdbc, IDCAMPO:idCampo, IDCAMPODEPENDIENTE:idCampoDependiente, VALORDEPENDIENTE:valorDependiente, AMBIENTE:ambiente},
		url: "/GT_FRM_SRV_FormularioGenerico/JsonServlet",
		cache:false,
		success: function(data) {			
			combo.find('option').remove();
			$('<option>').val('-1').text('Selecciona una opci\u00f3n').appendTo(combo);
			$.each(data, function(key, value) {
				$('<option>').val(key).text(value).appendTo(combo);
			});
		}
	});
}