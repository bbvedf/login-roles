const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendPasswordResetEmail = async (to, resetLink) => {
    const htmlBody = `
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente <a href="${resetLink}">enlace</a> para continuar:</p>
        <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>
    `;

    const mailOptions = {
        from: `"Soporte App" <${process.env.EMAIL_USER}>`,
        to: to,         
        subject: 'Restablece tu contraseña',
        html: htmlBody
    };

    return transporter.sendMail(mailOptions);
};
