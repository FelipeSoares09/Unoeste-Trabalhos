const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/CursoController');
const { apenasAdminApi } = require('../middlewares/auth');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', apenasAdminApi, ctrl.criar);
router.put('/:id', apenasAdminApi, ctrl.atualizar);
router.delete('/:id', apenasAdminApi, ctrl.excluir);

module.exports = router;
