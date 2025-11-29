const express = require('express');
const router = express.Router();

// Homepage route for Render and normal browser
router.get('/', (req, res) => {
    res.render('home/index', { user: null });
});

// Old route (optional)
router.get('/home', (req, res) => {
    res.render('home/index', { user: null });
});

module.exports = router;
