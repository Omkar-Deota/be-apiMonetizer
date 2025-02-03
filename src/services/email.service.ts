// import sgMail from '@sendgrid/mail';
// import log from '../utils/logger';

// class EmailService {
//     constructor() {
//         sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
//     }

//     private readonly templates = {
//         ADMIN_APPROVED: 'd-your-admin-approved-template-id',  // Replace with actual template ID
//         ADMIN_REJECTED: 'd-your-admin-rejected-template-id'   // Replace with actual template ID
//     };

//     async sendAdminApprovalEmail(userEmail: string, firstName: string) {
//         try {
//             const msg = {
//                 to: userEmail,
//                 from: process.env.SENDGRID_FROM_EMAIL || '',
//                 templateId: this.templates.ADMIN_APPROVED,
//                 dynamicTemplateData: {
//                     firstName: firstName,
//                     loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
//                 }
//             };

//             // await sgMail.send(msg);
//             log.info(`Admin approval email sent to ${userEmail}`);
//         } catch (error) {
//             log.error('Error sending admin approval email:', error);
//             throw error;
//         }
//     }

//     async sendAdminRejectionEmail(userEmail: string, firstName: string) {
//         try {
//             const msg = {
//                 to: userEmail,
//                 from: process.env.SENDGRID_FROM_EMAIL || '',
//                 templateId: this.templates.ADMIN_REJECTED,
//                 dynamicTemplateData: {
//                     firstName: firstName,
//                     supportEmail: process.env.SUPPORT_EMAIL || 'support@propstream.com'
//                 }
//             };

//             // await sgMail.send(msg);
//             log.info(`Admin rejection email sent to ${userEmail}`);
//         } catch (error) {
//             log.error('Error sending admin rejection email:', error);
//             throw error;
//         }
//     }
// }

// export default new EmailService();


// // <h1>Welcome to PropStream!</h1>
// // <p>Hi {{firstName}},</p>
// // <p>Your account has been approved by our admin team. You can now log in and start using PropStream.</p>
// // <p><a href="{{loginUrl}}">Click here to login</a></p>

// // <h1>PropStream Account Update</h1>
// // <p>Hi {{firstName}},</p>
// // <p>We regret to inform you that your account registration has been rejected by our admin team.</p>
// // <p>If you believe this is a mistake or need more information, please contact our support team at {{supportEmail}}.</p>