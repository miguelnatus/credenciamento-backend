const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const empresas = [
  { nome: 'Empresa 1', cnpj: '12.345.678/0001-01', endereco: 'Rua Exemplo 1, 123', telefone: '(11) 1234-5671', email: 'contato1@empresa.com' },
  { nome: 'Empresa 2', cnpj: '12.345.678/0001-02', endereco: 'Rua Exemplo 2, 123', telefone: '(11) 1234-5672', email: 'contato2@empresa.com' },
  { nome: 'Empresa 3', cnpj: '12.345.678/0001-03', endereco: 'Rua Exemplo 3, 123', telefone: '(11) 1234-5673', email: 'contato3@empresa.com' },
  // Adicione mais empresas fictícias aqui até ter 30
  { nome: 'Empresa 30', cnpj: '12.345.678/0001-30', endereco: 'Rua Exemplo 30, 123', telefone: '(11) 1234-5690', email: 'contato30@empresa.com' },
];

async function createEmpresas() {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    await connection.beginTransaction();

    for (const empresa of empresas) {
      await connection.query(
        'INSERT INTO empresas (nome, cnpj, endereco, telefone, email) VALUES (?, ?, ?, ?, ?)',
        [empresa.nome, empresa.cnpj, empresa.endereco, empresa.telefone, empresa.email]
      );
    }

    await connection.commit();
    console.log('Empresas criadas com sucesso!');
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar empresas:', error);
  } finally {
    await connection.end();
  }
}

createEmpresas();