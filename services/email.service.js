const nodemailer = require('nodemailer');
require('dotenv').config();
const { User } = require('../models/users');

// Nodemailer configuration
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const registerEmail = async (userEmail, user, password) => {
    try {
        const emailBody = `<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 29px;
            padding: 0;
            background-color: #f2faff;
        }
        
    </style>
</head>

<body>
    <div class="container">
        <table align="center" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td class="content">
                    <div class="content">
            <p>Hello <strong> ${userEmail}</strong>,</p>
            <p>To get started, here are your login credentials:</p>
            <div class="credentials">
                <p><strong>Username:</strong> ${userEmail}</p>
                <p><strong>Password:</strong> ${password}</p>
            
            </div>
        
        </div>
        <div class="footer">
            <p>Thank you for choosing <strong>codewithdeepak</strong>!</p>
            <p>Best regards,<br>The codewithdeepak Team</p>
            <p>&copy; ${new Date().getFullYear()} codewithdeepak. All rights reserved.</p>
        </div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>`;
        // Email message options
        let message = {
            from: `"Start Learning with codewithdeepak – Your Learning Partner" <no-reply@example.com>`, // Display this as the sender
            to: userEmail,
            subject: 'Welcome to codewithdeepak!',
            html: emailBody,
            replyTo: process.env.EMAIL, // Optional: if you want replies to go to your actual email
        }

        // Send the email
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        throw error;
    }
};

const forgetPasswordEmail = async (userEmail, user, token) => {
    try {
        // Custom HTML email template
        const emailBody = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 29px;
            padding: 0;
            background-color: #f2faff;
        }
    </style>
</head>
<body>
    <div class="container">
        <table align="center" cellspacing="0" cellpadding="0" border="0" width="100%">

            <td class="content">
                <div class="content">
                    <h1>Reset Your Password</h1>
                    <p>Dear ${userEmail},</p>
                    <p>We received a request to reset your password for your account at The codewithdeepak.</p>
                    <p>To reset your password, please click the button below:</p>
                    <a href="${process.env.CLIENT_URL_RESET_PASSWORD}?token=${token}" class="button">Reset Password</a>
                    <p class="note">
                        If the button above does not work, please copy and paste the following link into your browser:
                        <br>
                        <a href="${process.env.CLIENT_URL_RESET_PASSWORD}?token=${token}" style="color: #FF6347;">${process.env.CLIENT_URL_RESET_PASSWORD}?token=${token}</a>
                    </p>
                    <p>If you did not request a password reset, you can ignore this email. Your password will remain unchanged.</p>
                    <p>Best Regards,<br>The codewithdeepak Team</p>
                </div>
                <div class="footer">
                    <p>Thank you for choosing <strong>codewithdeepak</strong>!</p>
                    <p>Best regards,<br>The codewithdeepak Team</p>
                </div>
            </td>
            </tr>
        </table>
  
    </div>
</body>
</html>`;

        // Email message options
        let message = {
            from: `"Reset Your codewithdeepak – Credentials" <no-reply@example.com>`, // Display this as the sender
            to: userEmail,
            subject: 'Welcome to codewithdeepak!',
            html: emailBody,
            replyTo: process.env.EMAIL, // Optional: if you want replies to go to your actual email
        };


        // Send the email
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        throw error;
    }
};

const resetPasswordEmail = async (userEmail) => {
    try {
        // Custom HTML email template
        const emailBody = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f2faff;
        }
    </style>
</head>
<body>
    <div class="container">
        <table align="center" cellspacing="0" cellpadding="0" border="0" width="100%">
            <td class="content">
                <div class="header">
                    <h1>Password Reset Successful</h1>
                    <p>Dear ${userEmail},</p>
                </div>

                <div class="content">
                    <p>We are happy to inform you that your password has been successfully reset.</p>
                    <p>You're one step closer to securing your account and achieving your goals. Always remember, security is key, and we're here to help you every step of the way!</p>

                    <p>If you ever forget your password again, simply follow the same steps, and we'll be here to assist you in no time!</p>

                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Best Regards,<br>The codewithdeepak Team</p>
                </div>

            </td>
        </table>
    </div>
</body>
</html>
`;

        // Email message options
        let message = {
            from: `"Password Reset Successfully" <no-reply@example.com>`, // Display this as the sender
            to: userEmail,
            subject: 'Welcome to codewithdeepak!',
            html: emailBody,
            replyTo: process.env.EMAIL, // Optional: if you want replies to go to your actual email
        };


        // Send the email
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        throw error;
    }
}

