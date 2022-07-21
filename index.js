const express = require("express");
require("./db/config");
const User = require("./db/user");
const products = require("./db/products");
const error = require("./db/user");
const jwt = require("jsonwebtoken");
const jwtToken = "e-com";
const cors = require("cors");
const port=5500
const hostname='0.0.0.0';
const app = express();
app.use(express.json());
app.use(cors());
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");

    if (!user) {
      res.status(400).json({
        message: "Email and Password does not match!",
        status: false,
      });
    } else {
      console.log(jwt)
      jwt.sign({ user }, jwtToken, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send("Something went wrong");
        } else {
          res.send({
            user,
            message: "Login Successfully!",
            status: true,
            auth: token,
          });
        }
      });
      
    }
  } else {
    res.status(400).json(error);
    res.send("User Not found ");
  }
});

app.post("/add-product",verifyToken, async (req, res) => {
  let product = new products(req.body);
  let result = await product.save();
  result = result.toObject();
  res.send(result);
});

app.get("/products",verifyToken, async (req, res) => {
  let product = await products.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "No Product found" });
  }
});

app.delete("/product/:id", verifyToken,async (req, res) => {
  let product = await products.deleteOne({ _id: req.params.id });
  res.send(product);
});

app.get("/product/:id",verifyToken, async (req, res) => {
  let product = await products.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
  } else {
    res.send({ result: "No Product found" });
  }
});

app.put("/product/:id",verifyToken, async (req, res) => {
  let product = await products.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(product);
});

app.get("/search/:key",verifyToken, async (req, res) => {
  let product = await products.find({
    $or: [
      { name: { $regex: req.params.key } },
      { brand: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
    ],
  });

  res.send(product);
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token.split(" ")[1];
    jwt.verify(token, jwtToken, (error, valid) => {
      if (error) {
        res.status(401).send({ result: "Please provide valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add token" });
  }
}


app.listen(port, hostname,()=>{
  console.log(`Server is runnig at http://${hostname}:${port}/`)
});
