var express = require("express");
const router = express.Router();
const common = require('../helper/common')
const controller = require('../controller/authController')
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post("/register", controller.register)
router.post('/login', controller.login)
router.post("/imageupload", common.Authorization, upload.single('image'), controller.imageUpload)
router.get('/qrCode', common.Authorization, controller.qrCode)



module.exports = router;