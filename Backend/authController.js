const bcrypt = require('bcryptjs');
const { Users } = require('../db/dbHelper');

// Standard nutritional values (AKG PMK 2019)
// Calculates dynamic AKG values based on child's age in years
function calculateAKG(childProfile) {
  if (!childProfile) return null;
  
  // Calculate age from birthdate
  const birthDate = new Date(childProfile.tanggalLahir);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Golden age groups: 1-3 years and 4-6 years
  if (age <= 3) {
    return {
      kkal: 1350,
      protein: 20,
      kalsium: 650,
      zatBesi: 7,
      kalium: 2600,
      karbohidrat: 215,
      lemakBaik: 45,
      vitC: 40
    };
  } else {
    return {
      kkal: 1400,
      protein: 25,
      kalsium: 1000,
      zatBesi: 10,
      kalium: 2700,
      karbohidrat: 220,
      lemakBaik: 50,
      vitC: 45
    };
  }
}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    const existingUser = await Users.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Registrasi berhasil!',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat registrasi.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    const user = await Users.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    const akg = calculateAKG(user.childProfile);

    res.json({
      message: 'Login berhasil!',
      token: user.id, // Using user ID as a simple token
      user: {
        id: user.id,
        username: user.username,
        childProfile: user.childProfile,
        akgTargets: akg
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat login.' });
  }
};

exports.personalize = async (req, res) => {
  try {
    const profile = req.body; // namaAnak, tanggalLahir, jenisKelamin, tinggiBadan, beratBadan, alergi, kondisiKhusus
    if (!profile.namaAnak || !profile.tanggalLahir || !profile.jenisKelamin) {
      return res.status(400).json({ error: 'Nama anak, tanggal lahir, dan jenis kelamin wajib diisi.' });
    }

    const updatedProfile = await Users.updateChildProfile(req.user.id, profile);
    const akg = calculateAKG(updatedProfile);

    res.json({
      message: 'Profil anak berhasil disimpan!',
      childProfile: updatedProfile,
      akgTargets: akg
    });
  } catch (err) {
    console.error('Personalization error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat menyimpan profil anak.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const akg = calculateAKG(req.user.childProfile);
    res.json({
      id: req.user.id,
      username: req.user.username,
      childProfile: req.user.childProfile,
      akgTargets: akg
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil data profil.' });
  }
};

exports.calculateAKG = calculateAKG;
