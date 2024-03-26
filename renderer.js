const form_inicio_sesion = document.getElementById("form_inicio_sesion");


form_inicio_sesion.addEventListener("submit", function(event){
    event.preventDefault(); // Evitar que el formulario se envíe

    const entradaIdEmpleado = document.getElementById("id-empleado").value;
    const entradaClaveEmpleado = document.getElementById("contrasena").value;
    
    // Enviar los valores como un objeto
    window.comunicacion.iniciarSesion([entradaIdEmpleado, entradaClaveEmpleado ]);
});
