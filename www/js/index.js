/*
 * Copyright (C) 2018 Jorge Vila

 * Este programa es software libre: puede redistribuirlo y/o modificarlo bajo
 * los términos de la Licencia General Pública de GNU publicada por la Free
 * Software Foundation, ya sea la versión 3 de la Licencia, o (a su elección)
 * cualquier versión posterior.
 *
 * Este programa se distribuye con la esperanza de que sea útil pero SIN
 * NINGUNA GARANTÍA; incluso sin la garantía implícita de MERCANTIBILIDAD o
 * CALIFICADA PARA UN PROPÓSITO EN PARTICULAR. Vea la Licencia General Pública
 * de GNU para más detalles.
 *
 * Usted ha debido de recibir una copia de la Licencia General Pública
 * de GNU junto con este programa. Si no, vea <http://www.gnu.org/licenses/>.
 */


/*Al cargar la página, cargamos las funciones que iniciarán la carga de todo el programa.*/
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
        cargarRecetas();
        escucharBotonCrear();
        escucharAyuda();
//        borrarTodo();
    }, false);
}


/*Iniciamos las variables necesarias para el programa.*/
var listadoRecetas;
var contadorRecetas;
var recetaSelecionada;


/*Creamos el objeto Pan.*/
function Pan (nombre) {
    this.nombre = nombre;
    this.peso = 1000;
    this.ingredientes = [['harina', 100],['agua', 60],['sal', 2],['levadura', 1]];
}
  

/*Con esta función cargamos las recetas cada vez que se abra o se refresque la página. Comprueba si localStorage está vacio. Si es así, añade la receta "Pan básico". Si no está vacío, añade todas las recetas que hay guardadas en el array "listadoRecetas".*/
function cargarRecetas() {
    listadoRecetas = new Array();
    contadorRecetas = 0;
    listadoRecetas = JSON.parse(localStorage.getItem('recetas'));
    if(listadoRecetas == null || listadoRecetas.length == 0) {
        listadoRecetas = new Array();
        crearReceta('Pan básico');
        contadorRecetas = 1;
    }
    else {
        contadorRecetas = listadoRecetas.length;
        for(var i = 0; i < contadorRecetas; i++){
            document.querySelector('#lista-recetas').insertAdjacentHTML('beforeend', '<li class="lista-receta" id="cargar' + i + '">' + listadoRecetas[i].nombre + '</li>');
            escucharLista(i);
            borrarReceta(i);
        }
    }
}


/*Con esta función creamos una nueva receta cada vez que pulsemos el botón "Crear receta". Además añadimos la receta en el array "listadoRecetas" y lo guardamos en el localStorage.*/
function crearReceta(nombre) {
    listadoRecetas[contadorRecetas] = new Pan(nombre);
    localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
    contadorRecetas++;
    borrarListaRecetas();
    cargarRecetas();
}


/*Con esta función ponemos a la escucha la lista de las recetas. Cuando se pinche encima de una de ellas, cargará la página de visualización y modificación de la receta*/
function escucharLista(num){
    document.querySelector('#cargar'+num).addEventListener('click', function(){
        localStorage.setItem('seleccionReceta', num);
        var tab = window.open('receta.html', '_self');
    });
}


/*Con esta función ponemos en escucha la pulsación del botón de crear nueva receta.*/
function escucharBotonCrear() {
    document.querySelector('#boton-agregar').addEventListener('click', function(){
        var nombre = prompt("Introduce el nombre de la receta (Max. 20 caracteres)");
        if (nombre !=='' && nombre !== null) {
        		if (nombre.length > 20) {
        			alert("Error en el nombre de la receta. Máximo 20 caracteres");
        		}
        		else {	
            	crearReceta(nombre);
            }
        }
    });
} 


/*Con esta función ponemos en escucha la pulsación larga de cada receta para la eliminación de la misma.*/
function borrarReceta(num) {
	var boton = document.querySelector('#cargar'+num);
	var hammertime = new Hammer(boton);
    
	hammertime.on('press', function(ev) {
		if(confirm("Borrar la receta " + listadoRecetas[num].nombre + "?")){
			listadoRecetas.splice(num, 1);
			localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
			borrarListaRecetas();
			cargarRecetas();
		}
		else{
			borrarListaRecetas();
			cargarRecetas();
		}
	});
}


/*Con esta función borramos la lista de recetas para volver a cargarla con los nuevos cambios.*/
function borrarListaRecetas() {
    var list = document.querySelector('#lista-recetas');
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}


/*Con esta función ponemos en escucha la pulsación del botón de ayuda.*/
function escucharAyuda() {
    document.querySelector('#ayuda').addEventListener('click', function() {
        alert('En esta página podrás crear nuevas recetas pulsado el icono del "+". Se creará una receta con unos ingredientes básicos. Podrás consultar y/o modificar tanto el nombre como cada uno de sus ingredientes, haciendo una pulsación sencilla encima del nombre. Por último, podrás borrar una receta dejando pulsado en el nombre de la receta que quieras borrar.');
    });
}


function borrarTodo() {
    document.querySelector('#borrar').addEventListener('click', function(){
        localStorage.clear();
        cargarRecetas();
    })
}