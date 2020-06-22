const express = require('express');
const routes = require('./routes/routes.js');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
require("dotenv").config();
const User = require('./model/userModel');

mongoose
  .connect("mongodb://localhost:27017/access-control", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the Database successfully");
  });



app.use(express.json());

app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(
        accessToken,
        process.env.JWT_SECRET
      );
      // Check if token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one",
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } else {
      next();
    }
  });

app.get("/api/employees", function (req, res) {
    res.send("hola");
  });
routes(app);
app.listen(port, ()=> console.log(`app listener in port ${port}`));

