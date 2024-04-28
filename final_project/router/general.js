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

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  })
}

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  getBookList()
    .then(bookList => res.send(JSON.stringify(bookList, null, 4)))
    .catch(error => {
      console.error('Error fetching book list:', error);
      res.status(500).send('Error fetching book list');
    })
});

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books.hasOwnProperty(isbn)) {
      resolve(books[isbn])
    } else {
      reject(new Error("The provided book does not exist"))
    }
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  getBookByISBN(isbn)
    .then(
      (book) => res.send(book),
      (err) => res.status(404).send(err.message)
    );
});

function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {

    for (let key in books) {
      if (books[key].author.includes(author)) {
        resolve(books[key])
      }
    }
    reject(new Error("there is no author found"))

  })
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  getBookByAuthor(author)
    .then(
      (book) => res.send(book),
      (err) => res.status(404).send(err.message)
    )
});

function getBookByTitle(title) {
  return new Promise((resolve, reject) => {

    for (let key in books) {
      if (books[key].title.includes(title)) {
        // to get single book
        resolve(books[key])
      }
    }
    // if there is no match display error message
    reject(new Error("there is no book found"));
  })
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  getBookByTitle(title)
    .then(
      (book) => res.send(book),
      (err) => res.status(404).send(err.message)
    )
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
