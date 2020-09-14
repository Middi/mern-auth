require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./user");

let user = {};

//----------------------------------------- END OF IMPORTS---------------------------------------------------
mongoose.connect(
  process.env.DB_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000', // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SECRET_CODE,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SECRET_CODE));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);



//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send({
          message: "You are now logged in.",
          user: {
            username: req.user.username
          }
        });
        console.log(req.user);
      });
    }
  })(req, res, next);
});


app.get('/logout', (req, res, next) => {
  req.logout();
  res.send('You have been logged out.');
});

app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      let hashedPassword = null;
      if(req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
      }

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        referrer: req.body.referrer || "email",
        email: req.body.email
      });
      await newUser.save();
      res.send("You are now registered, Please login.");
    }
  });
});
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(5000, () => {
  console.log("Server Has Started");
});
