const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const app = express();

const storageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'));
    },
    filename: function (req, file, cb) {
        var nome = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, Date.now() + '-' + nome);
    }
});
var upload = multer({ storage: storageImg, limits: { fileSize: 5 * 1024 * 1024 } });


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

const autenticarAdmin = (req, res, next) => {
    if (req.session.autenticado && req.session.papel === 'admin') return next();
    res.redirect('/login');
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

app.get('/logout', (req, res) => {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') {
        req.session.autenticado = true;
        req.session.papel = 'admin';
    } else if (usuario === 'aluno' && senha === '123') {
        req.session.autenticado = true;
        req.session.papel = 'aluno';
    } else {
        return res.send('Acesso negado! Use aluno/123 ou admin/123.');
    }
    req.session.save(function (err) {
        if (err) return res.send('Erro ao iniciar sessão.');
        res.redirect('/');
    });
});

app.get('/detalhes/:id', autenticar, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html')); 
});

app.get('/api/session', (req, res) => {
    if (!req.session.autenticado) {
        return res.json({ autenticado: false });
    }
    res.json({ autenticado: true, papel: req.session.papel });
});

app.get('/admin/cursos', autenticarAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-cursos.html'));
});

app.post('/api/upload', autenticarAdmin, upload.single('arquivo'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    res.json({ path: '/images/' + req.file.filename });
});

const cursosRouter = require('./routes/cursos');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/cursos', cursosRouter);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

