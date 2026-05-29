const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Logs } = require('../db/dbHelper');
const authController = require('./authController');

const RULES_PATH = path.join(__dirname, '../ml/model_rules.json');
const PYTHON_PREDICT_PATH = path.join(__dirname, '../ml/predict.py');

// Robust JavaScript Fallback Prediction Engine (matches predict.py exactly)
function runJsPrediction(inputs) {
  const target_kkal = parseFloat(inputs.target_kkal || 1125);
  const target_protein = parseFloat(inputs.target_protein || 30);
  const target_kalsium = parseFloat(inputs.target_kalsium || 850);
  const target_zatBesi = parseFloat(inputs.target_zatBesi || 30);

  const log_kkal = parseFloat(inputs.kkal || 0);
  const log_protein = parseFloat(inputs.protein || 0);
  const log_kalsium = parseFloat(inputs.kalsium || 0);
  const log_zatBesi = parseFloat(inputs.zatBesi || 0);
  const log_vitC = parseFloat(inputs.vitC || 0);

  const pct_kkal = Math.min(Math.round((log_kkal / target_kkal) * 100), 100);
  const pct_protein = Math.min(Math.round((log_protein / target_protein) * 100), 100);
  const pct_kalsium = Math.min(Math.round((log_kalsium / target_kalsium) * 100), 100);
  const pct_zatBesi = Math.min(Math.round((log_zatBesi / target_zatBesi) * 100), 100);

  const overall_pct = Math.round((pct_kkal + pct_protein + pct_kalsium + pct_zatBesi) / 4);

  const deficiencies = [];
  
  // Evaluasi Protein
  if (log_protein < target_protein * 0.8) {
    const diff = Math.max(0, parseFloat((target_protein - log_protein).toFixed(1)));
    deficiencies.push({
      emoji: '🍗',
      label: 'Protein',
      pct: pct_protein,
      color: '#3B82F6',
      note: `Kurang ${diff} gram`
    });
  } else {
    deficiencies.push({
      emoji: '🍗',
      label: 'Protein',
      pct: pct_protein,
      color: '#22C55E',
      note: 'Cukup'
    });
  }

  // Evaluasi Zat Besi
  if (log_zatBesi < target_zatBesi * 0.8) {
    const diff = Math.max(0, parseFloat((target_zatBesi - log_zatBesi).toFixed(1)));
    deficiencies.push({
      emoji: '🌿',
      label: 'Zat Besi',
      pct: pct_zatBesi,
      color: '#F97316',
      note: `Kurang ${diff} mg`
    });
  } else {
    deficiencies.push({
      emoji: '🌿',
      label: 'Zat Besi',
      pct: pct_zatBesi,
      color: '#22C55E',
      note: 'Cukup'
    });
  }

  // Evaluasi Kalsium
  if (log_kalsium < target_kalsium * 0.8) {
    const diff = Math.max(0, parseFloat((target_kalsium - log_kalsium).toFixed(1)));
    deficiencies.push({
      emoji: '🦷',
      label: 'Kalsium',
      pct: pct_kalsium,
      color: '#8B5CF6',
      note: `Kurang ${diff} mg`
    });
  } else {
    deficiencies.push({
      emoji: '🦷',
      label: 'Kalsium',
      pct: pct_kalsium,
      color: '#22C55E',
      note: 'Cukup'
    });
  }

  deficiencies.sort((a, b) => a.pct - b.pct);

  const features_weight = { protein: 0.40, kalsium: 0.25, zatBesi: 0.20, kkal: 0.15 };
  const skor_gizi = parseFloat((
    (pct_protein / 100) * features_weight.protein +
    (pct_kalsium / 100) * features_weight.kalsium +
    (pct_zatBesi / 100) * features_weight.zatBesi +
    (pct_kkal / 100) * features_weight.kkal
  ).toFixed(4));

  let recommended_foods = null;

  if (fs.existsSync(RULES_PATH)) {
    try {
      const rules = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
      const category_recs = rules.category_recommendations || {};
      
      const matched_categories = [];
      if (log_protein < target_protein * 0.8) {
        matched_categories.push('Daging', 'Ikan/Kerang/Udang dll');
      }
      if (log_kalsium < target_kalsium * 0.8) {
        matched_categories.push('Kacang-Kacangan');
      }
      if (log_zatBesi < target_zatBesi * 0.8) {
        matched_categories.push('Sayuran', 'Kacang-Kacangan');
      }

      // Deduplicate and fallback
      const unique_cats = [...new Set(matched_categories)];
      const cats_to_use = unique_cats.length > 0 ? unique_cats : ['Buah', 'Sayuran', 'Kacang-Kacangan', 'Daging', 'Ikan/Kerang/Udang dll'];

      const recs_by_meal = {
        Sarapan: [],
        Cemilan: [],
        'Makan Siang': [],
        'Makan Malam': []
      };

      const meal_types = Object.keys(recs_by_meal);
      let counter = 0;

      cats_to_use.forEach(cat => {
        const cat_items = category_recs[cat] || [];
        cat_items.slice(0, 3).forEach(item => {
          const meal = meal_types[counter % meal_types.length];
          
          let why_desc = "Kaya akan nutrisi penting untuk tumbuh kembang anak.";
          if (item.protein > 15) {
            why_desc = `Sumber protein tinggi (${item.protein}g/100g) sangat optimal untuk menumbuhkan kekuatan otot dan sel anak.`;
          } else if (item.kalsium > 150) {
            why_desc = `Tinggi kalsium (${item.kalsium}mg/100g) membantu memperkokoh pertumbuhan struktur gigi dan tulang anak.`;
          } else if (item.zatBesi > 2.5) {
            why_desc = `Tinggi kandungan zat besi (${item.zatBesi}mg/100g) sangat baik dalam melancarkan oksigen ke otak anak dan mencegah anemia.`;
          }

          const bg_colors = ['#F89EBD', '#8DD68F', '#B5A2EC', '#FFD166'];
          const bg = bg_colors[counter % bg_colors.length];

          recs_by_meal[meal].append = recs_by_meal[meal].push({
            name: item.nama,
            kkal: Math.round(item.kkal),
            protein: item.protein,
            kalsium: item.kalsium,
            zatBesi: item.zatBesi,
            bg: bg,
            why: why_desc,
            tags: [cat, "Rekomendasi AI"]
          });
          counter++;
        });
      });

      recommended_foods = recs_by_meal;
    } catch (err) {
      console.error('Error reading rules in fallback JS:', err);
    }
  }

  if (!recommended_foods) {
    recommended_foods = {
      Sarapan: [
        { name: 'Telur Rebus + Roti Gandum', kkal: 280, protein: 18, bg: '#F89EBD', why: 'Kaya protein & zat besi — membantu pertumbuhan dan mencegah anemia.', tags: ['Protein', 'Zat Besi', 'Energi'] },
        { name: 'Susu + Pisang', kkal: 190, protein: 8, bg: '#8DD68F', why: 'Kalsium dari susu + kalium dari pisang — sempurna untuk tulang kuat.', tags: ['Kalsium', 'Kalium', 'Energi'] }
      ],
      Cemilan: [
        { name: 'Kacang Hijau Rebus', kkal: 130, protein: 9, bg: '#8DD68F', why: 'Zat besi tertinggi dari kacang-kacangan — sangat dibutuhkan anak.', tags: ['Zat Besi', 'Protein', 'Serat'] }
      ],
      'Makan Siang': [
        { name: 'Nasi + Sayur Bayam + Tempe', kkal: 350, protein: 22, bg: '#B5A2EC', why: 'Kombinasi zat besi dari bayam + protein nabati tempe yang optimal.', tags: ['Zat Besi', 'Protein', 'Kalsium'] }
      ],
      'Makan Malam': [
        { name: 'Nasi + Tahu + Brokoli', kkal: 300, protein: 16, bg: '#8DD68F', why: 'Kalsium dari tahu + vitamin C dari brokoli untuk imunitas malam.', tags: ['Kalsium', 'Vitamin C', 'Protein'] }
      ]
    };
  }

  return {
    overall_percentage: overall_pct,
    nutrition_score: skor_gizi,
    deficiencies,
    recommendations: recommended_foods,
    status: {
      energi: pct_kkal >= 80 ? 'Cukup' : 'Kurang',
      protein: pct_protein >= 80 ? 'Cukup' : 'Kurang',
      kalsium: pct_kalsium >= 80 ? 'Cukup' : 'Kurang',
      zatBesi: pct_zatBesi >= 80 ? 'Cukup' : 'Kurang'
    }
  };
}

