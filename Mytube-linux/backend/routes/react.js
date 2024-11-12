const express = require("express");

const router = express.Router();

//get react app
router.route("/").get((req, res) => {
    res.send("<h1>This page will show the react App</h1>");
});



module.exports = router;
