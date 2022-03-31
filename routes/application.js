//routes for application

const router = require('express').Router();
const checkAuth = require("../checkAuth.js");


//example route that checks auth beofore starting 
router.get('/parent', checkAuth, (req, res) => {
    res.json({
        message: "private message"
    })
});

module.exports = router;