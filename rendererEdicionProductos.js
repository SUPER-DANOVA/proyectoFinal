const codigo = document.getElementById('id-producto');
const nombre = document.getElementById('nombre-producto');
const proveedor = document.getElementById('proveedor-producto');
const descripcion = document.getElementById('descripcion-producto');
const categoria = document.getElementById('categoria-producto');
const existencia = document.getElementById('existencia-producto');
const formulario = document.getElementById('formulario');

window.comunicacion.llenarListaProductos(function(event, args){
    codigo.value = args[0];
    nombre.value = args[1];
    existencia.value = parseInt(args[4]);
    descripcion.value = args[2];
    categoria.value = args[3];
});

formulario.addEventListener('submit', function(event){
    event.preventDefault();
    const datos = [];
    
    datos.push(codigo.value);
    datos.push(nombre.value);
    datos.push(descripcion.value);
    datos.push(categoria.value);
    datos.push(existencia.value);

    window.comunicacion.actualizarProducto(datos);
})