/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
// lib/services/jwtService.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
