const db = require("./database");
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/*
=========================================
CONSULTAR TODAS LAS OPORTUNIDADES
=========================================
*/

function obtenerOportunidades() {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT *
            FROM oportunidades
            ORDER BY id DESC
            `,
            [],
            (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);

            }
        );

    });

}


/*
=========================================
VALOR TOTAL DEL PIPELINE
=========================================
*/

function obtenerValorPipeline() {

    return new Promise((resolve, reject) => {

        db.get(
            `
            SELECT
                COALESCE(SUM(valor), 0) AS total
            FROM oportunidades
            WHERE estado != 'Cancelado'
            `,
            [],
            (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(row.total);

            }
        );

    });

}


/*
=========================================
OPORTUNIDADES POR PRIORIDAD
=========================================
*/

function obtenerPorPrioridad(prioridad) {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT *
            FROM oportunidades
            WHERE prioridad = ?
            AND estado != 'Cancelado'
            `,
            [prioridad],
            (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);

            }
        );

    });

}


/*
=========================================
OPORTUNIDADES POR ESTADO
=========================================
*/

function obtenerPorEstado(estado) {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT *
            FROM oportunidades
            WHERE estado = ?
            `,
            [estado],
            (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);

            }
        );

    });

}


/*
=========================================
FUNCIÓN PRINCIPAL DEL ASISTENTE
=========================================
*/

async function responder(mensaje) {

    const oportunidades =
        await obtenerOportunidades();

    const valorPipeline =
        await obtenerValorPipeline();


    /*
    El modelo recibe únicamente información
    proveniente de la base de datos.
    */

    const contextoCRM = {

        oportunidades,

        valorPipeline,

        totalOportunidades:
            oportunidades.length

    };


    const systemPrompt = `
Eres un asistente comercial de un CRM.

REGLAS IMPORTANTES:

1. Solo puedes utilizar información contenida
   en los datos proporcionados del CRM.

2. No inventes oportunidades, clientes,
   responsables, valores ni estados.

3. Si la información solicitada no existe
   en los datos, debes decirlo claramente.

4. Explica brevemente de dónde obtuviste
   la información.

5. Si la pregunta no está relacionada con
   el CRM, responde:

   "Solo puedo ayudarte con información
   relacionada con el CRM y sus oportunidades."

6. Cuando recomiendes acciones comerciales,
   basa las recomendaciones únicamente
   en las oportunidades existentes.

DATOS ACTUALES DEL CRM:

${JSON.stringify(contextoCRM, null, 2)}
`;


    const response = await client.responses.create({

        model: "gpt-5.6-luna",

        instructions: systemPrompt,

        input: mensaje

    });


    return response.output_text;

}


module.exports = {
    responder
};