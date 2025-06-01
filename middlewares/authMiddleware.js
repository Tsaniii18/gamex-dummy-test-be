import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
    if (error) return res.sendStatus(403);
    try {
      req.user = await User.findByPk(decoded.userId);
      next();
    } catch (err) {
      return res.sendStatus(500);
    }
  });
};
