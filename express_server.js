//*************Tiny App Set Up*************

//Dependancies
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

//Middleware
app.set("view engine", "ejs");

//Global Objects
let urlDatabase = {
  'b2xVn2': {shortURL:'b2xVn2', longURL: 'http://www.lighthouselabs.ca'},
  '9sm5xK': {shortURL:'9sm5xK', longURL: 'http://www.google.com'},
 };

 //Listening on local host port
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//*************GET requests*************
app.get("/", (req, res) => {
  res.redirect("/urls")
});

//List all shortURL's and longURls's
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});