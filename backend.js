const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const archivo = "./data/oportunidades.json";

/* =========================
   FUNCIONES AUXILIARES
========================= */

function obtenerOportunidades() {
    try {
        return JSON.parse(fs.readFileSync(archivo, "utf8"));
    } catch (error) {
        return [];
    }
}

function guardarOportunidades(oportunidades) {
    fs.writeFileSync(
        archivo,
        JSON.stringify(oportunidades, null, 2)
    );
}


/* =========================
   GET - LISTAR
========================= */

app.get("/api/oportunidades", (req, res) => {

    const oportunidades = obtenerOportunidades();

    const {
        estado,
        responsable,
        prioridad
    } = req.query;

    let resultado = oportunidades;

    if (estado) {
        resultado = resultado.filter(
            o => o.estado === estado
        );
    }

    if (responsable) {
        resultado = resultado.filter(
            o => o.responsable === responsable
        );
    }

    if (prioridad) {
        resultado = resultado.filter(
            o => o.prioridad === prioridad
        );
    }

    res.json(resultado);
});


/* =========================
   GET - POR ID
========================= */

app.get("/api/oportunidades/:id", (req, res) => {

    const oportunidades = obtenerOportunidades();

    const id = parseInt(req.params.id);

    const oportunidad =
        oportunidades.find(o => o.id === id);

    if (!oportunidad) {

        return res.status(404).json({
            error: "Oportunidad no encontrada"
        });

    }

    res.json(oportunidad);
});


/* =========================
   POST - CREAR
========================= */

app.post("/api/oportunidades", (req, res) => {

    const oportunidades = obtenerOportunidades();

    const {
        nombre,
        cliente,
        responsable,
        estado,
        prioridad,
        valor,
        descripcion
    } = req.body;


    if (!nombre || !cliente) {

        return res.status(400).json({
            error: "Nombre y cliente son obligatorios"
        });

    }


    const nuevoId =
        oportunidades.length > 0
        ? Math.max(...oportunidades.map(o => o.id)) + 1
        : 1;


    const nuevaOportunidad = {

        id: nuevoId,
        nombre,
        cliente,
        responsable,
        estado: estado || "Activo",
        prioridad: prioridad || "Media",
        valor: valor || 0,
        descripcion: descripcion || ""

    };


    oportunidades.push(nuevaOportunidad);

    guardarOportunidades(oportunidades);


    res.status(201).json(
        nuevaOportunidad
    );

});


/* =========================
   PUT - ACTUALIZAR
========================= */

app.put("/api/oportunidades/:id", (req, res) => {

    const oportunidades = obtenerOportunidades();

    const id = parseInt(req.params.id);

    const indice =
        oportunidades.findIndex(
            o => o.id === id
        );


    if (indice === -1) {

        return res.status(404).json({
            error: "Oportunidad no encontrada"
        });

    }


    oportunidades[indice] = {

        ...oportunidades[indice],
        ...req.body,
        id

    };


    guardarOportunidades(oportunidades);


    res.json(
        oportunidades[indice]
    );

});


/* =========================
   DELETE - DESACTIVAR
========================= */

app.delete("/api/oportunidades/:id", (req, res) => {

    const oportunidades = obtenerOportunidades();

    const id = parseInt(req.params.id);

    const indice =
        oportunidades.findIndex(
            o => o.id === id
        );


    if (indice === -1) {

        return res.status(404).json({
            error: "Oportunidad no encontrada"
        });

    }


    /*
        En lugar de borrar físicamente
        el registro, lo desactivamos.
    */

    oportunidades[indice].estado = "Cancelado";

    guardarOportunidades(oportunidades);


    res.json({

        mensaje: "Oportunidad desactivada",
        oportunidad: oportunidades[indice]

    });

});


/* =========================
   POST - ASISTENTE IA
========================= */

app.post("/api/ia/chat", async (req, res) => {

    const { mensaje } = req.body;


    if (!mensaje) {

        return res.status(400).json({
            error: "El mensaje es obligatorio"
        });

    }


    /*
       Aquí posteriormente podemos conectar
       OpenAI, Gemini u otro proveedor de IA.

       Por ahora utilizamos una respuesta
       simulada.
    */

    const texto =
        mensaje.toLowerCase();

    let respuesta;


    if (texto.includes("oportunidades")) {

        const oportunidades =
            obtenerOportunidades();

        respuesta =
            `Actualmente existen ${oportunidades.length} oportunidades registradas.`;

    } else {

        respuesta =
            "Soy el asistente comercial. Puedo ayudarte a consultar las oportunidades del CRM.";

    }


    res.json({

        respuesta

    });

});


/* =========================
   SERVIDOR
========================= */

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:$3000`
    );

});