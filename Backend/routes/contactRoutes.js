const express = require("express");

const router = express.Router();

const {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} = require("../controllers/contactController");

// Public
router.post("/", createContactMessage);

// Admin
router.get("/", getContactMessages);

router.patch("/:id/status", updateContactStatus);

router.delete("/:id", deleteContactMessage);

module.exports = router;