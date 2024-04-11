const jwt = require("jsonwebtoken");

exports.verifyAccessToken = (req, res, next) => {
  // Ambil token dari header permintaan
  const bearerToken = req.headers.authorization;
  const token = bearerToken && bearerToken.split(" ")[1];

  // Periksa apakah token ada
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Tambahkan payload token ke objek permintaan untuk digunakan di handler rute
    req.user = decoded;
    // Lanjutkan ke handler rute berikutnya
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
