const CursoDAO = require('../config/CursoDAO');

async function listar(req, res) {
    try {
        const dados = await CursoDAO.listarCursos();
        res.json(dados);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const dados = await CursoDAO.buscarCursoPorId(req.params.id);
        if (!dados) return res.status(404).json({ error: 'Curso não encontrado' });
        res.json(dados);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function criar(req, res) {
    try {
        const id = await CursoDAO.criarCurso(req.body);
        res.status(201).json({ id, mensagem: 'Curso criado com sucesso' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function atualizar(req, res) {
    try {
        await CursoDAO.atualizarCurso(req.params.id, req.body);
        res.json({ mensagem: 'Curso atualizado com sucesso' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function excluir(req, res) {
    try {
        await CursoDAO.deletarCurso(req.params.id);
        res.json({ mensagem: 'Curso excluído com sucesso' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
