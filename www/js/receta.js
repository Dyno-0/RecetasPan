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
var numIngredientes;
    

/*Al cargar la página, cargamos las funciones que iniciarán la carga de todo el programa.*/
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
        cargarRecetas();
        cargarTitulo();
        cargarPeso();
        modificarPeso();
        cargarIngredientes();
        anadirIngrediente();
        volverAtras();
        escucharAyuda();
    });
}


/*Con esta función cargamos la receta seleccionada en la página anterior*/
function cargarRecetas() {
    numReceta = localStorage.getItem("seleccionReceta");
    listadoRecetas = JSON.parse(localStorage.getItem("recetas"));
}


/*Con esta función cargamos el título de la receta y ponemos a la escucha la pulsación larga para cambiarlo*/
function cargarTitulo() {
    var titulo = listadoRecetas[numReceta].nombre;
    document.querySelector('#titulo').innerHTML = titulo;
    var boton = document.querySelector('#titulo');
    var hammertime = new Hammer(boton);
    
    hammertime.on('press', function(ev) {
        var nuevoNombre = prompt('Nuevo nombre de la receta');
        if(nuevoNombre !== null && nuevoNombre !== '') {
            document.querySelector('#titulo').innerHTML = nuevoNombre;
            listadoRecetas[numReceta].nombre = nuevoNombre;
            localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
        }
    });
}


/*Con esta función cargamos el peso total del pan y ponemos en escucha la pulsación larga para cambiar el valor.*/
function cargarPeso() {
    var peso = listadoRecetas[numReceta].peso;
    document.querySelector('#peso-numero').innerHTML = peso + ' gr';
}


function modificarPeso() {
    document.querySelector('#peso-numero').addEventListener('click', function(){
        var nuevoPeso = prompt('Nuevo peso');
        if(nuevoPeso == ''){
            alert('Debes introducir un peso válido.');
        }
        else if (nuevoPeso == null) {
            borrarListaIngredientes();
            cargarIngredientes();
        }
        else if (isNaN(nuevoPeso)) {
            alert('Debes introducir un número válido');
        }
        else{
            document.querySelector('#peso-numero').innerHTML = nuevoPeso + ' gr';
            listadoRecetas[numReceta].peso = nuevoPeso;
            localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
            borrarListaIngredientes();
            cargarIngredientes();
        }
    });
}


/*Con esta función cargamos los ingredientes guardados en el array Ingredientes dentro de la receta cargada*/
function cargarIngredientes() {
    var totalPorcentaje = calcularPorcentajes();
    ordenarIngredientes();
    localStorage.setItem('recetas', JSON.stringify(listadoRecetas));    
    for(var i = 0; i < listadoRecetas[numReceta].ingredientes.length; i++) {
        var pesoIngrediente = Math.round((listadoRecetas[numReceta].ingredientes[i][1] * listadoRecetas[numReceta].peso) / totalPorcentaje);
        document.querySelector('#lista-ingredientes').insertAdjacentHTML('beforeend', '<li class="lista-ingredientes"><span id="cargar' + i + '">' + listadoRecetas[numReceta].ingredientes[i][0] + ' <span id="porcentaje">' + listadoRecetas[numReceta].ingredientes[i][1] + '% ' + '</span></span><span style="float:right" id="peso-ingrediente' + i + '">' + pesoIngrediente + ' gr</span></li>');
        borrarIngrediente(i);
        modificarPesoIngrediente(i);
        escucharIngrediente(i);
    }
}


/*Con esta función calculamos el total de los porcentajes para calcular el peso de cada uno de los ingredientes*/
function calcularPorcentajes() {
    var valor = 0;
    for(var i = 0; i < listadoRecetas[numReceta].ingredientes.length; i++){
        valor += listadoRecetas[numReceta].ingredientes[i][1];
    }
    return valor;
}


/*Con esta función ordenamos los ingredientes por el % de mayor a menor.*/
function ordenarIngredientes() {
    listadoRecetas[numReceta].ingredientes.sort(function(a,b){
        return a[1] < b[1]; // orden descendente por los valores;
    });
}


