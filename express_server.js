//*************Tiny App Set Up*************

//Dependancies
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

//Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Global Objects
let urlDatabase = {
  'b2xVn2': {shortURL:'b2xVn2', longURL: 'http://www.lighthouselabs.ca'},
  '9sm5xK': {shortURL:'9sm5xK', longURL: 'http://www.google.com'},
 };

 //Listening on local host port
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//*************Functions*************

//Random String for ShortUrl Generator
function generateRandomString() {
  let key = '';
  let charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz'

  for (let i = 0; i < 6 ; i++) {
    key += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }
      return key;
};

//*************GET requests*************
app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//List all shortURL's and longURls's
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Create new shortURL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Show all URLs in urlDatabase
app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

//*************POST requests*************

app.post("/urls", (req, res) => {
  console.log(req.body); 
  res.send("Ok");         
});