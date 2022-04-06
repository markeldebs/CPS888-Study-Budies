//Authentication Routes (signup and login)

const router = require("express").Router();
const JWT = require("jsonwebtoken");

//add db
const { Pool } = require("pg");

const pool = new Pool({
  host: "containers-us-west-35.railway.app",
  user: "postgres",
  database: "railway",
  password: "d4gnyl9NtBe4P2q1Utxm",
  port: "6637",
});

//Sign up route
router.post("/signup", async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    phoneNumber,
    email,
    birthdate,
    gender,
    address,
    relation,
    city,
    province,
    postalCode,
    wasTutor,
    eligibleToWork,
    over18,
    isPaid,
    type,
  } = req.body;

  //check if user already exists
  const text = 'SELECT 1 FROM "Client" WHERE "Username" = \'' + username + "'";
  console.log(text);

  await pool.query(text, (err, res) => {
    if (err) {
      //console.log(err.stack)
    } else {
      console.log(res.rows[0]);
    }
    if (res.rows[0] != undefined) {
      console.log(res.rows[0]);
      console.log("User already exists");
      userexists = true;
    } else {
      userexists = false;
    }
  });
  //promise
  await pool
    .query(text)
    .then((res) => {
      console.log(res.rows[0]);
    })
    .catch((e) => console.error(e.stack));
  // async/await
  try {
    const res = await pool.query(text);
    console.log(res.rows[0]);
  } catch (err) {
    //console.log(err.stack)
  }

  if (!userexists) {
    // if user does not exist
    
    //insert to client
    const text =
      'INSERT INTO "Client"("Client_ID", "Username", "Password") VALUES((SELECT MAX("Client_ID")+1 FROM "Client"), $1, $2)';
    const values = [username, password];
    // callback
    pool.query(text, values, (err, res) => {
      if (err) {
        //console.log(err.stack)
      } else {
        console.log(res.rows[0]);
      }
    });
    // promise
    await pool
      .query(text, values)
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
    // async/await
    try {
      const res = await pool.query(text, values);
      console.log(res.rows[0]);
    } catch (err) {
      //console.log(err.stack)
    }

    //insert to address
    const text1 =
      'INSERT INTO "Address"("Address_ID", "Home Address", "City", "Province", "PostalCode") VALUES((SELECT MAX("Address_ID")+1 FROM "Address"), $1, $2, $3,$4)';
    const values1 = [address, city, province, postalCode];
    // callback
    pool.query(text1, values1, (err, res) => {
      if (err) {
        //console.log(err.stack)
      } else {
        console.log(res.rows[0]);
      }
    });
    // promise
    pool
      .query(text1, values1)
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
    // async/await
    try {
      const res = await pool.query(text1, values1);
      console.log(res.rows[0]);
    } catch (err) {
      //console.log(err.stack)
    }

    //check for parent/tutor
      if (type == "parent") {
          //insert to parent, one issue i cant extract client_ID and address_ID
          const text2 =
              'INSERT INTO "Parent" ("Parent_ID", "Client_ID", "FirstName", "LastName", "PhoneNumber", "ParentsEmailAddress", "Address_ID", "StudentRelationship") VALUES((SELECT MAX("Parent_ID")+1 FROM "Parent"), (SELECT MAX("Client_ID") FROM "Client"), $1, $2, $3, $4, (SELECT MAX("Address_ID") FROM "Address"), $5)';
          const values2 = [firstName, lastName, phoneNumber, email, relation];
          // callback
          pool.query(text2, values2, (err, res) => {
              if (err) {
                  //console.log(err.stack)
              } else {
                  console.log(res.rows[0]);
              }
          });
          // promise
          pool
              .query(text2, values2)
              .then((res) => {
                  console.log(res.rows[0]);
              })
              .catch((e) => console.error(e.stack));
          // async/await
          try {
              const res = await pool.query(text2, values2);
              console.log(res.rows[0]);
          } catch (err) {
              //console.log(err.stack)
          }
      }
      else {
          //insert to tutor, one issue i cant extract client_ID and address_ID
          const text3 =
              'INSERT INTO "Tutor" ("Tutor_ID", "Client_ID", "FirstName", "LastName", "PhoneNumber", "Tutor_Email", "BirthDate", "Gender", "Address_ID", "PastExperience", "Eligibility", "AgeLimit", "EmployeeType") VALUES((SELECT MAX("Tutor_ID")+1 FROM "Tutor"), (SELECT MAX("Client_ID") FROM "Client"), $1, $2, $3, $4, $5, $6, $7, (SELECT MAX("Address_ID") FROM "Address"), $8, $9, $10, $11)';
          const values3 = [firstName, lastName, phoneNumber, email, birthdate, gender, wasTutor, eligibleToWork, over18, isPaid];
          // callback
          pool.query(text3, values3, (err, res) => {
              if (err) {
                  //console.log(err.stack)
              } else {
                  console.log(res.rows[0]);
              }
          });
          // promise
          pool
              .query(text3, values3)
              .then((res) => {
                  console.log(res.rows[0]);
              })
              .catch((e) => console.error(e.stack));
          // async/await
          try {
              const res = await pool.query(text3, values3);
              console.log(res.rows[0]);
          } catch (err) {
              //console.log(err.stack)
          }
      }
    

    //create token
    const token = await JWT.sign({ username }, "secret-key-studybuddies", {
      expiresIn: 360000,
    });

    //response
    res.json({
      token,
      message: true,
    });
  } else {
    //response
    res.json({
      message: false,
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    //query
    const text4 = 'SELECT 1 FROM "Client" WHERE "Username" = \'' + username + '\' AND "Password" = \'' + password + "'";
    console.log(text4);

    await pool.query(text4, (err, res) => {
        if (err) {
            //console.log(err.stack)
        } else {
            console.log(res.rows[0]);
        }
        if (res.rows[0] != undefined) {
            console.log(res.rows[0]);
            loginsuccess = true;
        } else {
            loginsuccess = false;
        }
    });
    //promise
    await pool
        .query(text4)
        .then((res) => {
            console.log(res.rows[0]);
        })
        .catch((e) => console.error(e.stack));
    // async/await
    try {
        const res = await pool.query(text4);
        console.log(res.rows[0]);
    } catch (err) {
        //console.log(err.stack)
    }

    rows = "";
    if (loginsuccess == true) {
        //find type
        query7 = 'SELECT 1 FROM \"Parent\", \"Client\" WHERE \"Parent\".\"Client_ID\" = \"Client\".\"Client_ID\" AND \"Username\" = \''+ username +"'";
        console.log(query7);
        pool.query(query7, (err, res) => {
          if (err) {
            console.log(err.stack);
            rows = res.rows[0];
          } else {
            console.log(res.rows[0]);
            rows = res.rows[0];
          }

        });

        // promise
        pool
            .query(query7)
            .then((res) => console.log(res.rows[0]))
            .catch((e) => console.error(e.stack));

        // async/await
        try {
            const res = await pool.query(query7);
            console.log(res.rows[0]);
            rows = res.rows[0];
        } catch (err) {
            //console.log(err.stack)
        }

        if (rows != undefined) {
            console.log("parent");
            userType = "parent";
          } else { //this is dangerous, but if every logged in user is parent/tutor it will work
            console.log("tutor");
            userType = "tutor";
          };


        // Send JSON WEB TOKEN
        const token = await JWT.sign({ username }, "secret-key-studybuddies", {
            expiresIn: 360000,
        });

        res.json({
            token,
            userType
        });
    }
    else {
        res.json({
            message: "False",
        });
    }

});

// //testing route
// router.post("/test", async (req, res) => {
//   // callback
  
//   query7 = 'SELECT 1 FROM \"Parent\", \"Client\" WHERE \"Parent\".\"Client_ID\" = \"Client\".\"Client_ID\" AND \"Username\" = \'user1433\'';
//   console.log(query7);
//   pool.query(query7, (err, res) => {
//     if (err) {
//       console.log(err.stack);
//     } else {
//       console.log(res.rows[0]);
//     }
    
//     if (res.rows[0] != undefined) {
//         console.log(res.rows[0]);
//         console.log("parent");
//         userType = "parent";
//       } else { //this is dangerous, but if every logged in user is parent/tutor it will work
//         console.log("tutor");
//         userType = "tutor";
//       }
//   });
//   // promise
//   pool
//     .query(query7)
//     .then((res) => console.log(res.rows[0]))
//     .catch((e) => console.error(e.stack));
// });

module.exports = router;
