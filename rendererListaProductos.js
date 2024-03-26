const botonEditar = document.getElementById("boton-editar-producto");
const botonPedido = document.getElementById("boton-crear-pedido");
const tabla = document.getElementById("tabla");

let valores = [];


botonEditar.addEventListener("click", function(event){
    window.comunicacion.editarProducto(valores)
})


botonPedido.addEventListener("click", function(event){
    window.comunicacion.solicitarPedido(valores)
})

window.comunicacion.llenarListaProductos(function(event, args){
    for(let i = 0; i < args.length; i++){
        const fila = document.createElement('tr');
        const celdaCui = document.createElement('td');
        const celdaNombreProducto = document.createElement('td');
        const celdaDescripcionProducto = document.createElement('td');
        const celdaCategoriaProducto = document.createElement('td');
        const celdaexistenciaProducto = document.createElement('td');
        //const celdaCantidadSolicitada = document.createElement('td');
        const celdaProveedor = document.createElement('td');
    
        celdaCui.textContent = args[i]["codigo_unico_identificacion"];
        celdaNombreProducto.textContent = args[i]["nombre_producto"];
        celdaDescripcionProducto.textContent = args[i]["descripcion_producto"];
        celdaCategoriaProducto.textContent = args[i]["categoria_producto"];
        if (!args[i]["cantidad_solicitada"] == "" || !args[i]["cantidad_solicitada"] <= 0){
          celdaexistenciaProducto.textContent = args[i]["existencia"] + `(${args[i]["cantidad_solicitada"]})`;
          //fila.appendChild(celdaCantidadSolicitada);
        }else{
          celdaexistenciaProducto.textContent = args[i]["existencia"];
        }
        //celdaCantidadSolicitada.textContent = args[i]["cantidad_solicitada"];
        celdaProveedor.textContent = args[i]["proveedor"];
    
        fila.appendChild(celdaCui);
        fila.appendChild(celdaNombreProducto);
        fila.appendChild(celdaDescripcionProducto);
        fila.appendChild(celdaCategoriaProducto);
        fila.appendChild(celdaexistenciaProducto);
        fila.appendChild(celdaProveedor);
    
        tabla.querySelector('tbody').appendChild(fila);
    
      }
    
      // filas seleccionables

    const filas = tabla.getElementsByTagName('tr');
    for (let i = 0; i < filas.length; i++) {
      filas[i].addEventListener("click", function() {
        // Remover la clase 'selected' de todas las filas
        for (let j = 0; j < filas.length; j++) {
          filas[j].classList.remove('selected');
        }
        // Agregar la clase 'selected' a la fila seleccionada
        this.classList.add('selected');

        // Obtener valores de las celdas de la fila seleccionada
        valores = [];
        const celdas = this.getElementsByTagName('td');
        for (let k = 0; k < celdas.length; k++) {
          valores.push(celdas[k].innerText);
        }

        
        botonEditar.disabled = false;
        botonPedido.disabled = false;

      });
    }
});



