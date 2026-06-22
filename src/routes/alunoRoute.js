import express from 'express';
import * as controller from '../controllers/alunoController.js';

const router = express.Router();

// 1. Rotas sem parâmetros (Exatas)
router.post('/', controller.criar);
router.get('/', controller.buscarTodos);

// 2. Rota composta com ID (Coloque essa ANTES do /:id sozinho!)
// Procure por essa linha e deixe assim:
router.post('/:id/foto', controller.criarFoto);

// 3. Rotas com ID genérico (Deixe por último)
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;
