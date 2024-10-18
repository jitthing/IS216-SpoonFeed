const express = require("express");

// import the rest of the controllers for each model
const { checkUser } = require("../controllers/userController");

router = express.Router();

router.post("/check-user", checkUser);

// configure api endpoints for each function (controller)

module.exports = router;
