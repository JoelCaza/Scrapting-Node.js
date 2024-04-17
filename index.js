const express = require('express');
const cors = require('cors');
const scrapeData = require('./scrape');
const cedulaExtractor = require('./cedula');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/consulta-cedula', async (req, res) => {
    const { ps_identificacion } = req.body;

    const cedulaUrl = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=CED&ps_identificacion=${ps_identificacion}&ps_placa=`;

    try {
        const cedulaData = await cedulaExtractor(cedulaUrl);
        const { nombre, puntos, licenciaTipo, validezLicencia } = cedulaData;

        const responseData = {
            ps_identificacion,
            nombre,
            puntos,
            licenciaTipo,
            validezLicencia,
        };

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

app.post('/api/scrape', async (req, res) => {
    const { plateNumber } = req.body;

    const url = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=PLA&ps_identificacion=${plateNumber}&ps_placa=`;

    try {
        const scrapedData = await scrapeData(url);
        res.json(scrapedData);
    } catch (error) {
        console.error(error);

        if (error.message.includes('timeout')) {
            res.status(504).json({ error: 'Tiempo de espera agotado al realizar scraping' });
        } else {
            res.status(500).json({ error: 'Error en el proceso de scraping' });
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
