function apenasAdminApi(req, res, next) {
    if (req.session && req.session.autenticado && req.session.papel === 'admin') {
        return next();
    }
    res.status(403).json({ error: 'Acesso negado: apenas administrador' });
}

module.exports = { apenasAdminApi };
