import express from 'express';
import * as controller from '../controllers/alunoController.js';

const router = express.Router();
router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.post('/:id/foto', controller.criarFoto);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;
