import nodemailer from 'nodemailer';

export class EmailService {
    public transporter: nodemailer.Transporter | null = null;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        this.transporter.verify((error, success) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Server is ready to take messages');
            }
        })
    }

    async sendEmail(payload: nodemailer.SendMailOptions) {
        return this.transporter!.sendMail(payload);
    }
}