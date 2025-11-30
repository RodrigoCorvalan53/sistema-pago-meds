const router = require('express').Router();
const userController = require('../Controllers/user.controller');
const verifyToken = require('../Middleware/verifytoken');

router.post('/', verifyToken, (req, res) => userController.create(req, res));
router.put('/:id', verifyToken, (req, res) => userController.update(req, res));
router.patch('/:id/deactivate', verifyToken, (req, res) => userController.deactivate(req, res));

module.exports = router;
