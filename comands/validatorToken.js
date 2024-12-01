import jwt from 'jsonwebtoken';

const SECRET_KEY = 'a3f96e8f2a6d1e4d9a8cb736f18cfe2c2df1208e4bf4568fc1a24e5b362df03f6b4a9e2e4827a47f2f5c6a483dbbc1de';

const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzMzMDM5NDYxfQ.N3O5UamkMgIW0LNMZAWrZv7th6GAqH_yeHCNZsdlDcdNv2Ts7TjnQSkmgZ4OMJyZZdmbVTeaxc28He091xAQ2g';

try {
  const decoded = jwt.verify(token, SECRET_KEY, { algorithms: ['HS512'] });
  console.log('Token válido:', decoded);
} catch (err) {
  console.error('Token inválido:', err.message);
}