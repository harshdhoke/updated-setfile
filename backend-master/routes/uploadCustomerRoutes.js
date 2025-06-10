// routes/customer.js
const express = require("express");
const router = express.Router();
const customerController = require("../controller/customer"); // Import controller

// POST /upload-customer
router.post("/", customerController.uploadCustomer);

module.exports = router;