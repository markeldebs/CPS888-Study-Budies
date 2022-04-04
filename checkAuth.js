const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')

    // CHECK IF WE EVEN HAVE A TOKEN
    if(!token){
        res.status(401).json({
            errors: [
                {
                    msg: "No token found"
                }
            ]
        })
    }

    try {
        const user = await jwt.verify(token, "secret-key-studybuddies")
        req.user = user.email
        next()
    } catch (error) {
        return res.status(422).json({
            errors: [
                {
                    msg: "Invalid Credentials",
                }
            ]
        })
    }
}



