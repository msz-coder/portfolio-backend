const express = require("express");
const fs = require("fs");
const path = require("path");
const { sanitizeMessage } = require("../utils/sanitizer");

const router = express.Router();
const messagesFile = path.join(__dirname, "../data/messages.json");

// GET messages
router.get("/", (req, res) => {
  fs.readFile(messagesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading messages" });
    const messages = JSON.parse(data || "[]");
    res.json(messages);
  });
});

// POST message
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  const sanitized = sanitizeMessage({ name, email, subject, message });

  fs.readFile(messagesFile, "utf8", (err, data) => {
    let messages = [];
    if (!err && data) {
      messages = JSON.parse(data);
    }
    messages.push(sanitized);

    fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving message" });
      res.status(201).json({ message: "Message saved successfully" });
    });
  });
});

module.exports = router;