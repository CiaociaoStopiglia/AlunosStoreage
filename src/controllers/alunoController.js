import AlunoModel from '../models/alunoModel.js';
import {
    upload as uploadViaUrl,
    deletar as deletarStorage
} from '../lib/helpers/arquivoHelper.js'

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, turma, materia, foto } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
         if (!turma) {
             return res.status(400).json({ error: 'O campo "turma" é obrigatório!' });
         }
         if (!materia) {
             return res.status(400).json({ error: 'O campo "materia" é obrigatório!' });
         }

        const aluno = new AlunoModel({ nome, turma, materia, foto: foto || null });
        const data = await aluno.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await AlunoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: aluno });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            aluno.nome = req.body.nome;
        }
        if (req.body.turma !== undefined) {
            aluno.turma = req.body.turma;
        }
        if (req.body.materia !== undefined) {
            aluno.materia = req.body.materia;
        }
        if (req.body.foto !== undefined) {
            aluno.foto = req.body.foto;
        }

        const data = await aluno.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await aluno.deletar();

        return res.status(200).json({ message: `O registro "${aluno.nome}" foi deletado com sucesso!`, deletado: aluno });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};

export const atualizarFoto = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Id inválido' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));
        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        const imageUrl = req.body ? (req.body.url || req.body.foto) : null;

        if (!imageUrl) {
            return res
                .status(400)
                .json({ error: 'Envie um link na propriedade "url" ou "foto" via JSON.' });
        }

        if (aluno.foto) {
            try {
                await deletarStorage(aluno.foto);
            } catch (err) {
                console.error('Erro ao deletar foto antiga:', err)
            }
        }

        const fotoUrl = await uploadViaUrl(parseInt(id), imageUrl);

        aluno.foto = fotoUrl;
        const data = await aluno.atualizar();

        return res.status(200).json({
            message: ' Foto update com sucesso!',
            url: data.foto,
            data
        });
    } catch (error) {
        console.error('Erro ao fazer upload da foto:', error);
        return res.status(500).json({ error: 'Erro ao fazer upload/processamento da foto do aluno.' });
    }
};
