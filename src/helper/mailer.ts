import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: String(process.env.SMTP_HOST),
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: String(process.env.SMTP_USERNAME),
    pass: String(process.env.SMTP_PASSWORD),
  },
});

const mailer = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"LifeBlud" ${process.env.SMTP_SENDER}`,
    to,
    subject,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  console.info(`Message sent to ${to} with message ID: ${info.messageId}`);
};

export default mailer;
