const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.encryption_key);

const {
  User
} = require("../model/user");
const db = require("../config/db");

const AWS = require("aws-sdk");
const ses = new AWS.SES({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: process.env.aws_region
});

router.post("/email/send/:template/:subject", (req, res) => {

  const query = User.find({}, "firstName lastName email -_id").where("isSubscribe", true);
  query.exec((err, foundData) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      for (var key in foundData) {
        var item = foundData[key];
        PostEmail(item["firstName"], item["lastName"], item["email"]);
      }

      function PostEmail(f_name, l_name, email) {
        const templateToSend = "templates/" + req.params.template + ".html";

        fs.readFile(templateToSend, (err, data) => {
          if (err) {
            console.log(
              "Error while reading template file, Please check if template exist!"
            );
          }
          var mapObj = {
            "*|NAME|*": f_name + l_name,
            "*|EMAIL|*": cryptr.encrypt(email) // --> to encrypt email for much better url redirection link
          };
          const pattern = /\*\|NAME\|\*|\*\|EMAIL\|\*/gi;
          const MessageToSend = data
            .toString()
            .replace(pattern, function (matched) {
              return mapObj[matched];
            });

          const eparam = {
            Destination: {
              ToAddresses: [email]
            },
            Message: {
              Body: {
                Html: {
                  Data: MessageToSend
                }
              },
              Subject: {
                Data: req.params.subject
              }
            },
            Source: "www.your_domain.com",
            ReplyToAddresses: ["info@your_domain.com"],
            ReturnPath: "info@your_domain.com"
          };

          ses.sendEmail(eparam, function (err, data) {
            if (err) {
              res.status(500).json({
                success: true,
                message: "Something went wrong when subcribing!",
                data: err
              });
              return;
            }
            res.status(200).json({
              success: true,
              message: "Email Successfully Sent!",
              data: data
            }, );
          });
        });
      }
    }
  });
});

router.post("/email/update-email/:old_email/:new_email", (req, res) => {

  // Verification email has to be sent because this email is also used for login, unless we create a new database for mail records

  const query = User.findOneAndUpdate({
    email: cryptr.decrypt(req.params.old_email)
  }, {
    $set: {
      email: cryptr.decrypt(req.params.new_email)
    }
  }, {
    new: true
  });

  query.exec((err, doc) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong when updating data!",
        data: err
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Email Successfully Sent",
      data: doc
    });
  });
});

router.post("/email/subscribe/:email", (req, res) => {
  const query = User.findOneAndUpdate({
    email: cryptr.decrypt(req.params.email)
  }, {
    $set: {
      isSubscribe: true
    }
  }, {
    new: true
  });

  query.exec((err, doc) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong when subcribing!",
        data: err
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Email Successfully Sent",
      data: doc
    });
  });
});

router.post("/email/unsubscribe/:email", (req, res) => {
  const query = User.findOneAndUpdate({
    email: cryptr.decrypt(req.params.email)
  }, {
    $set: {
      isSubscribe: false
    }
  }, {
    new: true
  });

  query.exec((err, doc) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong when unsubcribing!",
        data: err
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Email Successfully Sent",
      data: doc
    });
  });
});

module.exports = router;