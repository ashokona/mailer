var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var emails = require("../models/Emails.js");
var MailService = require('../config/mailer');
var async = require('async');
// var Emails = mongoose.model('emails');
var isLoggedin = false;

/* GET home page. */
router.get('/', function (req, res, next) {
  if(isLoggedin){
    res.render('index', { status: '', message: "" });
  }else{
    res.render('login', { status: '', message: "" });
  }
});

router.get('/index', function (req, res, next) {
  if(isLoggedin){
    res.render('index', { status: '', message: "" });
  }else{
    res.render('login', { status: '', message: "" });
  }
});

router.post('/login', function (req, res, next) {
  console.log(req.body)
  var username = req.body.username;
  var password = req.body.password;
  if (username === 'admin' && password === 'admin') {
    isLoggedin = true;
    res.redirect('/index');
  } else {
    res.render('login', { status: 'error', message: "Enter valid username and password" })
  }
  // res.render('index', { title: 'Express' });
});

router.post('/uploadfile', function (req, res, next) {
  data = req.body.data;
  mongoose.connection.db.listCollections({ name: 'emails' })
    .next(function (err, collinfo) {
      if (collinfo) {
        emails.collection.drop()
          .then((r) => {
            insertEmails(data)
              .then((results) => {
                res.send({ status: "success", message:"Succesfully imported the file."});
              })
              .catch((error) => {
                res.send({ status: "error", message:"Failed to import the file, Try again." });
              })
          })
          .catch((e) => {
            res.send({ status: "error", message:"Failed to import the file, Try again." });
            console.log(e);
          })
      } else {
        insertEmails(data)
          .then((results) => {
            res.send({ status: "success", message:"Succesfully imported the file."});
          })
          .catch((error) => {
            res.send({ status: "error", message:"Failed to import the file, Try again." });
          })
      }
    });
});

router.post('/sendmails', function (req, res, next) {
  emails.find({}).lean(true)
    .then((results) => {
      if (results.length <= 0) {
        res.send({ status: "warning", message: "No emails found! Upload some mails to start sending" })
      } else {
        var mailData = {
          subject: req.body.data.subject,
          text: req.body.data.body
        }
        sendMails(mailData, results)
          .then((results) => {
            res.send({ status: "success", message:"Succesfully sent mails."});
          })
          .catch((error) => {
            res.send({ status: "error", message:"Failed to send eamils, Try again."});
          })
      }
    })
    .catch((error) => {
      res.send({ status: "error", message:"Failed to send eamils, Try again."});
      res.send({ stauts: "error", message: "error" })
    })
});

var insertEmails = function (data) {
  return new Promise((resolve, reject) => {
    emails.insertMany(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(result);
      })
  })
}

var sendMails = function (mailData, mails) {
  return new Promise((resolve, reject) => {
    async.mapSeries(mails, function (data, callback) {
      mailData.to = data.email;
      console.log(mailData)
      MailService(mailData)
        .then((result) => {
          callback(null, result);
        })
        .catch((err) => {
          callback(err, null);
        })
    }, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results)
      }
    });
  })
}



module.exports = router;

// var mailOptions = {
//   from: 'noreply@anydayemployment.com',
//   to: empEmail,
//   subject: 'Congrats! ' + jsFirstName + ' Has Accepted Your job offer',
//   text: ''
// };
