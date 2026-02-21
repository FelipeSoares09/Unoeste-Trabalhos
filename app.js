const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'educajf-secret',
    resave: false,
    saveUninitialized: true
}));


const autenticar = (req, res, next) => {
    if (req.session.autenticado) return next();
    res.redirect('/login');
};

// Rotas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') {
        req.session.autenticado = true;
        res.redirect('/');
    } else {
        res.send('Acesso negado!');
    }
});

app.get('/detalhes/:id', autenticar, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html')); 
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));