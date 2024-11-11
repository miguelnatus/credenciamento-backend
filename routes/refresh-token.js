const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'secreta';

router.post('/', (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(401).json({ message: 'Token de atualização ausente' });

  jwt.verify(refresh_token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    const newAccessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '7d' });

    res.json({ access: newAccessToken, refresh: newRefreshToken });
  });
});

module.exports = router;
