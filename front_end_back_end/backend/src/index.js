const express=require("express")
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require("body-parser");
const Module = require("../routes/modules")


dotenv.config({ path: "../config/config.env" });

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use("/api/module/", Module);

const PORT =5000;
app.listen(
  PORT,
  console.log(`app running in on port ${PORT}`)
);
