const puppeteer = require('puppeteer');

async function extractData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
        const getTextContent = (element, selector) => {
            const selectedElement = element.querySelector(selector);
            return selectedElement ? selectedElement.textContent.trim() : '';
        };

        const findElementByTitle = (elements, title) => {
            const element = Array.from(elements).find(element => element.textContent.trim() === title);
            const sibling = element ? element.nextElementSibling : null;

            // Si el título exacto no se encuentra, probamos con una búsqueda parcial
            if (!sibling) {
                const partialElement = Array.from(elements).find(element => element.textContent.includes(title));
                return partialElement ? partialElement.nextElementSibling?.textContent.trim() : null;
            }

            return sibling?.textContent.trim();
        };

        return {
            plateNumber: getTextContent(document, 'td.titulo2 strong'),
            Marca: findElementByTitle(document.querySelectorAll('td.titulo'), 'Marca:'),
            Color: findElementByTitle(document.querySelectorAll('td.titulo'), 'Color:'),
            AnioMatricula: findElementByTitle(document.querySelectorAll('td.titulo'), 'Año de Matrícula'),
            Modelo: findElementByTitle(document.querySelectorAll('td.titulo'), 'Modelo:'),
            Clase: findElementByTitle(document.querySelectorAll('td.titulo'), 'Clase:'),
            FechaMatricula: findElementByTitle(document.querySelectorAll('td.titulo'), 'Fecha de Matrícula:'),
            Anio: findElementByTitle(document.querySelectorAll('td.titulo'), 'Año:'),
            Servicio: findElementByTitle(document.querySelectorAll('td.titulo'), 'Servicio:'),
            FechaCaducidad: findElementByTitle(document.querySelectorAll('td.titulo'), 'Fecha de Caducidad:'),
            Polarizado: findElementByTitle(document.querySelectorAll('td.titulo'), 'Polarizado:'),
            FechaCaducidadPolarizado: findElementByTitle(document.querySelectorAll('td.titulo'), 'Fecha Caducidad:'),
        };
    });

    await browser.close();

    return data;
}

module.exports = extractData;
