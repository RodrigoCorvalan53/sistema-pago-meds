const pool = require('../../Config/db');
const bcrypt = require('bcrypt');

class UserService {

async createUser(nombre_completo, email, password) {
  const exists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (exists.rowCount > 0) throw new Error('EMAIL_IN_USE');

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO usuarios (nombre_completo, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nombre_completo, email, activo, created_at
    `,
    [nombre_completo, email, hash]
  );

  return result.rows[0];
}

  async updateUser(id, nombre_completo, email, password) {
    const userExists = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userExists.rowCount === 0) throw new Error('NOT_FOUND');

    let hash = null;
    if (password) hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      UPDATE usuarios
      SET nombre_completo = $1,
          email = $2,
          password_hash = COALESCE($3, password_hash),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, nombre_completo, email, activo, created_at, updated_at
      `,
      [nombre_completo, email, hash, id]
    );

    return result.rows[0];
  }

  async deactivateUser(id) {
    const exists = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (exists.rowCount === 0) throw new Error('NOT_FOUND');

    const result = await pool.query(
      `
      UPDATE usuarios
      SET activo = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, nombre_completo, email, activo
      `,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = new UserService();
