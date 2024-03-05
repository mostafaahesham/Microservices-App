const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST_MAIL,
      port: process.env.PORT_MAIL,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });
    const message = {
      from: process.env.FROM_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };
    await transport.sendMail(message);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};
