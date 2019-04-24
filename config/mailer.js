const nodemailer = require('nodemailer');
const Promise = require('bluebird');
var xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');
// const config = require('./config');

var MailService = function(data) {
    return new Promise(function(resolve, reject) {
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
              user: 'email',
              pass: 'password'
            }
          }));
                // let transporter = nodemailer.createTransport("SMTP",{
        //     service: "Gmail",
        //     auth: {
        //         user: "slvrsmiles@gmail.com",
        //         pass: "9030822245"
        //     }
        // });
        // let transporter = nodemailer.createTransport({
        //     service: 'Gmail', 
        //     auth: {
        //       xoauth2: xoauth2.createXOAuth2Generator({
        //           user: 'ashokona@gmail.com',
        //           clientId: '462311462909-2h4eppla0co811a4dgl4vmtukk7l2a68.apps.googleusercontent.com',
        //           clientSecret: 'v868RPCi0-gu6ownJ2vBCYQI',
        //           refreshToken: '{refresh-token}',
        //           accessToken: '{cached access token}'
        //       })
        //     }
        // });
        let mailOptions = {
            from: 'slvrsmiles@gmail.com',
            to: data.to,
            subject: data.subject,
            text: data.text
            // html: data.html
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({
                    success: false,
                    error: error,
                    data: null
                });
            }
            resolve({
                success: true,
                error: null,
                data: info
            });
        });
    });

}

module.exports = MailService;
