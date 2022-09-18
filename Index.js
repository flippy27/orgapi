const express = require("express");
const app = express();

require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const { Pool, Client } = require("pg");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new Client({
  user: process.env.USER_DB,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.USER_PASS,
  port: process.env.DB_PORT,
});
client.connect();

app.get("/allorgs", (req, res) => {
  client.query("SELECT * FROM orgs oo ORDER BY oo.created_at asc", (error, results) => {
    if (error) {
      res.json({
        status: "500",
        message: "postgres error?",
        data: error,
      });
      return;
    }
    if (!results) {
      res.json({ status: "204", message: "No data", data: [] });
      return;
    }
    res.json({ status: "200", message: "succesfull", data: results.rows });
  });
});
app.get("/alltypes", (req, res) => {
  client.query("SELECT * FROM type", (error, results) => {
    if (error) {
      res.json({
        status: "500",
        message: "postgres error?",
        data: error,
      });
      return;
    }
    if (!results) {
      res.json({ status: "204", message: "No data", data: [] });
      return;
    }
    res.json({ status: "200", message: "succesfull", data: results.rows });
  });
});
app.post("/insertorg", (req, res) => {
  let user = req.body.user;
  let created_at = req.body.created_at;
  let type = req.body.type;
  console.log('inserting',user,created_at,type);
  client.query(
    "INSERT INTO orgs (user_name,created_at,type_id) VALUES ( '" + user + "','" + created_at + "', "+ type +" ) ",
    (error, results) => {
      if (error) {
        res.json({ status: "500", message: "postgres error?", data: error });
        return;
      }
      res.json({ status: "200", message: "succesfull", data: { results } });
    }
  );
});
app.post("/deleteorg", (req, res) => {
  let id = req.body.item_id;
  console.log('id',id);
  client.query(
    "DELETE FROM orgs WHERE id = " + id,
    (error, results) => {
      console.log();
      if (error) {
        res.json({ status: "500", message: "postgres error?", data: error });
        return;
      }
      
      res.json({ status: "200", message: "succesfull", data: { results } });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
