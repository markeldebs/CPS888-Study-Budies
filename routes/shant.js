//shants routes
const router = require('express').Router();
const jwt = require("jsonwebtoken");

//db
const { Pool } = require('pg');

const pool = new Pool({
    host: "containers-us-west-35.railway.app",
    user: "postgres",
    database: "railway",
    password: "d4gnyl9NtBe4P2q1Utxm",
    port: "6637",
});


//student registration route 
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

    //authenticate user
    const jwtuser = await jwt.verify(token, "secret-key-studybuddies")
    username = jwtuser.username;

    //query
    const text7 =
        'INSERT INTO "Student" ("Student_ID","Parent_ID","FirstName","LastName","StudentEmailAddress", "BirthDate", "Gender", "Allergies", "Grade") VALUES((SELECT MAX("Student_ID")+1 FROM "Student"), (SELECT "Parent_ID" FROM "Parent", "Client" WHERE "Parent"."Client_ID" = "Client"."Client_ID" AND "Username" = $1), $2, $3, $4, $5, $6, $7, $8)';
    const values7 = [username, firstName, lastName, email, birthdate, gender, allergies, grade];
    await pool.query(text7, values7, (err, res) => {
        if (err) {
            //console.log(err.stack)
        } else {
            console.log(res.rows[0]);
        }
    });
    // promise
    await pool
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

//course search route 
router.post('/courseSearch', async (req, res) => {
    const {
        isPaid,
        isOnline,
        isGroup,
        grade,
        subject,
        token
    } = req.body

    //authenticate user
    const jwtuser = await jwt.verify(token, "secret-key-studybuddies")

    if (isPaid == true) { isPaids = "Paid"; } else { isPaids = "Free"; }
    if (isOnline == true) { isOnlines = "Online"; } else { isOnlines = "In Person"; }
    if (isGroup == true) { isGroups = "Group"; } else { isGroups = "Solo"; }

    const text8 =
        'SELECT * FROM "ClassesAvailable" WHERE "TutoringService" = $1 AND "Subject" = $2 AND "ServiceForm" = $3 AND "PackageChosen" = $4';
    const values8 = [isPaids, subject, isOnlines, isGroups];
    console.log(text8, values8)

    await pool.query(text8, values8, (err, res) => {
        if (err) {
            //console.log(err.stack)
        } else {
            console.log(res.rows[0]);
            availableCourses = res.rows;
        }
    });
    // promise
    await pool
        .query(text8, values8)
        .then((res) => {
            console.log(res.rows[0]);
        })
        .catch((e) => console.error(e.stack));
    // async/await
    try {
        const res = await pool.query(text8, values8);
        console.log(res.rows[0]);
    } catch (err) {
        //console.log(err.stack)
    }

    res.json({
        availableCourses
    })
});

//enrollment route 
router.post('/enrollment', async (req, res) => {
    const {
        firstName,
        lastName,
        Token,
        course: {
            serviceType,
            subject,
            isOnline,
            isGroup,
            timings
        }
    } = req.body

    //authenticate user
    const jwtuser = await jwt.verify(Token, "secret-key-studybuddies")

    //get student id
    const query1 = {
        text: 'SELECT "Student_ID" FROM "Student" WHERE "FirstName" = $1 AND "LastName" = $2',
        values: [firstName, lastName],
    }
    // callback
    pool.query(query1, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0]);
            studentID = res.rows[0].Student_ID;
        }
    })
    // promise
    await pool
        .query(query1)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))



    if (isOnline == true) { isOnlines = "Online"; } else { isOnlines = "In Person"; }
    if (isGroup == true) { isGroups = "Group"; } else { isGroups = "Solo"; }

    //query
    const query = {
        text: 'INSERT INTO "SubjectRegistration" ("Registration_ID","Student_ID","TutoringService","Subject","ServiceForm","PackageChosen","AvailableTimeSlots") VALUES((SELECT MAX("Registration_ID")+1 FROM "SubjectRegistration"), $1, $2, $3, $4, $5, $6)',
        values: [studentID, serviceType, subject, isOnlines, isGroups, timings],
    }
    // callback
    pool.query(query, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
        }
    })
    // promise
    await pool
        .query(query)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))


    res.json({
        message: "True"
    })
});

