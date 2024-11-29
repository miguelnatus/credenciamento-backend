const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

// Configuração do Wasabi
const wasabiEndpoint = new AWS.Endpoint('s3.wasabisys.com');
const s3 = new AWS.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  region: 'us-east-1' // Ajuste conforme a região do seu bucket
});

// Função para enviar um arquivo
async function uploadFile(filePath, bucketName, key) {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent
    };

    const data = await s3.upload(params).promise();
    console.log(`Arquivo enviado com sucesso. URL: ${data.Location}`);
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
  }
}

// Exemplo de uso
const filePath = 'bucket/arquivo.txt';
const bucketName = 'credenciamento';
const key = 'arquivo.txt';

uploadFile(filePath, bucketName, key);