import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';


// ---------- LIVROS ----------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const booksFilePath = path.join(__dirname, 'books.json');

app.use(express.json());

//  ler arquivo JSON
const readBooksFromFile = () => {
    const data = fs.readFileSync(booksFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeBooksToFile = (books) => {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
};

// rota para obter os livros
app.get('/api/books', (req, res) => {
    const books = readBooksFromFile();
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
    const books = readBooksFromFile();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Livro não encontrado');
    res.json(book);
});

// rota para adicionar livro
app.post('/api/books', (req, res) => {
    const books = readBooksFromFile();
    const { titulo, autor, editora, numeroDePaginas } = req.body;
    const book = {
        id: books.length + 1,
        titulo,
        autor,
        editora,
        numeroDePaginas
    };
    books.push(book);
    writeBooksToFile(books);
    res.status(201).json(book);
});

// rota para atualizar um livro existente
app.put('/api/books/:id', (req, res) => {
    const books = readBooksFromFile();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Livro não encontrado');

    const { titulo, autor, editora, numeroDePaginas, } = req.body;
    book.titulo = titulo;
    book.autor = autor;
    book.editora = editora;
    book.numeroDePaginas = numeroDePaginas;

    writeBooksToFile(books);
    res.json(book);
});

// rota para deletar um livro
app.delete('/api/books/:id', (req, res) => {
    let books = readBooksFromFile();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).send('Livro não encontrado');

    const deletedBook = books.splice(bookIndex, 1);
    writeBooksToFile(books);
    res.json(deletedBook);
});



//  ---------- LOGIN ----------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



const usuarios = [
    { id: 1, nome: 'UsuarioTeste', email: 'usuario@teste.com', senha: 'senha123' }
];


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});



app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario || usuario.senha !== senha) {
        return res.status(401).send('Credenciais inválidas');
    }

    res.redirect('/');

});



// ---------- CADASTRO ----------

app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).send('Este email já está cadastrado');
    }

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha
    };

    usuarios.push(novoUsuario);

    res.redirect('/login.html');
});




// ---------- SERVER ----------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public",'index.html'));
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
