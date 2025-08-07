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
        /*bcc: process.env.EMAIL_BCC || undefined, */
        subject: 'Restablece tu contraseña',
        html: htmlBody
    };

    return transporter.sendMail(mailOptions);
};

exports.sendNewUserNotificationEmail = async (newUser) => {
    const htmlBody = `
        <h3>Nuevo usuario pendiente de aprobación</h3>
        <p><strong>Nombre de usuario:</strong> ${newUser.username}</p>
        <p><strong>Email:</strong> ${newUser.email}</p>
        <p>Accede al panel de administración para aprobar o rechazar el registro.</p>
    `;

    const mailOptions = {
        from: `"Notificaciones App" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_BCC,
        subject: 'Nuevo usuario registrado',
        html: htmlBody,
    };

    return transporter.sendMail(mailOptions);
};

exports.sendUserApprovedEmail = async (to) => {
    const htmlBody = `
        <p>¡Tu cuenta ha sido aprobada!</p>
        <p>Ya puedes iniciar sesión en la aplicación.</p>
        <p>Gracias por tu paciencia.</p>
    `;

    const mailOptions = {
        from: `"Soporte App" <${process.env.EMAIL_USER}>`,
        to,
        /*bcc: process.env.EMAIL_BCC || undefined, */
        subject: 'Cuenta aprobada',
        html: htmlBody
    };

    return transporter.sendMail(mailOptions);
};

exports.sendUserRejectedEmail = async (to) => {
    const htmlBody = `
        <p>¡Tu cuenta ha sido cancelada!</p>
        <p>Si crees que se trata de algún error, contacta con un administrador por los canales facilitados.</p>
        <p>Disculpa las molestias.</p>
    `;

    const mailOptions = {
        from: `"Soporte App" <${process.env.EMAIL_USER}>`,
        to,
        /*bcc: process.env.EMAIL_BCC || undefined, */
        subject: 'Cuenta CANCELADA',
        html: htmlBody
    };

    return transporter.sendMail(mailOptions);
};
