document.getElementById('search-button').addEventListener('click', function () {
    let query = document.getElementById('search-input').value.trim();
    if (query) {
        fetchBooks(query);
    }
});

function fetchBooks(query) {
    const loading = document.getElementById('loading');
    const bookList = document.getElementById('book-list');

    loading.style.display = 'block';
    bookList.innerHTML = '';

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';  // Hide the loading indicator
            if (data.docs && data.docs.length > 0) {
                displayBooks(data.docs);
            } else {
                displayError();
            }
        })
        .catch(() => displayError());
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach(book => {
        const title = book.title ? book.title : 'Title not available';
        const authors = book.author_name ? book.author_name.join(', ') : 'Author not available';
        const publishYear = book.first_publish_year ? book.first_publish_year : 'Year not available';
        const imgSrc = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150';

        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <img src="${imgSrc}" alt="${title}">
            <h2>${title}</h2>
            <p><strong>Author:</strong> ${authors}</p>
            <p><strong>Year:</strong> ${publishYear}</p>
        `;
        bookItem.addEventListener('click', function () {
            showDescriptionModal(book);
        });
        bookList.appendChild(bookItem);
    });
}

function showDescriptionModal(book) {
    const descriptionModal = document.createElement('div');
    descriptionModal.className = 'book-description-modal';
    descriptionModal.innerHTML = `
        <img src="${book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150'}" alt="${book.title}">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author_name ? book.author_name.join(', ') : 'Author not available'}</p>
        <p><strong>Published Year:</strong> ${book.first_publish_year ? book.first_publish_year : 'Year not available'}</p>
        <p><strong>Publisher:</strong> ${book.publisher ? book.publisher.join(', ') : 'Publisher not available'}</p>
        <p><strong>Description:</strong></p>
        <p>${book.first_sentence ? book.first_sentence.join(' ') : 'Description not available'}</p>
        <button id="close-button">Close</button>
    `;
    document.body.appendChild(descriptionModal);
    descriptionModal.style.display = 'block';

    document.getElementById('close-button').addEventListener('click', function () {
        descriptionModal.remove();
    });
}

function displayError() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '<p>No books found with the provided query.</p>';
    document.getElementById('loading').style.display = 'none';
}
