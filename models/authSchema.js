const mongoose = require('mongoose')
var Schema = mongoose.Schema
var authSchema = new Schema(
    {
        name: { type: String },
        email: { type: String },
        password: { type: String },
        phone: { type: Number },
        url: { type: String , default:"null"},
        datatype: { type: String ,default:"null"},
        tfastatus:{type: Boolean ,default:false},
        qrcode:{type: String ,default:"null"},
        secretkey:{type: String ,default:"null"}


    }, { timestamps: true }
)

module.exports = mongoose.model("auth", authSchema)