const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createNotificationController,
  getNotificationsController,
  markAsReadController,
  deleteNotificationController,
} = require("../controllers/notificationController");

// Create Notification
router.post(
  "/create",
  protect,
  createNotificationController
);

// Get All Notifications
router.get(
  "/",
  protect,
  getNotificationsController
);

// Mark Notification as Read
router.put(
  "/read/:id",
  protect,
  markAsReadController
);

// Delete Notification
router.delete(
  "/:id",
  protect,
  deleteNotificationController
);

module.exports = router;