//dashboard route 
router.post('/dashboard', async (req, res) => {
    const {
        type,
        Token
    } = req.body

    //authenticate user
    const jwtuser = await jwt.verify(Token, "secret-key-studybuddies")
    parentEmail = jwtuser.username;
    tutorEmail = jwtuser.username;

    //parent or tutor
    if (type == "parent") {
        //parent

        //get parent id
        const query2 = {
            text: 'SELECT "Parent_ID" FROM "Parent" WHERE "ParentsEmailAddress" = $1',
            values: [parentEmail],
        }
        // callback
        pool.query(query2, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0]);
                parentID = res.rows[0].Parent_ID;
            }
        })
        // promise
        await pool
            .query(query2)
            .then(res => console.log(res.rows[0]))
            .catch(e => console.error(e.stack))




        //get results
        const query3 = {
            text: 'SELECT "FirstName", "LastName", "Subject", "ServiceForm", "PackageChosen", "AvailableTimeSlots" FROM "Student" JOIN "SubjectRegistration" USING ("Student_ID") WHERE "Parent_ID" = $1',
            values: [parentID],
        }
        // callback
        pool.query(query3, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0]);
                results = res.rows;
            }
        })
        // promise
        await pool
            .query(query3)
            .then(res => console.log(res.rows[0]))
            .catch(e => console.error(e.stack))


        res.json({
            results
        })


    } else if (type == "tutor") {
        //tutor

        //get results
        const query4 = {
            text: 'SELECT "TutoringService", "Subject", "ServiceForm", "PackageChosen", "AvailableSlots"  FROM "ClassesAvailable" JOIN "TutorClassesRegistration" USING("ClassesAvailable_ID") JOIN "Tutor" USING ("Tutor_ID") WHERE "Tutor_Email" = $1',
            values: [tutorEmail],
        }
        // callback
        pool.query(query4, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0]);
                scheduledSessions = res.rows;
            }
        })
        // promise
        await pool
            .query(query4)
            .then(res => console.log(res.rows[0]))
            .catch(e => console.error(e.stack))


        res.json({
            scheduledSessions
        })

    } else {
        //neither parent nor tutor
        res.json({
            message: "False"
        })
    }
});

//course search route 
router.post('/accountinfo', async (req, res) => {
    const {
        token
    } = req.body

    //authenticate user
    const jwtuser = await jwt.verify(token, "secret-key-studybuddies")
    username = jwtuser.username


    //get parent name
    const query5 = {
        text: 'SELECT "FirstName", "LastName" FROM "Parent" WHERE "ParentsEmailAddress" = $1',
        values: [username],
    }
    // callback
    pool.query(query5, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0]);
            parentFirstName = res.rows[0].FirstName;
            parentLastName = res.rows[0].LastName;
        }
    })
    // promise
    await pool
        .query(query5)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))



    //get student names
    const query6 = {
        text: 'SELECT "Student"."FirstName" FROM "Student" JOIN "Parent" USING("Parent_ID") WHERE "ParentsEmailAddress" = $1',
        values: [username],
    }
    // callback
    pool.query(query6, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0]);
            students = res.rows;
        }
    })
    // promise
    await pool
        .query(query6)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))


    res.json({
        parentFirstName,
        parentLastName,
        students
    })
});

// //testing route
// router.post("/test", async (req, res) => {
//   // callback

//   query7 = 'SELECT "Parent_ID" FROM \"Parent\", \"Client\" WHERE \"Parent\".\"Client_ID\" = \"Client\".\"Client_ID\" AND \"Username\" = \'test@test.com\'';
//   console.log(query7);
//   await pool.query(query7, (err, res) => {
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