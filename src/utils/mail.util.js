import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { config } from "../config/env.js";
import { ApiError } from "./apiError.util.js";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "bookbazaar",
      link: "https://bookbazaar.com/",
    },
  });

  const emailHtml = mailGenerator.generate(options.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: config.MAILTRAP_HOST,
    port: config.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: config.MAILTRAP_USER,
      pass: config.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.MAILTRAP_SENDEREMAIL,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const orderConfirmationMailContent = (username, orderDetailsURL) => {
  return {
    body: {
      name: username,
      intro: "Thank you for your order!",
      action: {
        instructions: "To view your order, click the button below:",
        button: {
          color: "#22BC66",
          text: "View Order",
          link: orderDetailsURL,
        },
      },
      outro:
        "If you have any questions, reply to this email—we're always happy to help.",
    },
  };
};

export { sendMail, orderConfirmationMailContent };
