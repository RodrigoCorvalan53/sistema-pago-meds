const pool = require('../../Config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../../Config/jwt');

class AuthService {
  async register(nombre_completo, email, password) {
    const exists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (exists.rowCount > 0) throw new Error('EMAIL_IN_USE');

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre_completo, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre_completo, email',
      [nombre_completo, email, hash]
    );

    return result.rows[0];
  }

  async login(email, password) {
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND activo = true', [email]);
    if (user.rowCount === 0) throw new Error('INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    return { token };
  }
}

module.exports = new AuthService();