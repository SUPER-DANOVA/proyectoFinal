CREATE database supermercado;
USE supermercado;

CREATE TABLE empleados (
    id_empleado INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_empleado VARCHAR(255) NOT NULL,
    codigo_identificacion INT NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL
);

CREATE TABLE productos (
    id_producto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    codigo_unico_identificacion VARCHAR(255) NOT NULL UNIQUE,
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion_producto VARCHAR(255) NOT NULL,
    categoria_producto VARCHAR(255) NOT NULL,
    existencia INT NOT NULL
);

CREATE TABLE proveedores (
    id_proveedor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_proveedor VARCHAR(255) NOT NULL,
    producto_id INT,
    FOREIGN KEY (producto_id) REFERENCES productos(id_producto)
);

CREATE TABLE pedidos (
    id_pedido INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	fecha_pedido DATE,
	id_producto INT,
    proveedor_id INT,
    empleado_id INT,
	cantidad INT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id_proveedor),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);



/* dml */

-- Insertar registros en la tabla empleados
INSERT INTO empleados (nombre_empleado, codigo_identificacion, clave) VALUES		  -- contraseñas:
('Juan Pérez', 1001, '$2a$12$lrZNXGRMRSAhufdFTc28aunmd7y/n./cKIkrxxfbOygqjDQAFFTie'), -- clave1
('María López', 1002, '$2a$12$a9L8wyl.cOKU99cyI7iEEuSNwZzkPGSjBBZCs3qrlDKDG5VzhWxQW'), -- clave2
('Pedro Ramirez', 1003, '$2a$12$fzWLvm/BhFlk8POxl3V.Tetg.2poiR68ZlRBisLJ5tlKjIWocJOkG'), -- clave3
('Ana Martínez', 1004, '$2a$12$I0P/XXfLs0pQgC/AbgnRreOqPuSLRYXT/Sa.0rmeVs.gC5a4nvEK2'), -- clave4
('Luis González', 1005, '$2a$12$64aoZYhB33qmp.IO85yAyeFDmLUx45HLSuzgHAgl7X1vaz4BPFvqS'); -- clave5

-- Insertar registros en la tabla productos
INSERT INTO productos (id_producto, codigo_unico_identificacion, nombre_producto, descripcion_producto, categoria_producto, existencia) VALUES
(1,'PROD001', 'Laptop', 'Laptop HP de 15 pulgadas', 'Electrónica', 10),
(2,'PROD002', 'Smartphone', 'Smartphone Samsung Galaxy S20', 'Electrónica', 20),
(3,'PROD003', 'Mouse', 'Mouse inalámbrico Logitech', 'Periférico', 30),
(4,'PROD004', 'Teclado', 'Teclado mecánico RGB', 'Periférico', 15),
(5,'PROD005', 'Monitor', 'Monitor LED de 24 pulgadas', 'Electrónica', 12),
(6,'PROD006', 'Corn Flakes', 'Hojuelas de maiz', 'Cereales', 30);

-- Insertar registros en la tabla proveedores
INSERT INTO proveedores (nombre_proveedor, producto_id) VALUES
('Proveedor A', 1),
('Proveedor B', 2),
('Proveedor C', 3),
('Proveedor D', 4),
('Proveedor E', 5),
('Proveedor F', 6);

-- Insertar registros en la tabla pedidos
INSERT INTO pedidos (fecha_pedido, id_producto, proveedor_id, empleado_id, cantidad) VALUES
('2024-03-19', 1, 1, 1, 5),
('2024-03-19', 2, 2, 2, 10),
('2024-03-19', 3, 3, 3, 20),
('2024-03-19', 4, 4, 4, 1),
('2024-03-19', 5, 5, 5, 3);



CREATE VIEW vista_productos_pedidos AS
SELECT 
    p.codigo_unico_identificacion,
    p.nombre_producto,
    p.descripcion_producto,
    p.categoria_producto,
    p.existencia,
    pe.cantidad AS cantidad_solicitada,
    COUNT(pe.id_pedido) AS pedidos_pendientes,
    pr.nombre_proveedor AS proveedor
FROM 
    productos p
LEFT JOIN 
    pedidos pe ON p.id_producto = pe.id_producto
LEFT JOIN 
    proveedores pr ON pe.proveedor_id = pr.id_proveedor
GROUP BY 
    p.id_producto, pe.cantidad, pr.nombre_proveedor
ORDER BY 
    pedidos_pendientes DESC;
