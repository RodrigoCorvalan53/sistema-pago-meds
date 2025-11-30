const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../Config/jwt');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ error: 'NO_TOKEN_PROVIDED' });

  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token)
    return res.status(401).json({ error: 'INVALID_TOKEN_FORMAT' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
};
