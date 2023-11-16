require("colors");
require('express-async-errors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require("express");
require("dotenv").config();
const { engine } = require("express-handlebars");
const connectDB = require("./db");
const app = express();
const path = require('path')

// Configurations
const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "production";
const HOST = process.env.HOST || '127.0.0.1';
// Template configuration 
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    runtimeOptions: { allowProtoPropertiesByDefault: true },
  })
);
app.set("view engine", "hbs");

// Configure the session store
var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
});
// -----------------------------------------------------
// Middlewares
// ------------------------------------------------------
if (MODE === "development") app.use(require('morgan')("dev"));
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: store,
  resave: false,
  saveUninitialized: false 
}))
app.use(require('connect-flash')());
app.use(require('./middlewares/locals'));

// -------------------------------
// Routes 
// --------------------------------

app.use(require('./routes'))

// ------------------------------
// Express Error Handler 
// ---------------------------------
app.use(require('./middlewares/errorHandler'))

process.on('unhandledRejection', (error)=>{
  console.log(error)
})
// -----------------------------------
//  RUN SERVER 
// ------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on ${MODE} mode at:  http://${HOST}:${PORT}`.green.underline);
 connectDB();
});
