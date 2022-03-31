//routes for parent student tutor application

const router = require('express').Router();
const checkAuth = require("../checkAuth.js");


//empty routes that check auth beofore starting 
router.get('/parent', checkAuth, (req, res) => {
    const {  
        firstName,
        lastName,
        phoneNumber,
        email,
        address,
        relation,
        city,
        province 
    } = req.body

    res.json({
        message: "private message"
    })
});

router.get('/student', checkAuth, (req, res) => {
    const {  
        firstName,
        lastName,
        phoneNumber,
        email,
        birthdate,
        gender,
        allergies,
        grade,
    } = req.body
    
    res.json({
        message: "private message"
    })
});

router.get('/tutor', checkAuth, (req, res) => {
    const {  
        firstName,
        lastName,
        phoneNumber,
        email,
        birthdate,
        gender,
        allergies,
        address,
        city,
        province,
        wasTutor,
        eligibleToWork,
        over18 
    } = req.body
    
    res.json({
        message: "private message"
    })
});


module.exports = router;