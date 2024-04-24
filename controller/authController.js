const keyfile = require('../config/keyfile')
const AWS = require('aws-sdk')
const dbAuth = require("../models/authSchema")
const common = require('../helper/common')
const qr = require('qrcode')
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if the user already exists
    const existingUser = await dbAuth.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = await dbAuth.create({ name, email, password: hashedPassword, phone });

    console.log('New user registered:', newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await dbAuth.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: false, msg: "Incorrect password" });
    }
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }
    const token = common.Authentication(data)
    console.log('token: ', token);
    res.status(200).json({ status: true, msg: "Login successful" });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

exports.imageUpload = async (req, res) => {
  let decode = common.jwtDecode(req.headers.authorization.split(" ")[1]);
  const userId = decode.subject._id
  const { file } = req
  const { dataUrl } = req.body
  try {
    if (dataUrl) {
      dbAuth.findByIdAndUpdate(userId, {
        $set: {
          url: dataUrl,
          datatype: "Text"
        }
      }, { new: true }).then((result) => {
        res.json("upload")
      }).catch((err) => {
        res.json('failed')
      })
    }
    else {
      AWS.config.update({
        accessKeyId: keyfile.AWS_ACCESS_KEY_ID,
        secretAccessKey: keyfile.AWS_SECRET_ACCESS_KEY,
      })

      const s3 = new AWS.S3();
      const params = {
        Bucket: keyfile.S3_BUCKET,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype, // Specify the content type for the file
        ContentDisposition: "inline", // Set to 'inline' to ensure it displays in the browser
      };

      s3.upload(params, (error, data) => {
        if (error) {
          res.status(500).json(error);
        }
        dbAuth.findByIdAndUpdate(userId, {
          $set: {
            url: data.Location,
            datatype: data.Key
          }
        }, { new: true }).then((result) => {
          res.json("upload")
        }).catch((err) => {
          res.json('failed')
        })
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.qrCode = async (req, res) => {

  let decode = common.jwtDecode(req.headers.authorization.split(" ")[1]);
  const userId = decode.subject._id
  try {
    const data = await dbAuth.findById(userId)
    const dataUrl = data.url
    console.log('dataUrl: ', dataUrl);
    qr.toDataURL(dataUrl, (err, data) => {
      if (err) {
        console.log('err: ', err);
        res.json({ status: false, msg: "qrcode not generated" })
      } else {
        res.json({ status: true, msg: data })
      }
    })
  } catch (error) {
    console.log('error: ', error);
    res.json({ status: false, msg: error })
  }
}