function anadirIngrediente() {
    document.querySelector('#anadir-ingrediente').addEventListener('click', function() {
        var nuevoIngrediente = prompt('Nombre del nuevo ingrediente');
        if (nuevoIngrediente == '') {
            alert('Debes introducir un nombre válido.');
        }
        else if (nuevoIngrediente == null) {
            borrarListaIngredientes();
            cargarIngredientes();
        }
        else {
            var nuevoPorcentaje = prompt('Porcentaje del nuevo ingrediente');
            if (nuevoPorcentaje == '') {
                alert('Debes introducir un peso válido.');
                borrarListaIngredientes();
                cargarIngredientes();
            }
            else if (nuevoPorcentaje == null) {
                borrarListaIngredientes();
                cargarIngredientes();
            }
            else {
                if (isNaN(nuevoPorcentaje)) {
                    alert('Debes introducir un número válido.');
                    borrarListaIngredientes();
                    cargarIngredientes();
                }
                else {
                    nuevoPorcentaje = parseInt(nuevoPorcentaje);
                    listadoRecetas[numReceta].ingredientes[listadoRecetas[numReceta].ingredientes.length] = [nuevoIngrediente, nuevoPorcentaje];
                    ordenarIngredientes();
                    localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
                    borrarListaIngredientes();
                    cargarIngredientes();
                }
            }
        }
    });
}


/*Con esta función ponemos a la espera la pulsación larga encima de un ingrediente para poder borrarlo.*/
function borrarIngrediente(num){
    var boton = document.querySelector('#cargar'+num);
    var hammertime = new Hammer(boton);
    
    hammertime.on('press', function(ev) {
        if(confirm("Borrar el ingrediente " + listadoRecetas[numReceta].ingredientes[num][0] + "?")){
            listadoRecetas[numReceta].ingredientes.splice(num, 1);
            localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
            borrarListaIngredientes();
            cargarIngredientes();
        }
    });
}


/*Con esta función modificamos el peso de un ingrediente, con lo que modifica el total de peso del pan, como los pesos individuales de cada ingrediente*/
function modificarPesoIngrediente(num) {
    document.querySelector('#peso-ingrediente' + num).addEventListener('click', function(){
        var nuevoPesoIngrediente = prompt('Introduce nuevo peso');
        if(nuevoPesoIngrediente == '') {
            alert('Debes introducir un peso válido.')
        }
        else if (nuevoPesoIngrediente == null) {
            borrarListaIngredientes();
            cargarIngredientes();
        }
        else {
            if (isNaN(nuevoPesoIngrediente)) {
                alert('Debes introducir un número válido');
            }
            else {
                var nuevoPesoTotal = parseInt(nuevoPesoIngrediente);
                for(var i = 0; i < listadoRecetas[numReceta].ingredientes.length; i++) {
                    if(i == num){
                        continue;
                    }
                    nuevoPesoTotal += (nuevoPesoIngrediente * listadoRecetas[numReceta].ingredientes[i][1]) / listadoRecetas[numReceta].ingredientes[num][1];
                }
                listadoRecetas[numReceta].peso = nuevoPesoTotal;
                localStorage.setItem('recetas', JSON.stringify(listadoRecetas));
                cargarPeso();
                borrarListaIngredientes();
                cargarIngredientes();
            }
        }
    });
}


/*Con esta función borramos la lista de ingredientes para volver a cargarla con los nuevos cambios.*/
function borrarListaIngredientes() {
        var list = document.querySelector('#lista-ingredientes');
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
}


/*Con esta función ponemos en escucha la pulsación de un ingrediente para la modificación del mismo.*/
function escucharIngrediente(num){
    document.querySelector('#cargar'+num).addEventListener('click', function(){
        localStorage.setItem('seleccionIngrediente', num);
        var tab = window.open('ingrediente.html', '_self');
    });
}


/*Con esta función ponemos en escucha la pulsación del botón de ayuda.*/
function escucharAyuda() {
    document.querySelector('#ayuda').addEventListener('click', function() {
        alert('En esta página podrás cambiar el nombre de la receta pulsando encima del título.\r Podrás añadir nuevos ingredientes pulsado el icono del "+". Además podrás modificar el nombre y/o porcentaje de un ingrediente haciendo una pulsación sencilla encima del nombre del ingrediente. También podrás borrar un ingrediente dejando pulsado en el nombre del ingrediente.\rPulsando encima el peso total del pan, podrás cambiar dicho peso. Todos los ingredientes se recalculan automáticamente. También puedes cambiar el peso de un ingrediente concreto pulsando encima del peso de dicho ingrediente. Toda la receta se recalcula en función de los porcentajes de cada ingrediente y respetando el peso del ingrediente que quieres que quede inalterado.');
    });
}

/*Con esta función volvemos a la página principal*/
function volverAtras(){
    document.querySelector('#atras').addEventListener('click', function(){
        history.go(-1);
    });
}