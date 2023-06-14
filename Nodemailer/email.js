const nodemailer = require("nodemailer");

let trasporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8bb3b71f02e6be",
    pass: "26704a707ed5bb",
  },
});

let message = {
    from: 'deejemplo@example.com',
    to: 'paraejemplo@example.com',
    subject: 'Tecmilenio Avance 1',
    text: 'Mauro Garcia'
  };

  trasporter.sendMail(message, function(error, info){
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });