import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const msg = `${!username ? "Username" : !email ? "Email" : "Password"} field cannot be empty!`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      status: 'Success',
      message: 'User Registered',
      userId: user.id
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const userPlain = user.toJSON();
      const { password: _, refresh_token: __, ...safeUserData } = userPlain;

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        const error = new Error("Password atau email salah");
        error.statusCode = 400;
        throw error;
      }

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        status: "Success",
        message: "Login Berhasil",
        safeUserData,
        accessToken
      });

    } else {
      const error = new Error("Password atau email salah");
      error.statusCode = 400;
      throw error;
    }

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({
      where: { refresh_token: refreshToken }
    });

    if (!user?.refresh_token) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );

  } catch (error) {
    console.error('Refresh token error:', error);
    res.sendStatus(403);
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({
    where: { refresh_token: refreshToken }
  });

  if (!user?.refresh_token) return res.sendStatus(204);

  await User.update({ refresh_token: null }, { where: { id: user.id } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
