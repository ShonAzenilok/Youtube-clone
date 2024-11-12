const express = require("express");
const tokencontroller = require("../controllers/tokens")
const {upload } = require("../multer");

const router = express.Router();




//create JWT token
router.route("/").post(tokencontroller.createJWT)
//gets the token
router.route("/").get(tokencontroller.getJWT)
//login user
router.route("/login").post( tokencontroller.login)
//register user
router.route("/register").post(upload,tokencontroller.register)
module.exports = router;
