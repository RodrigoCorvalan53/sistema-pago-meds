const userService = require('../Services/user.service');

class UserController {

async create(req, res) {
  try {
    const { nombre_completo, email, password } = req.body;

    if (!nombre_completo || !email || !password)
      return res.status(400).json({ error: 'MISSING_FIELDS' });

    const user = await userService.createUser(nombre_completo, email, password);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'EMAIL_IN_USE')
      return res.status(409).json({ error: 'EMAIL_IN_USE' });

    res.status(500).json({ error: 'SERVER_ERROR' });
  }
}

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre_completo, email, password } = req.body;

      if (!nombre_completo || !email)
        return res.status(400).json({ error: 'MISSING_FIELDS' });

      const user = await userService.updateUser(id, nombre_completo, email, password);
      res.status(200).json(user);
    } catch (err) {
      if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'USER_NOT_FOUND' });
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }

  async deactivate(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.deactivateUser(id);
      res.status(200).json(user);
    } catch (err) {
      if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'USER_NOT_FOUND' });
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }
}

module.exports = new UserController();
