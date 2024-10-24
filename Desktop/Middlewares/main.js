const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/about", (req, res) => {
  res.send("Hello about");
});

app.get("/contact", (req, res) => {
  res.send("Hello Contact");
});

app.get("/soham", (req, res) => {
  res.send("Welcome to soham's get request");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
