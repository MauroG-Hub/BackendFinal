const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static("express"));

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8bb3b71f02e6be",
    pass: "26704a707ed5bb",
  },
});

// Función para enviar correo electrónico
const sendEmail = () => {
  const message = {
    from: 'deejemplo@example.com',
    to: 'paraejemplo@example.com',
    subject: 'Tecmilenio Avance 1',
    text: 'Mauro Garcia'
  };

  transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });
};

// Función para generar un código QR
const generateQRCode = async text => {
  try {
    const qr = await QRCode.toString(text, { type: 'terminal' });
    console.log(qr);
  } catch (err) {
    console.log(err)
  }
};

// Función para obtener resultados de búsqueda y guardar en CSV y JSON
const scrapeSearchResults = async () => {
  let results = [];

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const response = await page.goto('https://www.google.com/search?q=libros+de+dune');
    const body = await response.text();

    const { window: { document } } = new jsdom.JSDOM(body);

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

  } catch (error) {
    console.error(error)
  }
};

// Enviar correo electrónico y generar código QR al iniciar el servidor
sendEmail();
generateQRCode('Mauro Garcia');
scrapeSearchResults();

// Configuración y arranque del servidor
app.use('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/express/index.html'));
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