exports.getRecommendations = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const rawLogs = await Logs.getByUserAndDate(req.user.id, date);
    
    // Scale logged foods
    const factorNutrition = (food, gram) => {
      const f = gram / 100;
      return {
        kkal: food.kkal * f,
        protein: food.protein * f,
        kalsium: food.kalsium * f,
        zatBesi: food.zatBesi * f,
        vitC: food.vitC * f
      };
    };

    const totals = rawLogs.reduce((acc, log) => {
      const n = factorNutrition(log.food, log.gram);
      return {
        kkal: acc.kkal + n.kkal,
        protein: acc.protein + n.protein,
        kalsium: acc.kalsium + n.kalsium,
        zatBesi: acc.zatBesi + n.zatBesi,
        vitC: acc.vitC + n.vitC
      };
    }, { kkal: 0, protein: 0, kalsium: 0, zatBesi: 0, vitC: 0 });

    const target = authController.calculateAKG(req.user.childProfile) || {
      kkal: 1125,
      protein: 30,
      kalsium: 850,
      zatBesi: 30,
      vitC: 45
    };

    const predictionInputs = {
      kkal: parseFloat(totals.kkal.toFixed(1)),
      protein: parseFloat(totals.protein.toFixed(1)),
      kalsium: parseFloat(totals.kalsium.toFixed(1)),
      zatBesi: parseFloat(totals.zatBesi.toFixed(1)),
      vitC: parseFloat(totals.vitC.toFixed(1)),
      target_kkal: target.kkal,
      target_protein: target.protein,
      target_kalsium: target.kalsium,
      target_zatBesi: target.zatBesi,
      target_vitC: target.vitC
    };

    // Attempt Python model call
    const inputJsonStr = JSON.stringify(predictionInputs).replace(/"/g, '\\"');
    const cmd = `echo ${inputJsonStr} | python "${PYTHON_PREDICT_PATH}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error || !stdout.trim()) {
        // Fall back gracefully to high-fidelity JavaScript engine
        console.warn('Python execution failed, running JavaScript model rules engine fallback.');
        const fallbackResult = runJsPrediction(predictionInputs);
        return res.json({
          engine: 'JavaScript Rules Engine Fallback',
          data: fallbackResult
        });
      }

      try {
        const resultJson = JSON.parse(stdout);
        res.json({
          engine: 'Python Decision Tree Model',
          data: resultJson
        });
      } catch (parseError) {
        console.error('Failed to parse Python stdout:', parseError);
        const fallbackResult = runJsPrediction(predictionInputs);
        res.json({
          engine: 'JavaScript Rules Engine Fallback',
          data: fallbackResult
        });
      }
    });

  } catch (err) {
    console.error('Recommendation API error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses rekomendasi gizi anak.' });
  }
};
