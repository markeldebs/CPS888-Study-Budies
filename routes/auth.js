//Authentication Routes (signup and login)

const router = require('express').Router();
const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { users } = require("../db");


//Sign up route
router.post('/signup',[
    check("email", "Please input a valid email")
        .isEmail(),
    check("password", "Please input a password with a minimum length of 6 characters.")
        .isLength({min: 6})
], async (req, res) => {
    const { email, password, type } = req.body;
    
    const errors = validationResult(req);
    
    //check for valid email/pass
    if(!errors.isEmpty()){
        return res.status(422).json({
            errors: errors.array()
        })
    }

    //check for duplicate email
    let user = users.find((user) => {
        return user.email === email
    });

    if(user) {
        return res.status(422).json({
            errors: [
                {
                    msg: "This user already exists",
                }
            ]
        })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user to db
    users.push({
        email,
        password: hashedPassword,
        type
    });

    const token = await JWT.sign({ email }, "secret-key-studybuddies", {expiresIn: 360000});

    res.json({
        token,
        message: "True"
    })

});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    // Check if user with email exists
    let user = users.find((user) => {
        return user.email === email
    });

    if(!user){
        return res.status(422).json({
            errors: [
                {
                    msg: "Invalid Credentials",
                }
            ]
        })
    }

    // Check if the password if valid
    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(404).json({
            errors: [
                {
                    msg: "Invalid Credentials" 
                }
            ]
        })
    }

    // Send JSON WEB TOKEN
    const token = await JWT.sign({email}, "secret-key-studybuddies", {expiresIn: 360000})

    res.json({
        token
    })
});


// return all users
router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router;
