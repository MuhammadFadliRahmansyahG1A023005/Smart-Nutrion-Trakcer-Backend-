const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let foods = [];

function loadFoodsCSV() {
  return new Promise((resolve, reject) => {
    // Note: final_dataset.csv is in the workspace root, which is 2 directories up from this controller
    const csvPath = path.join(__dirname, '../../final_dataset.csv');
    const parsedFoods = [];
    
    if (!fs.existsSync(csvPath)) {
      console.warn(`Warning: CSV file not found at ${csvPath}. Using fallback empty array.`);
      foods = [];
      resolve([]);
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        parsedFoods.push({
          id: row.kode || parsedFoods.length.toString(),
          name: row.nama || '',
          latinName: row.nama_latin || '-',
          origin: row.asal || '-',
          category: row.kategori || '',
          type: row.tipe || '',
          description: row.keterangan || '-',
          // Nutritional columns parsed to float (100g basis)
          water: parseFloat(row.air_g) || 0,
          kkal: parseFloat(row.energi_kal) || 0,
          protein: parseFloat(row.protein_g) || 0,
          fat: parseFloat(row.lemak_g) || 0,
          carbohydrate: parseFloat(row.karbo_g) || 0,
          fiber: parseFloat(row.serat_g) || 0,
          ash: parseFloat(row.abu_g) || 0,
          kalsium: parseFloat(row.kalsium_mg) || 0,
          fosfor: parseFloat(row.fosfor_mg) || 0,
          zatBesi: parseFloat(row.besi_mg) || 0,
          natrium: parseFloat(row.natrium_mg) || 0,
          kalium: parseFloat(row.kalium_mg) || 0,
          tembaga: parseFloat(row.tembaga_mg) || 0,
          seng: parseFloat(row.seng_mg) || 0,
          retinol: parseFloat(row.retinol_mcg) || 0,
          b_kar: parseFloat(row.b_kar_mcg) || 0,
          kar_total: parseFloat(row.kar_total_mcg) || 0,
          thiamin: parseFloat(row.thiamin_mg) || 0,
          riboflavin: parseFloat(row.riboflavin_mg) || 0,
          niasin: parseFloat(row.niasin_mg) || 0,
          vitC: parseFloat(row.vit_c_mg) || 0,
          // Machine learning status categories and final nutrition score
          statusEnergi: row.status_energi || '',
          statusProtein: row.status_protein || '',
          statusKalsium: row.status_kalsium || '',
          statusBesi: row.status_besi || '',
          nutritionScore: parseFloat(row.skor_gizi_anak) || 0
        });
      })
      .on('end', () => {
        foods = parsedFoods;
        console.log(`Successfully parsed ${foods.length} foods from final_dataset.csv`);
        resolve(foods);
      })
      .on('error', (err) => {
        console.error('Failed to parse final_dataset.csv:', err);
        reject(err);
      });
  });
}

exports.searchFoods = async (req, res) => {
  try {
    const query = req.query.query || '';
    const limit = parseInt(req.query.limit) || 50;
    
    if (!query || query.trim() === '') {
      // If no query is provided, return a subset of foods
      return res.json(foods.slice(0, limit));
    }
    
    const term = query.toLowerCase().trim();
    const results = foods.filter(f => 
      f.name.toLowerCase().includes(term) || 
      f.category.toLowerCase().includes(term)
    );
    
    res.json(results.slice(0, limit));
  } catch (err) {
    console.error('Search foods error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mencari bahan makanan.' });
  }
};

exports.getFoodByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const food = foods.find(f => f.id === code);
    if (!food) {
      return res.status(404).json({ error: 'Bahan makanan tidak ditemukan.' });
    }
    res.json(food);
  } catch (err) {
    console.error('Get food by code error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data makanan.' });
  }
};

exports.loadFoodsCSV = loadFoodsCSV;
exports.getFoodsArray = () => foods;
