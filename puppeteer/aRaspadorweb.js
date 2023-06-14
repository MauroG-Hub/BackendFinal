const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


(async () => {

    let results = [];

    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const response = await page.goto('https://www.google.com/search?q=libros+de+dune');
        const body = await response.text();

        const { window: {document}} = new jsdom.JSDOM(body);

        document.querySelectorAll('.g h3')
        .forEach(element => {
            console.log(element.textContent);
            results.push(element.textContent);
        });

        const resultsCSV = Array.from(document.querySelectorAll('.g h3')).map(element => {
            return {
              title: element.textContent
            };
          });

        const csvWriter = createCsvWriter({
            path: 'results2.csv',
            header: [
              { id: 'title', title: 'Title' }
            ]
          });

        await csvWriter.writeRecords(resultsCSV);
        await browser.close();
        const jsonResults = JSON.stringify(results);
        fs.writeFileSync('results2.json', jsonResults);

    }
    catch(error){
        console.error(error)
    }
}

)();