function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


// pegando o livro de forma aleatória
function getRandomBook() {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            const randomIndex = getRandomInt(0, data.length);
            const randomBook = data[randomIndex];
            displayBook(randomBook);
        })
        .catch(error => console.error('Erro ao carregar os livros:', error));
}


// Inserir no HTML
function displayBook(book) {
    const bookInfoContainer = document.getElementById('book-info');
    bookInfoContainer.innerHTML = `
        <h2>${book.titulo}</h2>
        <p><strong>Autor:</strong> ${book.autor}</p>
        <p><strong>Editora:</strong> ${book.editora}</p>
        <p><strong>Número de Páginas:</strong> ${book.numeroDePaginas}</p>
        <img src="${book.imagem}" alt="${book.titulo}" style="width: 150px; height: auto;">
    `;
}
