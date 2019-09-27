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


/*Iniciamos las variables necesaria para el programa.*/
var listadoRecetas = new Array(); 
var numReceta;
var numIngrediente;
 

/*Al cargar la página, cargamos las funciones que iniciarán la carga de todo el programa.*/
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
        cargarRecetaIngrediente();
        cargarIngrediente();
        aceptarCambios();
        volverAtras();
    });
}


/*Con esta función cargamos la receta e ingrediente seleccionados en la página anterior*/
function cargarRecetaIngrediente() {
    numReceta = localStorage.getItem("seleccionReceta");
    numIngrediente = localStorage.getItem('seleccionIngrediente');
    listadoRecetas = JSON.parse(localStorage.getItem("recetas"));
}


/*Con esta función cargamos el ingrediente y el procentaje*/
function cargarIngrediente() {
    document.querySelector('#nombre-ingrediente').placeholder = listadoRecetas[numReceta].ingredientes[numIngrediente][0];
    document.querySelector('#porcentaje-ingrediente').placeholder = listadoRecetas[numReceta].ingredientes[numIngrediente][1];
}


/*Con esta función ponemos en escucha el boton de aceptar cambios*/
function aceptarCambios(){
    document.querySelector('#boton-aceptar').addEventListener('click', function() {
        var nuevoNombre = document.querySelector('#nombre-ingrediente').value;
        var nuevoPorcentaje = document.querySelector('#porcentaje-ingrediente').value;
        if(nuevoNombre !== null && nuevoNombre !== '') {
            listadoRecetas[numReceta].ingredientes[numIngrediente][0] = nuevoNombre;
            localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
        }
        if (nuevoPorcentaje !== '' && nuevoPorcentaje !== null) {
            nuevoPorcentajeNum = parseInt(nuevoPorcentaje);
            ordenarIngredientes();
            listadoRecetas[numReceta].ingredientes[numIngrediente][1] = nuevoPorcentajeNum;
            localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
        }
        var tab = window.open('receta.html', '_self');
    });
}


/*Con esta función ordenamos los ingredientes por el % de mayor a menor.*/
function ordenarIngredientes() {
    listadoRecetas[numReceta].ingredientes.sort(function(a,b){
        return a[1] < b[1]; // orden descendente por los valores;
    });
}


/*Con esta función volvemos a la página de ingredientes*/
function volverAtras(){
    document.querySelector('#atras').addEventListener('click', function(){
        var tab = window.open('receta.html', '_self');
    });
}