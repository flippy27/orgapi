const express = require("express");
const app = express();

require('dotenv').config()
var bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require("mysql");
var connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER_DB,
	password: process.env.USER_PASS,
	database: process.env.DB_NAME,
	port:process.env.DB_PORT
});

connection.connect();

app.get("/allorgs", (req, res) => {
	connection.query("SELECT * FROM orgs",  (error, results)=> {
		if(error){
			console.log('error',error);
			return;
		}
		if(!results){
			res.json({status:"204",message:"No data",data:[]})
			return;
		}
		res.json({status:"200",message:"succesfull",data:results});
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

app.listen(process.env.PORT, () => {
	console.log(`App listening on port ${process.env.PORT}`);
});
