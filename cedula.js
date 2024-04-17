const puppeteer = require('puppeteer');

async function extractCedulaData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const data = await page.evaluate(() => {
        try {
            const getTextContent = (element, selector) => {
                const selectedElement = element.querySelector(selector);
                return selectedElement ? selectedElement.textContent.trim() : '';
            };

            const marcoTituloElement = document.querySelector('.MarcoTitulo');
            const ps_identificacion = marcoTituloElement ? marcoTituloElement.textContent.trim() : '';

            console.log('ps_identificacion:', ps_identificacion);

            const nombre = getTextContent(document, '.titulo1');

            // Obtener puntos del enlace de consulta_puntos
            const puntosElement = document.querySelector('td.titulo1 + td + td');
            const puntos = puntosElement ? puntosElement.textContent.trim() : '';
            console.log('puntos:', puntos);

            // Obtener el tipo de licencia directamente de la cadena
            const tipoLicenciaMatch = ps_identificacion.match(/LICENCIA TIPO:\s*([^/]+)/);
            const licenciaTipo = tipoLicenciaMatch ? tipoLicenciaMatch[1].trim() : '';

            console.log('licenciaTipo:', licenciaTipo);

            // Obtener la validezLicencia del texto que contiene "VALIDEZ:"
            const validezMatch = ps_identificacion.match(/VALIDEZ:\s*([^/]+)/);
            const validezLicencia = validezMatch ? validezMatch[1].trim() : '';

            console.log('validezLicencia:', validezLicencia);

            return {
                ps_identificacion,
                nombre,
                puntos,
                licenciaTipo,
                validezLicencia,
            };
        } catch (error) {
            console.error('Error en evaluate:', error);
            return {}; // Devuelve un objeto vacío en caso de error
        }
    });

    await browser.close();

    return data;
}

module.exports = extractCedulaData;
