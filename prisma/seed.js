import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela exemplo...');

    // Remove todos os registros
    // await prisma.exemplo.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.exemplo.createMany({
        data: [
            {nome: 'Ricardo Stopiglia', turma: '3TDS', materia: 'Desenvolvimento de APIs', foto: null },
            { nome: 'Maria Silva', turma: '3TDS', materia: 'Banco de Dados', foto: null },
            { nome: 'João Souza', turma: '2TDS', materia: 'Programação Web', foto: null },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
