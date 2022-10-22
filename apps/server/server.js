//* EXPRESS + Cors
const express = require("express");
const cors = require ("cors");
const app = express();

//* Mongoose dependencies
const mongoose = require("mongoose");
const MONGO_URI = "mongodb+srv://kenzo_n:1234@cluster0.xeh6d2f.mongodb.net";
const db = mongoose.connection;

const port = process.env.PORT ?? 3000;

//* bcrypt dependencies
const bcrypt = require("bcrypt");
const saltRounds = 10;

//* MIDDLEWARE
app.use(cors());
app.use(express.json()); //this is how Express interprets body from client side

//* ROUTES


//---------------------
//* Connect to Mongo
mongoose.connect(MONGO_URI, () => {
    console.log("the connection with mongod is established");
});

// Connection Error/Success
//* Define callback functions for various events
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("connected", () => {
    app.listen(port, ()=>{
        console.log("listening on port", port);
    });
    console.log("mongo connected: ", MONGO_URI);
});
db.on("disconnected", () => console.log("mongo disconnected"));