//routes for parent student tutor application
const { RANDOM } = require('mysql/lib/PoolSelector');
const { Pool } = require('pg');

const pool = new Pool({
    host: "containers-us-west-35.railway.app",
    user: "postgres",
    database: "railway",
    password: "d4gnyl9NtBe4P2q1Utxm",
    port: "6637",
  });

const router = require('express').Router();

//empty routes that check auth beofore starting 

router.post('/dropoff', async (req, res) => {
    const {  
        firstName,
        lastName,
        parentEmail,
        day,
        time,
        
        
    } = req.body
    
  //const values2 = [ran, firstName, lastName, parentEmail, day, time];
    
    const ran = [Math.floor(Math.random() * 1000)];
    //const text = 'SELECT 1 FROM "Client" WHERE "Username" = \'' + username + "'";

    const query1 = `INSERT INTO "DropOffStudent" ("Authentication_ID", "Student_First_Name","Student_Last_Name", "Parent_Email", "Date", "Time") VALUES ('${ran}', '${firstName}', '${lastName}', '${parentEmail}', '${day}', '${time}')`;

    //console.log(query1);    test to see if query prints correctly
    
    pool.query(query1, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(422).json({
                errors: [
                  {
                    msg: "Invalid Credentials",
                  },
                ],
              });  
        }
        else{
               // Runs for loop for duration of array.
                //console.log(result.rows[i]);                     // Returns Firstnames of all participants
                 // Conditional statement for if first name is Mark
                    console.log("Dropped Off")
                    //res.setHeader('55', 'Status')
                    res.send({ message: "Dropped Off" })
                    
                        console.log(err);
                        //res.setHeader('55', 'Status')
                        console.log("Student not found")
                        //res.send({message: "Student not found"});
                  
        }
    })
});


router.post('/pickup', async (req, res) => {
    const {  
        code,
    } = req.body
    
 release = 0;
    
    //const text = 'SELECT 1 FROM "Client" WHERE "Username" = \'' + username + "'";

    const query2 = `SELECT "Authentication_ID", "Student_First_Name", "Student_Last_Name" FROM "DropOffStudent"`;

    //console.log(query1);    test to see if query prints correctly
    
    pool.query(query2, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(422).json({
                errors: [
                  {
                    msg: "Invalid Credentials",
                  },
                ],
              });
        }
        else{
            for (i = 0; i < result.rowCount ; i++) {           // Runs for loop for duration of array.
                //console.log(result.rowCount);                     // Returns Firstnames of all participants
                //console.log(result);
                if (result.rows[i].Authentication_ID == code){       // Conditional statement for if code matched
                    console.log("Student Released")
                    //res.setHeader('55', 'Status')
                    //res.send({ message: "Student released" })
                    //break;
                    release = 1;
                    break;
                }
                else{
                        console.log(err);
                        //res.setHeader('55', 'Status')
                        console.log("Student not found")
                        //res.send({message: "Wrong Code"})
                        //res.send({message: "Student not found"});
                        release = 0;
                        //break;
                    }
            }
            if (release == 1 ){                    
            //res.setHeader('55', 'Status')
            res.send({ message: "Student released" })
            release = 0;
            }
            else {
                //res.send({message: "Wrong Code"})
                res.send({message: "Student not found"});
            }
        }
    }) 
});


module.exports = router;