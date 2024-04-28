const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (isbn > 0 && isbn < 11) {
    res.send(books[isbn]);
  } else {
    res.send("please provide a valid isbn form 1 to 12");
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const founded = [];

  for (let key in books) {
    if (books[key].author.includes(author)) {
      founded.push(books[key]);
      // or use to get single item
      // res.send(books[key]);
    }
  }

  if (founded.length > 0) {
    res.send(founded);
  } else {
    // if there is no match display error message
    res.send("there is no author found");
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  for (let key in books) {
    if (books[key].title.includes(title)) {
      // to get single book
      return res.send(books[key]);
    }
  }

  // if there is no match display error message
  return res.send("there is no book found");
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  if (isbn > 0 && isbn < 11) {

    const reviews = books[isbn].reviews;

    if (Object.keys(reviews).length === 0) {
      res.send('this book has not been reviewed yet');
    } else {
      res.send(reviews);
    }

  } else {
    res.send("please provide a valid isbn form 1 to 12");
  }

});

module.exports.general = public_users;
