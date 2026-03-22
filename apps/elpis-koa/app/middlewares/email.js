module.exports = app => {
  const nodemailer = require("nodemailer");
  const { email: emailConfig } = app.config;
  const email = nodemailer.createTransport(emailConfig);
  app.email = email;
  console.info(`-- [init] load email done --`);
};
