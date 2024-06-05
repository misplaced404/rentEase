/* eslint-disable max-len */
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Configure the email transport
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendEmailOnFirestoreChange = functions.firestore
    .document("/path/to/document")
    .onWrite((change, context) => {
    // Get an object representing the document
      const newValue = change.after.data();

      // access a particular field as you would any JS property
      const recipentEmail = newValue.email;

      const mailOptions = {
        from: "Your Company <noreply@yourcompany.com>",
        to: recipentEmail,
      };

      // Building Email message.
      mailOptions.subject = "A change occurred in Firestore!";
      mailOptions.text = "This is an automated email to let you know that a change occurred in Firestore.";
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log("Email sent to:", recipentEmail);
      });
    });
