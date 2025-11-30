const authService = require('../Services/auth.service');
const validateEmail = require('../Utils/validateemail');

class AuthController {

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'MISSING_FIELDS' });

      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }
}

module.exports = new AuthController();