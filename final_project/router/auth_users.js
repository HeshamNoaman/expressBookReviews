const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let usersWithSameName = users.filter((user) => user.username === username);

  return (usersWithSameName.length > 0);
}

//Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => user.username === username && user.password === password);
  return (validusers.length > 0);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");

  } else { return res.status(208).json({ message: "Invalid Login. Check username and password" }); }
});

// Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (review && books.hasOwnProperty(isbn)) {
    // add a new user review of modify old review
    books[isbn].reviews[username] = { post: review };
    res.send("thanks for you review");
  } else {
    res.send("there is and error in review");
  }

});

// delete review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books.hasOwnProperty(isbn) && username) {

    delete books[isbn].reviews[username];

    res.send("review has been deleted");
  } else {
    res.send("there is and error");
  }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
