const express = require("express");
const { uploadCustomerData} = require("../controllers/uploadCustomerController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// Add a new customer under a project
router.post("/", authMiddleware, uploadCustomerData);

module.exports = router;