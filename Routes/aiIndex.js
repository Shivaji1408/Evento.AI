const express = require("express");
const router = express.Router();

// GET → AI Index Page
router.get("/ai", (req, res) => {
    res.render("ai/index");
});

module.exports = router;
