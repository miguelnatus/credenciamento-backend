// const base64Key = Buffer.from('9285d9beb4d977dc43fd2b2e446ab4c8', 'hex').toString('base64');
// console.log(base64Key);
const key = require('crypto').randomBytes(64).toString('hex');
console.log(key);