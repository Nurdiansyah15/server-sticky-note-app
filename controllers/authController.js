const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { Op } = require("sequelize");
const blacklist = new Set();

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  console.log(identifier, password);
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const payload = { id: user.id, username: user.username, email: user.email };

    const token = jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    const refreshToken = jsonwebtoken.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET
    );

    res.status(200).json({ payload, token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    user.password = undefined;
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  const bearerToken = req.headers.authorization;
  const refreshToken = bearerToken && bearerToken.split(" ")[1];
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });
  }
  blacklist.add(refreshToken);
  res.status(200).json("logged out");
};

exports.refresh = async (req, res) => {
  // const refreshToken = req.body.refreshToken;
  const bearerToken = req.headers.authorization;
  const refreshToken = bearerToken && bearerToken.split(" ")[1];

  if (blacklist.has(refreshToken)) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Refresh token has been blacklisted" });
  }
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });
  }
  try {
    const decoded = jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid refresh token" });
    }

    const payload = { id: user.id, username: user.username, email: user.email };

    const token = jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    return res.status(200).json({ payload, token, refreshToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid refresh token" });
  }
};
