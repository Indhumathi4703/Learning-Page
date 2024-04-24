const speakeasy = require("speakeasy"); // Authenticator
const qrcode = require("qrcode"); // Qrcode Generation
const dbAuth = require("../models/authSchema");  // database
const helper = require("../helper/common"); // middleware 

exports.qrGenerate = (req, res) => {
  let jwtkey = helper.jwtDecode(req.headers.authorization.split(" ")[1]);
  let useremail = jwtkey.subject.email;

  const secret = speakeasy.generateSecret();
  const secretkey = secret.base32;
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    let url = data_url;

    dbAuth
      .findOneAndUpdate(
        { email: useremail },
        { $set: { qrcode: url, secretkey: secretkey } },
        { new: true }
      )
      .then((result) => {
        return res.status(200).json({ status: true, response: secret.base32, url });
      })
      .catch((err) => {
        return res.status(500).json({ status: false, message: err });
      });
  });
};

exports.qrVerify = (req, res) => {
  const token = req.body.token;

  let jwtkey = helper.jwtDecode(req.headers.authorization.split(" ")[1]);
  let useremail = jwtkey.subject.email;
  db.admin
    .findOne({ email: useremail })
    .then((result) => {
      const verified = speakeasy.totp.verify({
        secret: result.secretkey,
        encoding: "base32",
        token: token,
      });

      if (verified) {
        res.status(200).json({ verified, status: true, message: "Verified successfully" });
      } else {
        res.status(401).json({
          verified,
          status: false,
          message: "Unauthorized user authentication"
        });
      }
    })
    .catch((err) => {

      return res.status(500).json({
        message: "Not able to find user",
        status: false,
        err: err
      });
    });
};

exports.tfastatuschecker = (req, res) => {
  try {
    let jwtkey = helper.jwtDecode(req.headers.authorization.split(" ")[1]);
    let useremail = jwtkey.subject.email;
    db.admin
      .findOne(
        { email: useremail },
        {
          email: 1,
          _id: 1,
          name: 1,
          password: 1,
          role: 1,
          tfastatus: 1,
          secretkey: 1,
          qrcode: 1,
        }
      )
      .then((result) => {
        return res.status(200).json({ message: " Verified user", status: true, data: result });
      })
      .catch((err) => {
        return res.status(400).json({ message: " Unverified user", status: false });
      });
  } catch(err){
    return res.status(500).json({ message:err.message, status: false });
  }
};

exports.updatetfastatus = (req, res) => {
    // req data = true or false 
  try {
    let status = req.body.status;
    let jwtkey = helper.jwtDecode(req.headers.authorization.split(" ")[1]);
    let useremail = jwtkey.subject.email;
    db.admin
      .findOneAndUpdate(
        { email: useremail },
        { $set: { tfastatus: status } },
        { new: true }
      )
      .then((result) => {
        return res.status(200).json({ message: " Verified user", status: true, data: result });
      })
      .catch((err) => {
        return res.status(500).json({ message: " Unverified user", status: false });
      });
  } catch(error) {
    return res.status(500).json({ status: false ,message:error.message});
  }
};
