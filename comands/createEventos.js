const axios = require('axios');

const API_URL = 'http://localhost:8000/api/eventos';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pZ3VlbG5hdHVzQGdtYWlsLmNvbSIsImlhdCI6MTczMDc5MzQ3NiwiZXhwIjoxNzMwNzk3MDc2fQ.RdOFiYxlBhE_8kNjE5ddF6t5XLgM3T0aqlGeS_qblBk';

const evento = {
    produtora_id: 1,
    grupo_id: 2,
    nome: 'Meu Evento',
    local: 'Auditório Central',
    imagem: 'imagem.jpg',
    data_do_evento: '2024-12-10 19:00:00',             // Remova o 'T' e o 'Z'
    inicio_do_credenciamento: '2024-12-10 17:00:00',
    fim_do_credenciamento: '2024-12-10 18:30:00',
    descricao: 'Descrição do evento'
};

axios.post(API_URL, evento, {
  headers: {
    Authorization: `Bearer ${TOKEN}`
  }
})
.then(response => {
  console.log('Evento criado:', response.data);
})
.catch(error => {
  console.error('Erro ao criar evento:', error.response ? error.response.data : error.message);
});