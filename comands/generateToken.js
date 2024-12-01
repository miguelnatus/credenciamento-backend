import jwt from 'jsonwebtoken';

const SECRET_KEY = 'a3f96e8f2a6d1e4d9a8cb736f18cfe2c2df1208e4bf4568fc1a24e5b362df03f6b4a9e2e4827a47f2f5c6a483dbbc1de';

const payload = { id: 1, email: 'test@example.com' };
const options = { algorithm: 'HS512' };

const token = jwt.sign(payload, SECRET_KEY, options);

console.log('Token:', token);
