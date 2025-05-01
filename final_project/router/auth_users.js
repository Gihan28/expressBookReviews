const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "username", "password": "password"}];
const JWT_SECRET = "my-secret-token";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign({ username: user.username }, "my-secret-key", { expiresIn: '1h' });

    res.json({
        message: 'Login successful',
        token
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    if (!req.user || !req.user.username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    const username = req.user.username;
  
    if (!review) {
      return res.status(400).json({ message: "Review query parameter is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update the review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    if (!req.user || !req.user.username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const bookReviews = books[isbn].reviews;
  
    if (!bookReviews[username]) {
      return res.status(404).json({ message: "No review by this user to delete" });
    }
  
    // Delete the review
    delete bookReviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: bookReviews
    });
  });
  
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
