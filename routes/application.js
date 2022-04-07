//routes

const router = require('express').Router();
const checkAuth = require("../checkAuth.js");
const jwt = require("jsonwebtoken");

//add db
const { Pool } = require("pg");

const pool = new Pool({
  host: "containers-us-west-35.railway.app",
  user: "postgres",
  database: "railway",
  password: "d4gnyl9NtBe4P2q1Utxm",
  port: "6637",
});


//student route 
router.post('/student', async (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        birthdate,
        gender,
        allergies,
        grade,
        token
    } = req.body

    const jwtuser = await jwt.verify(token, "secret-key-studybuddies")
    username = jwtuser.username;

    const text7 =
        'INSERT INTO "Student" ("Student_ID","Parent_ID","FirstName","LastName","StudentEmailAddress", "BirthDate", "Gender", "Allergies", "Grade") VALUES((SELECT MAX("Student_ID")+1 FROM "Student"), (SELECT "Parent_ID" FROM "Parent", "Client" WHERE "Parent"."Client_ID" = "Client"."Client_ID" AND "Username" = $1), $2, $3, $4, $5, $6, $7, $8)';
    const values7 = [username, firstName, lastName, email, birthdate, gender, allergies, grade];
    pool.query(text7, values7, (err, res) => {
        if (err) {
          //console.log(err.stack)
        } else {
          console.log(res.rows[0]);
        }
      });
      // promise
      pool
        .query(text7, values7)
        .then((res) => {
          console.log(res.rows[0]);
        })
        .catch((e) => console.error(e.stack));
      // async/await
      try {
        const res = await pool.query(text7, values7);
        console.log(res.rows[0]);
      } catch (err) {
        //console.log(err.stack)
      }


    res.json({
        message: "True"
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


// //testing route
// router.post("/test", async (req, res) => {
//   // callback

//   query7 = 'SELECT "Parent_ID" FROM \"Parent\", \"Client\" WHERE \"Parent\".\"Client_ID\" = \"Client\".\"Client_ID\" AND \"Username\" = \'test@test.com\'';
//   console.log(query7);
//   pool.query(query7, (err, res) => {
//     if (err) {
//       console.log(err.stack);
//     } else {
//       console.log(res.rows[0]);
//     }
//   });
//   // promise
//   pool
//     .query(query7)
//     .then((res) => console.log(res.rows[0]))
//     .catch((e) => console.error(e.stack));

//     res.json({
//         message: "private message"
//     })
    
// });





module.exports = router;
