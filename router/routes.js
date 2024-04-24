var express = require("express");
const router = express.Router();
const common = require('../helper/common')
const controller = require('../controller/authController')
const twoFaController = require('../controller/twofaController')
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post("/register", controller.register)
router.post('/login', controller.login)
router.post("/imageupload", common.Authorization, upload.single('image'), controller.imageUpload)
router.get('/qrCode', common.Authorization, controller.qrCode)


// two fa 

router.get('/qrGenerate', common.Authorization, twoFaController.qrGenerate)
router.get('/qrVerify' , common.Authorization , twoFaController.qrVerify)
router.get('/tfastatuschecker' , common.Authorization , twoFaController.tfastatuschecker)
router.post('/updatetfastatus', common.Authorization , twoFaController.updatetfastatus)


module.exports = router;