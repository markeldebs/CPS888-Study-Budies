//Authentication Routes (signup and login)

const router = require("express").Router();
//const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
//const bcrypt = require('bcrypt');

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
    address,
    relation,
    city,
    province,
    postalCode,
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
    // Hash the password
    //const hashedPassword = await bcrypt.hash(password, 10);

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
      const res = await pool.query(text1, values1);
      console.log(res.rows[0]);
    } catch (err) {
      //console.log(err.stack)
    }

    // users.push({
    //     username,
    //     password: hashedPassword,
    //     type
    // });

    //create token
    const token = await JWT.sign({ username }, "secret-key-studybuddies", {
      expiresIn: 360000,
    });

    //response
    res.json({
      token,
      message: "True",
    });
  } else {
    //response
    res.json({
      message: "False",
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if user with email exists
  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(422).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  // Check if the password is valid
  //let isMatch = await bcrypt.compare(password, user.password);

  // if(!isMatch){
  //     return res.status(404).json({
  //         errors: [
  //             {
  //                 msg: "Invalid Credentials"
  //             }
  //         ]
  //     })
  // }

  // Send JSON WEB TOKEN
  const token = await JWT.sign({ email }, "secret-key-studybuddies", {
    expiresIn: 360000,
  });

  res.json({
    token,
  });
});

//testing route
router.post("/test", async (req, res) => {
  // callback
  query111 = 'SELECT MAX("Client_ID")+1 FROM "Client"';
  pool.query(query111, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows[0]);
      clientid = res.rows[0].toString;
      console.log(clientid + 1);
    }
  });
  // promise
  pool
    .query(query111)
    .then((res) => console.log(res.rows[0]))
    .catch((e) => console.error(e.stack));
});

module.exports = router;
