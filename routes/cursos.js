const express = require('express');
const router = express.Router();
const CursoDAO = require('../config/CursoDAO');

router.get('/', async (_req, res) => {
    try {
        const cursos = await CursoDAO.listarCursos();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const curso = await CursoDAO.buscarCursoPorId(req.params.id);
        if (!curso) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }
        res.json(curso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const curso = req.body;
        const id = await CursoDAO.criarCurso(curso);
        res.status(201).json({ id, mensagem: 'Curso criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const curso = req.body;
        await CursoDAO.atualizarCurso(req.params.id, curso);
        res.json({ mensagem: 'Curso atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await CursoDAO.deletarCurso(req.params.id);
        res.json({ mensagem: 'Curso deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;