const pool = require('../../Config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../../Config/jwt');

class AuthService {
  
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