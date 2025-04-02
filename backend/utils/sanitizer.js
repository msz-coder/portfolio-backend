function sanitizeMessage(msg) {
    return {
      name: msg.name.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, "").trim(),
      email: msg.email.trim(),
      subject: msg.subject.replace(/[^A-Za-z ]/g, "").trim(),
      message: msg.message.replace(/[<>]/g, "").trim(),
    };
  }
  
  module.exports = { sanitizeMessage };