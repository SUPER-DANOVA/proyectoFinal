const {ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld(
    "comunicacion",
    {
        iniciarSesion: (datos) => ipcRenderer.send("iniciarSesion", datos)
        ,
        editarProducto: (datos) => ipcRenderer.send("editarProducto", datos)
        ,
        solicitarPedido: (datos) => ipcRenderer.send("solicitarPedido", datos)
        ,
        llenarListaProductos: (callback) => ipcRenderer.on("llenarListaProductos", callback)
        ,
        llenarListaProveedores: (callback) => ipcRenderer.on("llenarListaProveedores", callback)
        ,
        actualizarProducto: (datos) => ipcRenderer.send("actualizarProducto", datos)
        , 
        crearPedido: (datos) => ipcRenderer.send("crearPedido", datos)
    }
)