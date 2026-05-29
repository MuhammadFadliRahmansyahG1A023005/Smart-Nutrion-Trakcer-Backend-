const { Users } = require('../db/dbHelper');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Akses ditolak. Token tidak valid atau tidak disediakan.' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: 'Akses ditolak. Token tidak valid.' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Akses ditolak. Pengguna tidak ditemukan.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
