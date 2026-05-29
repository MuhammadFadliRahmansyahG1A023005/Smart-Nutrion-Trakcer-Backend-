const { Logs } = require('../db/dbHelper');
const foodController = require('./foodController');

// Calculate nutrition for specific weight in grams based on 100g base values
function scaleNutrition(food, gram) {
  const factor = gram / 100;
  return {
    kkal: parseFloat((food.kkal * factor).toFixed(1)),
    protein: parseFloat((food.protein * factor).toFixed(1)),
    fat: parseFloat((food.fat * factor).toFixed(1)),
    carbohydrate: parseFloat((food.carbohydrate * factor).toFixed(1)),
    kalsium: parseFloat((food.kalsium * factor).toFixed(1)),
    zatBesi: parseFloat((food.zatBesi * factor).toFixed(1)),
    kalium: parseFloat((food.kalium * factor).toFixed(1)),
    vitC: parseFloat((food.vitC * factor).toFixed(1)),
    water: parseFloat((food.water * factor).toFixed(1))
  };
}

exports.getLogsByDate = async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: 'Parameter tanggal (date) wajib disertakan (format: YYYY-MM-DD).' });
    }

    const rawLogs = await Logs.getByUserAndDate(req.user.id, date);
    
    // Scale nutrient values for each log
    const scaledLogs = rawLogs.map(log => ({
      ...log,
      nutrition: scaleNutrition(log.food, log.gram)
    }));

    // Calculate totals for the day
    const totals = scaledLogs.reduce((acc, log) => {
      const n = log.nutrition;
      return {
        kkal: parseFloat((acc.kkal + n.kkal).toFixed(1)),
        protein: parseFloat((acc.protein + n.protein).toFixed(1)),
        fat: parseFloat((acc.fat + n.fat).toFixed(1)),
        carbohydrate: parseFloat((acc.carbohydrate + n.carbohydrate).toFixed(1)),
        kalsium: parseFloat((acc.kalsium + n.kalsium).toFixed(1)),
        zatBesi: parseFloat((acc.zatBesi + n.zatBesi).toFixed(1)),
        kalium: parseFloat((acc.kalium + n.kalium).toFixed(1)),
        vitC: parseFloat((acc.vitC + n.vitC).toFixed(1))
      };
    }, { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });

    res.json({
      date,
      logs: scaledLogs,
      totals
    });
  } catch (err) {
    console.error('Get logs by date error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil log makanan.' });
  }
};

exports.createLog = async (req, res) => {
  try {
    const { date, mealType, foodCode, gram, customFood } = req.body;
    
    if (!date || !mealType || !gram) {
      return res.status(400).json({ error: 'Tanggal, jenis makan, dan berat makanan wajib diisi.' });
    }

    let foodItem = null;

    if (foodCode) {
      const foodsArray = foodController.getFoodsArray();
      foodItem = foodsArray.find(f => f.id === foodCode);
    } else if (customFood) {
      foodItem = customFood;
    }

    if (!foodItem) {
      return res.status(404).json({ error: 'Bahan makanan tidak ditemukan.' });
    }

    const newLog = await Logs.create({
      userId: req.user.id,
      date,
      mealType,
      food: foodItem,
      gram: parseFloat(gram)
    });

    res.status(201).json({
      message: 'Makanan berhasil dicatat!',
      log: {
        ...newLog,
        nutrition: scaleNutrition(newLog.food, newLog.gram)
      }
    });
  } catch (err) {
    console.error('Create log error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat mencatat makanan.' });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Logs.delete(id, req.user.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Catatan makanan tidak ditemukan atau tidak dapat dihapus.' });
    }

    res.json({ message: 'Catatan makanan berhasil dihapus!' });
  } catch (err) {
    console.error('Delete log error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat menghapus makanan.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const rawLogs = await Logs.getByUserHistory(req.user.id);
    
    // Group logs by date
    const historyMap = {};
    
    rawLogs.forEach(log => {
      const date = log.date;
      const nutrition = scaleNutrition(log.food, log.gram);
      
      if (!historyMap[date]) {
        historyMap[date] = {
          date,
          kkal: 0,
          protein: 0,
          fat: 0,
          carbohydrate: 0,
          kalsium: 0,
          zatBesi: 0,
          kalium: 0,
          vitC: 0,
          mealsCount: new Set()
        };
      }
      
      historyMap[date].kkal += nutrition.kkal;
      historyMap[date].protein += nutrition.protein;
      historyMap[date].fat += nutrition.fat;
      historyMap[date].carbohydrate += nutrition.carbohydrate;
      historyMap[date].kalsium += nutrition.kalsium;
      historyMap[date].zatBesi += nutrition.zatBesi;
      historyMap[date].kalium += nutrition.kalium;
      historyMap[date].vitC += nutrition.vitC;
      historyMap[date].mealsCount.add(log.mealType);
    });

    const historyArray = Object.values(historyMap).map(day => ({
      ...day,
      kkal: parseFloat(day.kkal.toFixed(1)),
      protein: parseFloat(day.protein.toFixed(1)),
      fat: parseFloat(day.fat.toFixed(1)),
      carbohydrate: parseFloat(day.carbohydrate.toFixed(1)),
      kalsium: parseFloat(day.kalsium.toFixed(1)),
      zatBesi: parseFloat(day.zatBesi.toFixed(1)),
      kalium: parseFloat(day.kalium.toFixed(1)),
      vitC: parseFloat(day.vitC.toFixed(1)),
      mealsCount: day.mealsCount.size
    }));

    // Sort chronologically
    historyArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(historyArray);
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil riwayat gizi.' });
  }
};
