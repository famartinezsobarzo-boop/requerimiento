const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./crm.db");



db.serialize(() => {

    // Crear tabla
    db.run(`
        CREATE TABLE IF NOT EXISTS oportunidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            cliente TEXT NOT NULL,
            responsable TEXT NOT NULL,
            estado TEXT NOT NULL,
            prioridad TEXT NOT NULL,
            valor REAL DEFAULT 0,
            descripcion TEXT,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


    if (row.total === 0) {
    // insertar las 5 oportunidades
}

    // Verificar si existen datos
    db.get(
        "SELECT COUNT(*) AS total FROM oportunidades",
        (err, row) => {

            if (err) {
                console.error(err);
                return;
            }

            // Insertar datos semilla solamente si la tabla está vacía
            if (row.total === 0) {

                const oportunidades = [

const oportunidades = [
    {
        nombre: "Implementación de Sistema ERP",
        cliente: "Empresa ABC",
        responsable: "Juan Pérez",
        estado: "Activo",
        prioridad: "Alta",
        valor: 8500000,
        descripcion: "Implementación de un sistema ERP para mejorar la gestión administrativa y financiera."
    },
    {
        nombre: "Desarrollo de Aplicación Web",
        cliente: "Comercial XYZ",
        responsable: "María González",
        estado: "Pendiente",
        prioridad: "Media",
        valor: 4500000,
        descripcion: "Desarrollo de una plataforma web para la gestión de clientes y ventas."
    },
    {
        nombre: "Servicio de Soporte TI",
        cliente: "Empresa Digital",
        responsable: "Carlos Soto",
        estado: "Cerrado",
        prioridad: "Baja",
        valor: 2500000,
        descripcion: "Servicio de soporte técnico, mantenimiento preventivo y asistencia informática."
    },
    {
        nombre: "Migración de Servidores",
        cliente: "Corporación Chile",
        responsable: "Juan Pérez",
        estado: "Activo",
        prioridad: "Alta",
        valor: 12000000,
        descripcion: "Migración de infraestructura tecnológica hacia nuevos servidores y configuración de servicios."
    },
    {
        nombre: "Sistema de Gestión de Inventario",
        cliente: "Comercial Norte",
        responsable: "María González",
        estado: "Pendiente",
        prioridad: "Media",
        valor: 3800000,
        descripcion: "Desarrollo de un sistema para controlar productos, stock, movimientos y reportes de inventario."
    }
];


                    [
                        "Implementación ERP",
                        "Empresa ABC",
                        "Juan Pérez",
                        "Activo",
                        "Alta",
                        8500000,
                        "Implementación de sistema ERP para gestión empresarial."
                    ],

                    [
                        "Desarrollo Aplicación Web",
                        "Comercial XYZ",
                        "María González",
                        "Pendiente",
                        "Media",
                        4500000,
                        "Desarrollo de plataforma web para clientes."
                    ],

                    [
                        "Soporte TI",
                        "Empresa Digital",
                        "Carlos Soto",
                        "Cerrado",
                        "Baja",
                        2500000,
                        "Servicio de soporte técnico y mantenimiento."
                    ],

                    [
                        "Migración de servidores",
                        "Corporación Chile",
                        "Juan Pérez",
                        "Activo",
                        "Alta",
                        12000000,
                        "Migración de infraestructura hacia nuevos servidores."
                    ],

                    [
                        "Sistema de inventario",
                        "Comercial Norte",
                        "María González",
                        "Pendiente",
                        "Media",
                        3800000,
                        "Desarrollo de sistema para controlar inventario."
                    ]

                

                const sql = `
                    INSERT INTO oportunidades
                    (
                        nombre,
                        cliente,
                        responsable,
                        estado,
                        prioridad,
                        valor,
                        descripcion
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;


                const stmt = db.prepare(sql);


                oportunidades.forEach(op => {

                    stmt.run(op);

                });


                stmt.finalize();

                console.log(
                    "Datos semilla insertados correctamente."
                );

            }

        }
    );

});
probabilidad_cierre INTEGER DEFAULT 0

module.exports = db;