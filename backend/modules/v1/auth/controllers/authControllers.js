const authService = require('../services/authServices');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema
} = require('../../../../validations/authValidation');

// Register
const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await authService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  register,
  login,
  changePassword,
  getProfile
};
