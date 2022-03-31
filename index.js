const express = require('express');
const app = express();

app.use(express.json());

const PORT = 8082;

//Set up Routing for auth.js
const auth = require('./routes/auth');
app.use('', auth);


app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/tshirt', (req, res) => {
    res.status(200).send({
        tshirt: 'r',
        size: 'Large'
    })
});

app.post('/tshirt/:id', (req, res) => {

    const {id} = req.params;
    const {logo} = req.body;

    if (!logo){
        res.status(418).send({message: 'We need a logo!'})
    }

});

app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
  });

