const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let existing_users = users.filter((user) => user.username === username);

    if (existing_users.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. (Username or password missing)" });
});


public_users.get('/', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
      resolve(books);
    });
  
    myPromise.then((booksList) => {
      res.send(JSON.stringify(booksList, null, 4));
    });
  });


  public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let myPromise = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found with that ISBN");
      }
    });
  
    myPromise.then((book) => {
      res.send(book);
    }).catch((errorMessage) => {
      res.send(errorMessage);
    });
  });


public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
    let booksArray = [];
let allISBNs = Object.keys(books);

allISBNs.forEach(isbn => {
  let currentBook = books[isbn];
  if (currentBook.author === author) {
    booksArray.push(currentBook);
  }
});


if (booksArray.length > 0) {
  resolve(booksArray); 
} else {
  reject("No books found for that author"); 
};
});
myPromise.then((booksList) => {
    res.send(booksList);
}).catch((errorMessage) => {
    res.send(errorMessage);
});


});


public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let myPromise = new Promise((resolve, reject) => {
      let booksArray = [];
      let allISBNs = Object.keys(books);
      
      allISBNs.forEach(isbn => {
        let currentBook = books[isbn];
        if (currentBook.title === title) {
          booksArray.push(currentBook);
        }
      });
  
      if (booksArray.length > 0) {
        resolve(booksArray);
      } else {
        reject("No books found with that title");
      }
    });
  
    myPromise.then((booksList) => {
      res.send(booksList);
    }).catch((errorMessage) => {
      res.send(errorMessage);
    });
  });


public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    let reviews = books[isbn].reviews;
    res.send(reviews);
  } else {
    res.send("Unable to find the book with that ISBN");
  }
});

module.exports.general = public_users;