const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const users = require("./model/user");
const Note = require("./model/notes");

const port = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static("layouts"));

app.set("view engine", "ejs");

// * Mongoose connectivity

main().catch((err) => {
  console.log(err.message);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Notesdb");
  console.log("yes connected!!");
}

// * The API for serve the HTML files
app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.get("/login", (req, res) => {
  res.status(200).render("login");
});

app.get("/signup", (req, res) => {
  res.status(200).render("signup");
});
app.get("/logout", (req, res) => {
  res.status(200).render("logout");
});

//* The API for the endpionts

app.post("/getnotes", async (req, res) => {
  let notes = await Note.find({ email: req.body.email });
  res.status(200).json({ success: true, notes: notes });
  if (!notes) {
    alert("please login");
  }
});
app.post("/login", async (req, res) => {
  let user = await users.findOne(req.body);
  if (!user) {
    res.status(200).json({ success: false, message: `No account found` });
  } else {
    res.status(200).json({
      success: true,
      user: { email: user.email },
      message: "you have succesfully loggined ",
    });
  }
});

app.post("/signup", async (req, res) => {
  let user = await users.create(req.body);
  res.status(200).json({ success: true, user: user });
  console.log(req.body);
});

app.post("/addnotes", async (req, res) => {
  let note = await Note.create(req.body);
  res.status(200).json({ success: true, note: note });
});

app.post("/deletenote", (req, res) => {});
app.post("/logout", async (req, res) => {
  let user = await users.findOne(req.body);
  if (!user) {
    res.status(200).json({ success: false, message: `No account found` });
  } else {
    res.status(200).json({
      success: true,
      user: { email: user.email },
      message: "you have succesfully logged out ",
    });
  }
});

app.listen(port, () => {
  console.log(`This port is running on the  http://localhost:${port}`);
});
