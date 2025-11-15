const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}


regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 }); 

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  let username = req.session.authorization.username;
  if (books[isbn]) {
    let bookReview = books[isbn].reviews;
    bookReview[username] = review;
  
    books[isbn].reviews = bookReview; 
    return res.status(200).json({ message: "The review has been added/updated" });
  } else {
    return res.status(404).json({ message: "Unable to find the book" });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;
  
  if (books[isbn]) {
    let bookReviews = books[isbn].reviews;
    if (bookReviews[username]) { 
      delete bookReviews[username];
      return res.status(200).send(`The review for the user ${username} has been deleted`);
    } else {
      return res.status(404).send("Review not found for this user");
    }
  } else {
    return res.status(404).send("Unable to find book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;