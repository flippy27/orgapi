const express = require("express");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "orgdb",
});

connection.connect();

app.get("/allorgs", (req, res) => {
	connection.query("SELECT * FROM orgs", function (error, results) {
		console.log(results[0]);
		res.json(results);
	});
});
app.post("/insertorg", (req, res) => {
	let user = req.body.user;
	connection.query(
		"INSERT INTO orgs (user,created_at) VALUES ( '" + user + "',NOW())",
		(error, results) => {
            if(error) console.log(error);
			res.json("done");
		}
	);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