const acknowledgeEmail = async (userEmail, user) => {
    try {
        // Get user data
        console.log(user);

        // Custom HTML email template
        const emailBody = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 29px;
            padding: 0;
            background-color: #f2faff;
        }
        .login-btn {
            background: linear-gradient(90deg, rgba(66, 133, 244, 0.79) 0%, rgba(66, 133, 244, 0.79) 100%);
            background-color: rgba(31, 186, 150, 0.79);
            padding: 10px;
            color: white !important;
            text-decoration: none;
            border-radius: 2px;
        }
        .login-btn:hover {
            transform: scale(1.05);
            background-color: rgba(31, 186, 150, 0.9);
            color: white !important;
        }
        .credentials {
            background-color: #F8FDFF;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            font-size: 16px;
        }
        .container {
            max-width: 700px;
            margin: auto;
            border-radius: 18px;
        }
        .header_main_img {
            text-align: center;
            padding: 30px;
        }
        .header {
            background: linear-gradient(90deg, rgba(66, 133, 244, 0.79) 0%, rgba(66, 133, 244, 0.79) 100%);
            background-color: rgba(31, 186, 150, 0.79);
            padding: 25px;
            border-radius: 0px 0px 0 0;
            color: #fff;
        }
        .header_text {
            text-align: left;
        }
        .header_text h1,
        .header_text p {
            margin: 0;
        }
        .header_img {
            text-align: right;
        }
        .content {
            padding: 20px;
            text-align: left;
            background-color: #fff;
            border-radius: 0 0 0 0;
            border: 1px solid rgba(17, 140, 109, 0.16);
        }
        .footer {
            padding: 20px;
            font-size: 12px;
            text-align: center;
            color: #777;
        }
        .footer_border_wrap {
            border-bottom: 1px solid #F6F5F4;
            margin: 20px 0;
        }
        .footer_text_copyright {
            color: #111;
            font-weight: 400;
        }
        .footer_social_icon {
            display: inline-block;
        }
        a {
            color: #7E7E7E;
        }
        p {
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
        }
        .list li {
            margin-bottom: 8px;
        }
        .list li h4,
        .list li p {
            margin: 0;
        }
        .button {
            text-decoration: none;
            background: linear-gradient(90deg, rgba(66, 133, 244, 0.79) 0%, rgba(66, 133, 244, 0.79) 100%);
            background-color: rgba(31, 186, 150, 0.79);
            padding: 10px;
            color: white !important;
            border-radius: 4px;
        }
        .button:hover {
            color: rgba(31, 186, 150) !important;
            border: 2px solid rgba(31, 186, 150);
            background: white;
        }
        @media screen and (max-width: 630px) {
            .container {
                max-width: 100% !important;
                width: 100% !important;
            }
            .header,
            .content {
                padding: 10px;
            }
            .header_img img {
                height: 60px;
                margin-left: 10px;
            }
            .list li h4 {
                font-size: 16px;
            }
            .header_text h1 {
                font-size: 20px;
            }
            p {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table align="center" cellspacing="0" cellpadding="0" border="0" width="100%">
     <td class="header">
                    <table style="width: 100%;" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td class="header_text">
                               <h1>Welcome!</h1>
                               <p>We’re thrilled to have you on board and excited to start this journey together!</p>
                            </td>
                            <td class="header_img">
                                 <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="103.000000pt" height="56.000000pt" viewBox="0 0 103.000000 56.000000" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0.000000,56.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none"> <!-- Changed fill color to blue -->
    <path d="M442 542 c-55 -20 -114 -69 -145 -122 -14 -24 -15 -30 -4 -30 7 0 20 12 28 26 23 43 95 100 144 114 99 28 195 -8 260 -97 36 -50 64 -59 41 -14 -58 111 -203 166 -324 123z"/>
    <path d="M620 390 c-22 -21 -37 -29 -51 -25 -10 4 -19 11 -19 17 0 6 -7 5 -16 -3 -14 -11 -18 -11 -29 4 -9 12 -15 14 -20 7 -3 -6 -16 -9 -28 -8 -40 5 -24 -17 27 -37 27 -11 51 -25 53 -31 7 -20 -45 -64 -76 -64 -39 0 -47 -14 -15 -28 13 -7 29 -24 35 -39 12 -32 29 -16 22 22 -4 16 4 32 28 54 39 38 48 32 74 -47 16 -50 43 -65 31 -17 -3 13 -2 27 4 30 5 3 10 11 10 16 0 6 -5 7 -10 4 -6 -3 -13 2 -17 11 -4 10 -2 19 5 22 7 2 12 8 12 13 0 6 -4 8 -9 5 -19 -12 -18 44 1 61 27 25 40 50 29 58 -6 3 -24 -8 -41 -25z"/>
    <path d="M25 320 c-8 -13 13 -40 31 -40 8 0 14 -5 14 -11 0 -7 -10 -9 -27 -5 -26 6 -27 5 -9 -8 14 -11 24 -12 37 -5 26 13 24 27 -6 41 -13 6 -22 15 -19 20 3 5 12 4 20 -3 16 -13 30 -6 19 10 -8 14 -52 14 -60 1z"/>
    <path d="M107 290 c-9 -23 -11 -42 -6 -46 5 -3 9 0 9 5 0 15 33 14 48 -1 15 -15 15 -6 0 43 -14 50 -31 49 -51 -1z"/>
    <path d="M186 293 c22 -54 30 -58 42 -26 5 15 13 36 17 46 4 10 3 17 -4 17 -6 0 -15 -15 -20 -32 l-9 -33 -7 33 c-4 17 -13 32 -21 32 -10 0 -10 -7 2 -37z"/>
    <path d="M260 290 c0 -31 4 -40 18 -41 68 -5 72 -5 72 13 0 10 7 18 15 18 8 0 15 -6 15 -14 0 -8 4 -18 10 -21 6 -4 9 11 7 37 -2 40 -4 43 -32 46 -28 3 -30 1 -30 -30 0 -29 -4 -33 -27 -36 -16 -2 -28 1 -28 7 0 6 9 11 20 11 11 0 20 5 20 10 0 6 -9 10 -20 10 -27 0 -25 18 3 23 16 3 13 5 -10 6 -32 1 -33 0 -33 -39z"/>
    <path d="M690 284 c0 -27 4 -43 10 -39 6 3 10 13 10 21 0 8 7 14 15 14 8 0 15 5 15 10 0 6 -7 10 -15 10 -8 0 -15 4 -15 9 0 5 9 7 20 4 11 -3 20 0 20 6 0 6 -13 11 -30 11 -29 0 -30 -2 -30 -46z"/>
    <path d="M772 291 c-16 -51 -15 -53 7 -39 15 9 23 9 35 -1 19 -16 20 -10 4 40 -6 22 -16 39 -23 39 -7 0 -17 -17 -23 -39z"/>
    <path d="M840 284 c0 -27 4 -43 10 -39 6 3 10 13 10 21 0 8 7 14 15 14 8 0 15 -6 15 -14 0 -8 4 -17 9 -20 5 -4 9 14 9 39 0 45 0 45 -34 45 -34 0 -34 0 -34 -46z"/>
    <path d="M928 290 c4 -42 33 -63 55 -41 8 8 4 11 -16 11 -15 0 -27 5 -27 10 0 6 9 10 20 10 11 0 20 5 20 10 0 6 -9 10 -20 10 -11 0 -20 5 -20 11 0 6 8 8 19 4 11 -3 22 -1 26 5 4 6 -7 10 -27 10 -33 0 -33 -1 -30 -40z"/>
    <path d="M290 169 c22 -39 84 -100 124 -122 58 -30 174 -30 231 0 69 37 160 143 122 143 -8 0 -20 -12 -28 -26 -35 -67 -132 -124 -209 -124 -78 0 -171 55 -206 121 -8 16 -21 29 -30 29 -12 0 -13 -4 -4 -21z"/>
  </g>
</svg>
                            </td>
                        </tr>
                    </table>
                </td>   
            <td class="content">
               <div class="content">
                    <h1>Your Query Has Been Received</h1>
                    <p>Dear ${user.firstname} ${user.lastname},</p>
                    <p>Thank you for reaching out to us at The codewithdeepak. We have received your query and our team is reviewing it.</p>
                    <p>Our team will connect with you as soon as possible to assist you further. We appreciate your patience and assure you of our best attention.</p>
                    <p>If you have any additional details to share, please feel free to reply to this email.</p>
                    <p>Best Regards,<br>The codewithdeepak Support Team</p>
                </div>
                <div class="footer">
                    <p>Thank you for choosing <strong>codewithdeepak</strong>!</p>
                    <p>Best regards,<br>The codewithdeepak Team</p>
                    <p>
                        <a href="[Company Website]">[Company Website]</a> |
                        <a href="[Privacy Policy Link]">Privacy Policy</a>
                    </p>
                </div>
            </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
        // Email message options
        let message = {
            from: `"Your codewithdeepak Journey Start From Here" <no-reply@example.com>`, // Display this as the sender
            to: userEmail,
            subject: 'Welcome to codewithdeepak!',
            html: emailBody,
            replyTo: process.env.EMAIL, // Optional: if you want replies to go to your actual email
        };
        // Send the email
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    registerEmail,
    forgetPasswordEmail,
    resetPasswordEmail,
    acknowledgeEmail
};
