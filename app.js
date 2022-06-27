const express = require("express");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const bodyParser = require("body-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const path = require("path");

// Database
const db = require("./config/database");

// Test DB
db.authenticate()
  .then(() => console.log("Database connected...."))
  .catch((err) => console.log("Error : " + err));

const app = express();

// handlebars
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "hbs");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index", { layout: "landing" });
});

app.use("/gigs", require("./routes/gigs"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
