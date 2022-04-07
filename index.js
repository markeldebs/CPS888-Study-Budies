const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const PORT = 8082;

//Set up Routing for auth.js
const auth = require("./routes/auth");
app.use("", auth);

//Set up Routing for application.js
const application = require("./routes/application");
app.use("", application);

//Set up Routing for shant.js
const shant = require("./routes/shant");
app.use("", shant);

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));

app.get("/tshirt", (req, res) => {
  res.status(200).send({
    tshirt: "r",
    size: "Large",
  });
});

app.post("/tshirt/:id", (req, res) => {
  const { id } = req.params;
  const { logo } = req.body;

  if (!logo) {
    res.status(418).send({ message: "We need a logo!" });
  }
});

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});
