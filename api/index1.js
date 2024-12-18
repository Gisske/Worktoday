const express = require("express");
const db = require("./db.js"); // ใช้งาน knex จาก db.js
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

app.use(bodyParser.json());

app.use((req, res, next) => {
  if (!db) {
    console.error("Database connection is not defined");
    return res.status(500).send("Database connection error");
  }
  req.knex = db; 
  next();
});

router.get('/list', async (req, res) => {
  try {
    const result = await req.knex('student').select('*'); 
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});


app.use('/api', router);

const port = 7000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});