const express = require('express');

const app = require('express')();
const PORT = 8082;

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

app.use(express.json())

app.post('/tshirt/:id', (req, res) => {

    const {id} = req.params;
    const {logo} = req.body;

    if (!logo){
        res.status(418).send({message: 'We need a logo!'})
    }

});

