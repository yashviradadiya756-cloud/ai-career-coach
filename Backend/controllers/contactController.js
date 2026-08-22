const Contact = require("../models/Contact");

// =====================================================
// CREATE CONTACT MESSAGE
// =====================================================

const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Save message
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL CONTACT MESSAGES
// For Admin Dashboard
// =====================================================

const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE CONTACT STATUS
// =====================================================

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["New", "Read", "Replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE CONTACT MESSAGE
// =====================================================

const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};


module.exports = {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
};