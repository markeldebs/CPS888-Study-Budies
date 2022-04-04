const users = [
    {
        "email": "shant@study.com",
        "password": "shanto",
        "type": "parent"
    }
]

module.exports = {
    users
}


/*   THIS QUERY WORK PERFECTLY LOCALLY BUT IT BROKE WHEN DEPLOYING BECUASE IS A RECURSIVE TEST THAT DOESN'T EXIT
const { Pool } = require('pg');

const pool = new Pool({
    host: "containers-us-west-35.railway.app",
    user: "postgres",
    database: 'railway',
    password:"d4gnyl9NtBe4P2q1Utxm",
    port:"6637",
});

pool.query('SELECT "FirstName" FROM "Parent"', (err, result) => {
    if(err) {
        console.log(err);
    }
    else{

        for (i = 0; i < result.rowCount ; i++) {           // Runs for loop for duration of array.
            console.log(result.rows[i].FirstName);         // Returns Firstnames of all participants

            if (result.rows[i].FirstName == "Mark"){       // Conditional statement for if first name is Mark
                console.log("Mark selected")
            }
        }
    }
})




module.exports = pool;

*/