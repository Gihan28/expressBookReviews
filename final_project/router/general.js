const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully!" });
  });

public_users.get('/', async function (req, res) {
    try {
    const allBooks = await getBooks();
    return res.send(JSON.stringify(allBooks,null,4));
    } catch(err) {
    return res.status(500).json({ message: "Failed to fetch all books", error: err });
    }
});

async function getBooks() {
    return books;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
 try {
  const isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
} catch(err) {
    return res.status(500).json({message: "Could not retrieve book", error: err});
}
})

async function getBookByISBN(isbn) {
    return books[isbn];
}
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
try {
  const author = req.params.author;
  let matchingBooks = await getBooksByAuthor(author)

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message : "No books found for author " + author});
  }
} catch(err) {
    return res.status(500).json({ message: "Couldnt retrieve book", error: err });
}
});

async function getBooksByAuthor(author) {
    const books = [];
    for (let key in books) {
        if (books[key].author === author) {
            books.push(books[key]);
        }
      }
      return books;
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    let foundBook = null;

    for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
            foundBook = { isbn: key, ...books[key] };
            break; // Stop after first match
        }
    }

    if (foundBook) {
        res.status(200).json(foundBook);
    } else {
        res.status(404).json({ message: `Book with title "${req.params.title}" not found.` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;

    res.status(200).json(reviews);

});

module.exports.general = public_users;
