const { app, BrowserWindow, ipcMain, webContents, dialog  } = require('electron')
const path = require("path")
const mysql = require("mysql2")
const bcrypt = require('bcrypt');


const saltRounds = 10;
let id_empleado;

// ventana de dialogo
function ventanaExito(titulo, mensaje) {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['OK'],
    title: titulo,
    message: mensaje,
  });
}


// conexion a la base de datos
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "supermercado"
})
  
// ventana inicio sesion

let ventana;

function createWindow () {
    ventana = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences:{
      preload: path.join(app.getAppPath(), "preload.js")
  }
  })

  ventana.loadFile('inicio_sesion.html')
}

// ventana lista productos

let ventana_lista_productos;

function createWindowListaProductos () {
  ventana_lista_productos = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences:{
      preload: path.join(app.getAppPath(), "preload.js")
  }
  })

  ventana_lista_productos.loadFile('lista_productos.html')
}


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// verifica los datos de inicio de sesion

ipcMain.on("iniciarSesion", function(event, args){
    conexion.promise().execute("SELECT * FROM empleados WHERE codigo_identificacion = ?", [args[0]])
    .then(([results, fields]) => {
      if (results.length > 0){
        //verifica la contraseña.
        id_empleado = results[0]["id_empleado"];
        bcrypt.compare(args[1], results[0]["clave"], function(err, result) {
          //si la contraseña es correcta, abre la ventana lista de productos y se obtienen los datos para llenar la tabla.
          if (result == true){
            createWindowListaProductos();
            ventana_lista_productos.webContents.on("did-finish-load", () => {
              conexion.promise().execute('SELECT * FROM vista_productos_pedidos;').then(([rows]) => {
                ventana_lista_productos.webContents.send("llenarListaProductos", rows);
                ventana.close();
              })
              .catch(error => {
                console.error('Error al consultar historial:', error);
              });
            });
          }else{
            dialog.showErrorBox('Error', 'Contraseña Incorrecta') 
          }
        });
      }else{
        dialog.showErrorBox('Error', 'No Existe el Usuario Ingresado')
      }
  }).catch(error => {
    console.error('Error al consultar historial:', error);
  });

});



// ventana edicion de productos

let ventana_edicion_productos;

function createWindowEdicionProductos() {
  ventana_edicion_productos = new BrowserWindow({
    width: 700,
    height: 800,
    webPreferences:{
      preload: path.join(app.getAppPath(), "preload.js")
  }
  })

  ventana_edicion_productos.loadFile('edicion_productos.html')
}

// abre ventana de edicion de productos

ipcMain.on("editarProducto", function(event, args){
  createWindowEdicionProductos();
  ventana_edicion_productos.webContents.on("did-finish-load", () => {
    ventana_edicion_productos.webContents.send("llenarListaProductos", args);
  });
});



// ventana pedidos

let ventanaPedidos;

function createWindowPedidos() {
  ventanaPedidos = new BrowserWindow({
    width: 700,
    height: 800,
    webPreferences:{
      preload: path.join(app.getAppPath(), "preload.js")
  }
  })

  ventanaPedidos.loadFile('pedidos.html')
}

// abre ventana de pedidos

ipcMain.on("solicitarPedido", function(event, args){
  createWindowPedidos();
  ventanaPedidos.webContents.on("did-finish-load", () => {
    ventanaPedidos.webContents.send("llenarListaProductos", args);
    conexion.promise().execute('SELECT nombre_proveedor FROM proveedores;').then(([rows]) => {
      ventanaPedidos.webContents.send("llenarListaProveedores", rows);
    })

  });
});



// actualiza un producto

ipcMain.on("actualizarProducto", function(event, args){

conexion.promise().execute(
  'UPDATE productos SET nombre_producto = ?, descripcion_producto = ?, categoria_producto = ?, existencia = ? WHERE codigo_unico_identificacion = ?', 
  [args[1], args[2], args[3], args[4], args[0]]
)
.then(([rows, fields]) => {
  console.log('Fila actualizada exitosamente');
  ventanaExito('Éxito', 'Fila actualizada exitosamente.');
  if (ventana_lista_productos && !ventana_lista_productos.isDestroyed()) {
    // Recargar la ventana
    ventana_lista_productos.reload();
    ventana_edicion_productos.close();
  }
})
.catch((err) => {
  console.error('Error al actualizar la fila:', err);
  dialog.showErrorBox('Error al actualizar la fila', 'Error al actualizar la fila:' + err);
});

});



// realiza un pedido

ipcMain.on("crearPedido", function(event, args){
  
  conexion.promise().execute(
    'SELECT pedidos_pendientes FROM vista_productos_pedidos WHERE codigo_unico_identificacion = ? AND proveedor = ?', 
    [args[0], args[2]]
  )
  .then(([rows, fields]) => {
    if (rows.length > 0) {
      dialog.showErrorBox('Error', 'Ya existe un pedido hacia el mismo proveedor');
    } else {
      // se obtiene la fecha actual
      var fecha = new Date();
      var año = fecha.getFullYear();
      var mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      var día = fecha.getDate().toString().padStart(2, '0');
      // Formatear la fecha
      var fechaFormateada = año + '-' + mes + '-' + día;

      // registra un nuevo pedido

      conexion.promise().execute(
        `INSERT INTO pedidos (fecha_pedido, id_producto, proveedor_id, empleado_id, cantidad) VALUES
        (?, (select id_producto from productos where codigo_unico_identificacion = ?), (select id_proveedor from proveedores where nombre_proveedor = ?), ?, ?);`, 
        [fechaFormateada, args[0], args[2], id_empleado, args[3]]
      )
      .then(([rows, fields]) => {
        console.log('Pedido realizado exitosamente');
        ventanaExito('Éxito', 'Pedido realizado exitosamente.');
        if (ventana_lista_productos && !ventana_lista_productos.isDestroyed()) {
          // Recargar la ventana
          ventana_lista_productos.reload();
          ventanaPedidos.close();
        }
      })
      .catch((err) => {
        console.error('Error al actualizar la fila:', err);
        dialog.showErrorBox('Error al actualizar la fila', 'Error al actualizar la fila:' + err);
      });

    }
  })
  .catch((err) => {
    console.error('Error :', err);
    dialog.showErrorBox('Error ', 'Error ' + err);
  });


});