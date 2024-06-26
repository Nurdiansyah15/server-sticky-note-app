var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

// call database connection
var sequelize = require("./database/postgree");

var indexRouter = require("./routes/index");
var noteRouter = require("./routes/api/note");
var authRouter = require("./routes/api/auth");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", noteRouter);
app.use("/api", authRouter);

module.exports = app;
