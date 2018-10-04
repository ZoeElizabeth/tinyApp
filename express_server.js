//*************Tiny App Set Up*************

//Dependancies
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


//Middleware
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

 //Listening on local host port
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Global Objects
let urlDatabase = {
  'b2xVn2': {shortURL:'b2xVn2', longURL: 'http://www.lighthouselabs.ca'},
  '9sm5xK': {shortURL:'9sm5xK', longURL: 'http://www.google.com'},
 };

 const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//*************Functions*************

//Random String for ShortUrl Generator
function generateShortURL() {
  let key = '';
  let charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz'

  for (let i = 0; i < 6 ; i++) {
    key += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }
      return key;
};


//*************POST requests*************

//cookie login
app.post('/urls/login', (req, res)=> {
  let email = req.body.email;
  let password = req.body.password;

  res.cookie('email', req.body.email);
  res.redirect('/urls');
});

//cookie logout
app.post('/logout', (req, res) => {
  res.clearCookie('email', req.body.email);
  res.redirect('/urls');
});

// Registration Requirments
app.post('/urls/register', (req, res) => {

  let email = req.body.email;
  let password = req.body.password;

   let genId = generateShortURL();
    let newUser = {id: genId, email: email, password: password};
      users[genId] = newUser
  console.log(users)
     
res.redirect('/urls')
});

//Creating new shortURLs tied to longURLS 
app.post("/urls", (req, res) => {
  let makeShortURL = generateShortURL()
  let currentShortURL = makeShortURL
  let makeLongURL = req.body['longURL'] 

  //add new urls to database
  urlDatabase[currentShortURL] = {
        shortURL: currentShortURL,
        longURL: makeLongURL,
      };
  res.redirect('/urls/' + makeShortURL) 
});

// Delete existing URL
app.post('/urls/:id/delete', (req, res) => {
let targetId = req.params.id;
  delete urlDatabase[targetId]

res.redirect('/urls');
});

// Edit existing URL
app.post('/urls/:id/edit', (req, res)=> {
  let targetId = req.params.id;
  let databaseKey = urlDatabase[targetId]

  databaseKey.longURL = req.body['longURL']

  res.redirect('/urls')
});

//*************GET requests*************
//Create account/register page
app.get('/urls/register', (req, res) => {  
  let email = res.cookie.email
  let templateVars = {
    users: email,
    urls: urlDatabase,
  };
  res.render("urls_register", templateVars);
  });


//redirect default
app.get("/", (req, res) => {

  res.redirect("/urls");
});

//List all shortURL's and longURls's
app.get("/urls", (req, res) => {
  let shortURL = req.params.id
  let longURL = urlDatabase['longURL']
  
  let templateVars = {
     urls: urlDatabase,
     shortURL: shortURL,
     longURL: longURL,
     username: req.cookies["email"] };
  res.render("urls_index", templateVars);
});

//Create new shortURL
app.get("/urls/new", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    shortURL: req.params.id,
    username: req.cookies["email"] 
  };
  res.render("urls_new", templateVars);
});

//Redirect shortURL's to longURL's
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL].longURL

  res.redirect(longURL);
});

//Show all URLs in urlDatabase
app.get("/urls/:id", (req, res) => {
  let templateVars = { 
      urls: urlDatabase,
      shortURL: req.params.id,
      username: req.cookies["email"] 
    };
  res.render("urls_show", templateVars);
});

