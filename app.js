require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");


const app = express();
const PORT = process.env.PORT;

//database connection....
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on('error',(error)=>{
    console.log(error);
});
db.once('open',()=>{
    console.log("Connected to database");
})

//set ejs engine......
app.set("view engine", "ejs");

//route prefix....
app.use("", require("./routes/routs"));

//set image static for displaying.....\
app.use(express.static("uploads"));

app.listen(PORT, () => {
    console.log("Server Started");
});