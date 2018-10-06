//*************Tiny App Set Up*************

//Dependancies
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');


//Middleware
app.use(cookieSession({
  name: 'session',
  keys: ['secretkeys'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours in miliseconds
}))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})); 



 //Listening on local host port
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Global Objects
let urlDatabase = {
  'b2xVn2': {shortURL:'b2xVn2', longURL: 'http://www.lighthouselabs.ca', user_id: "userRandomID"},
  '9sm5xK': {shortURL:'9sm5xK', longURL: 'http://www.google.com', user_id: "user2RandomID"},
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

//Verification of Username/Email to Database
function findUser(getEmail){

  for (const key in users) {
    if (users[key].email === getEmail) {
      return users[key]; 
    }
  } 
};

//Urls created by user
function urlsForUser(userID) {
  let userURLS = {};
  for(let key in urlDatabase){
   if(userID === urlDatabase[key].user_id){
      userURLS[key] = urlDatabase[key]
    }
  }
  return userURLS
}

//*************GET requests*************
//Create account/register page
app.get('/urls/register', (req, res) => {

  let userId = req.session.user_id;

  let templateVars = {
    user: userId,
    urls: urlDatabase,
  };
  res.render("urls_register", templateVars);
});

//render login page
app.get('/urls/login', (req, res) => {
  let userId = req.session.user_id;

  let templateVars = {
    urls: urlDatabase,
    user: userId,
    users: users,
  };
  res.render("urls_login", templateVars);
});


//redirect default
app.get("/", (req, res) => {
  let user = req.session.user_id

  if (user) {
    res.redirect("/urls");
  }else {
    res.redirect("/urls/login");
  }
});

//List all shortURL's and longURls's
app.get("/urls", (req, res) => {
let user = req.session.user_id
 

  if (user) {
    let userId = req.session.user_id.id;
    let userURLS = urlsForUser(userId);
    let templateVars = {
    user: req.session.user_id,
    urls: userURLS
  };

  res.render("urls_index", templateVars);
  }else {
      
  let templateVars = {

    user: req.session.user_id,
    urls: undefined
  };
  res.render("urls_index", templateVars);
  }
});

//Create new shortURL
app.get("/urls/new", (req, res) => {
  let shortURL = req.params.id
  let longURL = urlDatabase[shortURL]
  let userId = req.session.user_id;
  let templateVars = { 
    urls: urlDatabase,
    shortURL: shortURL,
    longURL: longURL,
    user: userId
  };
  res.render("urls_new", templateVars);
});

//Redirect shortURL's to longURL's
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]
  res.redirect('http://www.' + longURL.longURL)
});

//Show all URLs in urlDatabase
app.get("/urls/:id", (req, res) => {
  let userId = req.session.user_id;
  let shortURL = req.params.id
  let longURL = urlDatabase[shortURL]
  if (userId ){
    userUrls = urlsForUser(userId)

} else {

    userId = undefined 
}
  let templateVars = { 
      urls: urlDatabase,
      shortURL: shortURL,
      longURL: longURL,
      user: userId,
      users: users
    };
  res.render("urls_show", templateVars);
});

//*************POST requests*************

//cookie login
app.post('/urls/login', (req, res)=> {
  let email = req.body.email;
  let password = req.body.password;
  let user = findUser(email)

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user
    res.redirect('/urls');

  }else if (email === '' || password === '' ) {
    res.send('Error: 400 Bad Request - Email or password cannot be empty!')
   
  } else { 
    res.send('Error: 400 Bad Request - No account available!')
  }  
});

//cookie logout
app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/urls');
});

// Registration Requirments
app.post('/urls/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = findUser(email) ? true : false
  let hashPass = bcrypt.hashSync(password, 10);
  
  if (user) { 
    res.send('Error: 400 Bad Request - Email already in use!')
  } 

  else if (email === '' || password === '' ) { 
    res.send('Error: 400 Bad Request - Email or password cannot be empty!')

  }else {
    let genId = generateShortURL();
    let newUser = {id: genId, email: email, password: hashPass};
      users[genId] = newUser
     
      //set cookie
      req.session.user_id = newUser
  
res.redirect('/urls')
}
});

//Creating new shortURLs tied to longURLS 
app.post("/urls", (req, res) => {
  let newshortURL = generateShortURL()
  let newlongURL = req.body['longURL'] 

  //add new urls to database
  urlDatabase[newshortURL] = {
    shortURL: newshortURL,
    longURL: newlongURL,
    user_id: req.session.user_id.id,
  };
  res.redirect('/urls/' + newshortURL) 
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

  databaseKey['longURL'] = req.body['longURL']

res.redirect('/urls')
});
