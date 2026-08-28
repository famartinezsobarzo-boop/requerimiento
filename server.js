const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

require("dotenv").config();

const {
    responder
} = require("./assistantService");

/*
=================================
LISTAR OPORTUNIDADES
GET /api/oportunidades
=================================
*/

app.get("/api/oportunidades", (req, res) => {

    const {
        estado,
        responsable,
        prioridad
    } = req.query;


    let sql = `
        SELECT *
        FROM oportunidades
        WHERE 1 = 1
    `;

    const params = [];


    if (estado) {

        sql += " AND estado = ?";
        params.push(estado);

    }


    if (responsable) {

        sql += " AND responsable = ?";
        params.push(responsable);

    }


    if (prioridad) {

        sql += " AND prioridad = ?";
        params.push(prioridad);

    }


    sql += " ORDER BY id DESC";


    db.all(
        sql,
        params,
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    error: "Error al obtener oportunidades"
                });

            }


            res.json(rows);

        }
    );

});


/*
=================================
OBTENER POR ID
GET /api/oportunidades/:id
=================================
*/

app.get("/api/oportunidades/:id", (req, res) => {

    const id = req.params.id;


    db.get(
        "SELECT * FROM oportunidades WHERE id = ?",
        [id],
        (err, row) => {

            if (err) {

                return res.status(500).json({
                    error: "Error en la base de datos"
                });

            }


            if (!row) {

                return res.status(404).json({
                    error: "Oportunidad no encontrada"
                });

            }


            res.json(row);

        }
    );

});


/*
=================================
CREAR
POST /api/oportunidades
=================================
*/

app.post("/api/oportunidades", (req, res) => {

    const {
        nombre,
        cliente,
        responsable,
        estado,
        prioridad,
        valor,
        descripcion
    } = req.body;


    if (!nombre || !cliente || !responsable) {

        return res.status(400).json({
            error: "Faltan campos obligatorios"
        });

    }


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


    db.run(
        sql,
        [
            nombre,
            cliente,
            responsable,
            estado || "Activo",
            prioridad || "Media",
            valor || 0,
            descripcion || ""
        ],
        function(err) {

            if (err) {

                return res.status(500).json({
                    error: "No se pudo crear la oportunidad"
                });

            }


            res.status(201).json({

                id: this.lastID,
                mensaje: "Oportunidad creada correctamente"

            });

        }
    );

});


/*
=================================
ACTUALIZAR
PUT /api/oportunidades/:id
=================================
*/

app.put("/api/oportunidades/:id", (req, res) => {

    const id = req.params.id;


    const {
        nombre,
        cliente,
        responsable,
        estado,
        prioridad,
        valor,
        descripcion
    } = req.body;


    const sql = `
        UPDATE oportunidades
        SET
            nombre = ?,
            cliente = ?,
            responsable = ?,
            estado = ?,
            prioridad = ?,
            valor = ?,
            descripcion = ?
        WHERE id = ?
    `;


    db.run(
        sql,
        [
            nombre,
            cliente,
            responsable,
            estado,
            prioridad,
            valor,
            descripcion,
            id
        ],
        function(err) {

            if (err) {

                return res.status(500).json({
                    error: "No se pudo actualizar"
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    error: "Oportunidad no encontrada"
                });

            }


            res.json({
                mensaje: "Oportunidad actualizada correctamente"
            });

        }
    );

});


/*
=================================
DESACTIVAR
DELETE /api/oportunidades/:id
=================================
*/

app.delete("/api/oportunidades/:id", (req, res) => {

    const id = req.params.id;


    /*
       No eliminamos físicamente el registro.
       Cambiamos su estado a Cancelado.
    */

    db.run(
        `
        UPDATE oportunidades
        SET estado = 'Cancelado'
        WHERE id = ?
        `,
        [id],
        function(err) {

            if (err) {

                return res.status(500).json({
                    error: "Error al desactivar"
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    error: "Oportunidad no encontrada"
                });

            }


            res.json({

                mensaje:
                    "Oportunidad desactivada correctamente"

            });

        }
    );

});


/*
=================================
ASISTENTE IA
POST /api/ia/chat
=================================
*/

app.post("/api/ia/chat", (req, res) => {

    const { mensaje } = req.body;


    if (!mensaje) {

        return res.status(400).json({
            error: "El mensaje es obligatorio"
        });

    }


    /*
       Aquí posteriormente podemos conectar
       una API de IA real.
    */

    const texto =
        mensaje.toLowerCase();


    if (texto.includes("oportunidades")) {

        db.get(
            "SELECT COUNT(*) AS total FROM oportunidades",
            (err, row) => {

                if (err) {

                    return res.status(500).json({
                        error: "Error consultando la base de datos"
                    });

                }


                res.json({

                    respuesta:
                        `Actualmente existen ${row.total} oportunidades registradas.`

                });

            }
        );

    } else {

        res.json({

            respuesta:
                "Soy el asistente comercial. Puedo ayudarte a consultar las oportunidades del CRM."

        });

    }

});


/*
=================================
INICIAR SERVIDOR
=================================
*/

app.listen(PORT, () => {

    console.log(
        `Servidor iniciado en http://localhost:${8080}`
    );

});