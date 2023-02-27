// creates a book class
class Book {
  constructor(author, subject, title) {
      this.author = author;
      this.subject = subject;
      this.title = title;
      this.comments = [];
      const saveComment = JSON.parse(localStorage.getItem(`bookComments-${this.title}-${this.author}`));
      if (saveComment) {
        this.comments = saveComment;
      }
    }
    
  // adding comments to book with a max character limit of 280
    addComment(user, text) {
      const comment = {
        user,
        text: text.slice(0, 280),
        timestamp: new Date()
      };

      this.comments.push(comment);
      localStorage.setItem(`bookComments-${this.title}-${this.author}`, JSON.stringify(this.comments));
    }
    
  // removing comments from a book
    removeComment(index) {
      this.comments.splice(index, 1);
    }

    render() {
      const bookElement = document.createElement("li");
      bookElement.innerHTML = `
        <h3>${this.title}</h3>
        <ul class="comments">
        ${this.comments.map(comment => `       
          <li>
            <strong>${comment.user}:</strong> ${comment.text}
            <button class="remove-comment" data-index="${this.comments.indexOf(comment)}">Remove</button>
          </li>
        `).join('')}
      </ul>
      
      <button class="add-comment">Add Comment</button>
      <div class="comment-form" style="display: none;">
        <input type="text" class="comment-input" placeholder="Leave a comment...">
        <button class="send-comment">Send</button>
      </div>
    `;

      const addCommentButton = bookElement.querySelector('.add-comment');
      const commentForm = bookElement.querySelector('.comment-form');
      const commentInput = bookElement.querySelector('.comment-input');
      const sendCommentButton = bookElement.querySelector('.send-comment');
      const removeCommentButtons = bookElement.querySelectorAll('.remove-comment');
      
      // add event listener to the add comment button
        addCommentButton.addEventListener('click', () => {
          addCommentButton.style.display = 'none';
          commentForm.style.display = 'block';
        });
      
      // add event listener to the send comment button
        sendCommentButton.addEventListener('click', () => {
          const commentText = commentInput.value.trim();
          if (commentText) {
            this.addComment('User', commentText);
            commentInput.value = '';
            commentForm.style.display = 'none';
            addCommentButton.style.display = 'block';
            bookElement.innerHTML = '';
            bookElement.appendChild(this.render());
          }
        });
      
      // add event listeners to the remove comment button
         removeCommentButtons.forEach(button => {
          button.removeEventListener('click', () => {});
          button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            this.removeComment(index);
            bookElement.innerHTML = '';
            bookElement.appendChild(this.render());
          });
        });        
          return bookElement;
        }
      }

      // creates a bookshelf class
      class Bookshelf {
        constructor() {
          this.books = [];
        }
        addBook(book) {
          this.books.push(book);
        }
          
        render() {
      // creating a new unordered list for the bookshelf
          const bookshelfElement = document.createElement("ul");
          this.books.forEach(book => {
            const bookElement = book.render();
            bookshelfElement.appendChild(bookElement);
          });

          return bookshelfElement;
      }  
}

// creating a bookshelf class
class bookShelf {
  constructor() {
      this.books = [];
  }

  // allowing it to add books to the bookshelf as well as to the array
  addBook(book) {
      this.books.push(book);
  }
  render() {
      // creates an unordered list to hold all the books
      const shelfElement = document.createElement('ul');
      this.books.forEach(book => {
          const bookElement = book.render();
          shelfElement.appendChild(bookElement);
      });
      return shelfElement;
  }
}

const shelf = new bookShelf();
bookData.forEach(data => {
  const book = new Book(data.author, data.subject, data.title)
  if (data.language) {
      book.language = data.language;
  }
  shelf.addBook(book);
});

const shelfElement = document.createElement('div');
  shelfElement.appendChild(shelf.render());
  document.body.appendChild(shelfElement);

const addBookForm = document.getElementById('add-book-form');
  addBookForm.addEventListener('submit', (event) => {
      event.preventDefault();

  const addTitle = document.getElementById('add-title');
  const addAuthor = document.getElementById('add-author');
  const addSubject = document.getElementById('add-subject');
  const addLanguage = document.getElementById('add-language');
  
  const newBook = new Book(addTitle.value, addAuthor.value, addSubject.value);
  if (addLanguage.value) {
      newBook.language = addLanguage.value;
  }

  // add the new book to the bookshelf
  shelf.addBook(newBook);
  
  // clear old bookshelf and render the updated bookshelf
  shelfElement.innerHTML = '';
  shelfElement.appendChild(shelf.render());
  addBookForm.reset();
  });
