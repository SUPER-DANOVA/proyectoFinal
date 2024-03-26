const codigo = document.getElementById('id-producto');
const nombre = document.getElementById('nombre-producto');
const proveedor = document.getElementById('Proveedor');
const cantidad = document.getElementById('cantidad');
const botonConfirmarPedido = document.getElementById('botonConfirmarPedido');
const formulario = document.getElementById("formularioPedido");

let numeroUnicoIdentificacion;
let nombreProducto;


window.comunicacion.llenarListaProductos(function(event, args){
    codigo.value = args[0];
    nombre.value = args[1];
    numeroUnicoIdentificacion = args[0];
    nombreProducto = args[1];
    cantidad.value = parseInt(args[4]);
});

// rellena el select con los proveedores

window.comunicacion.llenarListaProveedores(function(event, args){
    for (let i = 0; i< args.length; i++){
        const opcion = document.createElement('option');
        opcion.value = args[i]["nombre_proveedor"];
        opcion.text = args[i]["nombre_proveedor"];
        proveedor.appendChild(opcion);
    }  
});


formulario.addEventListener("submit", function(event){

    const datos = [];
    datos.push(numeroUnicoIdentificacion);
    datos.push(nombreProducto);
    datos.push(proveedor.value);
    datos.push(cantidad.value);

    window.comunicacion.crearPedido(datos);


});