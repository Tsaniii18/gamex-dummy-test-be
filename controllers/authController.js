import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../middlewares/authMiddleware.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ msg: 'Invalid password' });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

   res.cookie('accessToken', accessToken, {
      httpOnly: false,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      secure: true,
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        refresh_token: refreshToken
      }
    });
    
    if (!user) return res.sendStatus(403);
    
    const newAccessToken = generateAccessToken(user.id);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    });
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.sendStatus(403);
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(204);
  
  await User.update({ refresh_token: null }, { where: { refresh_token: refreshToken } });
  res.clearCookie('accessToken');
  res.sendStatus(200);
};