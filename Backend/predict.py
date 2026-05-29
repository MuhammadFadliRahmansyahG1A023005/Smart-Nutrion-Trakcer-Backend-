import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RULES_PATH = os.path.join(BASE_DIR, 'model_rules.json')

def predict(inputs):
    # Default target thresholds
    target_kkal = float(inputs.get('target_kkal', 1125))
    target_protein = float(inputs.get('target_protein', 30))
    target_kalsium = float(inputs.get('target_kalsium', 850))
    target_zatBesi = float(inputs.get('target_zatBesi', 30))
    target_vitC = float(inputs.get('target_vitC', 45))

    # Logged intakes
    log_kkal = float(inputs.get('kkal', 0))
    log_protein = float(inputs.get('protein', 0))
    log_kalsium = float(inputs.get('kalsium', 0))
    log_zatBesi = float(inputs.get('zatBesi', 0))
    log_vitC = float(inputs.get('vitC', 0))
    
    # Calculate percentages
    pct_kkal = min(round((log_kkal / target_kkal) * 100), 100) if target_kkal > 0 else 0
    pct_protein = min(round((log_protein / target_protein) * 100), 100) if target_protein > 0 else 0
    pct_kalsium = min(round((log_kalsium / target_kalsium) * 100), 100) if target_kalsium > 0 else 0
    pct_zatBesi = min(round((log_zatBesi / target_zatBesi) * 100), 100) if target_zatBesi > 0 else 0
    pct_vitC = min(round((log_vitC / target_vitC) * 100), 100) if target_vitC > 0 else 0

    overall_pct = round((pct_kkal + pct_protein + pct_kalsium + pct_zatBesi) / 4)

    # Detect major deficiencies
    deficiencies = []
    if log_protein < target_protein * 0.8:
        diff = round(target_protein - log_protein, 1)
        deficiencies.append({
            "emoji": "🍗",
            "label": "Protein",
            "pct": pct_protein,
            "color": "#3B82F6",
            "note": f"Kurang {diff} gram"
        })
    else:
        deficiencies.append({
            "emoji": "🍗",
            "label": "Protein",
            "pct": pct_protein,
            "color": "#22C55E",
            "note": "Cukup"
        })

    if log_zatBesi < target_zatBesi * 0.8:
        diff = round(target_zatBesi - log_zatBesi, 1)
        deficiencies.append({
            "emoji": "🌿",
            "label": "Zat Besi",
            "pct": pct_zatBesi,
            "color": "#F97316",
            "note": f"Kurang {diff} mg"
        })
    else:
        deficiencies.append({
            "emoji": "🌿",
            "label": "Zat Besi",
            "pct": pct_zatBesi,
            "color": "#22C55E",
            "note": "Cukup"
        })

    if log_kalsium < target_kalsium * 0.8:
        diff = round(target_kalsium - log_kalsium, 1)
        deficiencies.append({
            "emoji": "🦷",
            "label": "Kalsium",
            "pct": pct_kalsium,
            "color": "#8B5CF6",
            "note": f"Kurang {diff} mg"
        })
    else:
        deficiencies.append({
            "emoji": "🦷",
            "label": "Kalsium",
            "pct": pct_kalsium,
            "color": "#22C55E",
            "note": "Cukup"
        })

    # Sort deficiencies - showing highest severity first
    deficiencies.sort(key=lambda d: d['pct'])

    # Predict child nutrition score using features
    # Standard Decision Tree Regressor simulation based on imported features
    features_weight = {
        "protein": 0.40,
        "kalsium": 0.25,
        "zatBesi": 0.20,
        "kkal": 0.15
    }
    
    # Scale user nutrition logs to a score between 0 and 1
    skor_gizi = (
        (pct_protein / 100) * features_weight['protein'] +
        (pct_kalsium / 100) * features_weight['kalsium'] +
        (pct_zatBesi / 100) * features_weight['zatBesi'] +
        (pct_kkal / 100) * features_weight['kkal']
    )
    skor_gizi = round(float(skor_gizi), 4)

    # Fetch ranked recommended food options from the trained rules JSON if available
    recommended_foods = []
    if os.path.exists(RULES_PATH):
        try:
            with open(RULES_PATH, 'r', encoding='utf-8') as f:
                rules = json.load(f)
                category_recs = rules.get('category_recommendations', {})
                
                # Dynamic matching based on deficiencies
                # If protein is low, select high-protein categories (Daging, Ikan/Kerang/Udang dll, Telur)
                # If calcium is low, select high-calcium categories (Susu, Kacang-Kacangan)
                # If iron is low, select high-iron categories (Sayuran, Umbi)
                matched_categories = []
                if log_protein < target_protein * 0.8:
                    matched_categories.extend(['Daging', 'Telur', 'Ikan/Kerang/Udang dll'])
                if log_kalsium < target_kalsium * 0.8:
                    matched_categories.extend(['Serealia', 'Kacang-Kacangan'])
                if log_zatBesi < target_zatBesi * 0.8:
                    matched_categories.extend(['Sayuran', 'Kacang-Kacangan'])
                
                # Deduplicate and fallback to default categories
                matched_categories = list(set(matched_categories))
                if not matched_categories:
                    matched_categories = ['Ikan/Kerang/Udang dll', 'Sayuran', 'Buah', 'Kacang-Kacangan']

                # Build recommendation cards
                recs_by_meal = {
                    "Sarapan": [],
                    "Cemilan": [],
                    "Makan Siang": [],
                    "Makan Malam": []
                }
                
                # Helper dictionary for mapping
                meal_types = list(recs_by_meal.keys())
                
                counter = 0
                for cat in matched_categories:
                    cat_items = category_recs.get(cat, [])
                    for item in cat_items[:3]:
                        meal = meal_types[counter % len(meal_types)]
                        
                        # Set description context based on nutrient strengths
                        why_desc = f"Kaya akan nutrisi penting untuk pertumbuhan anak."
                        if item['protein'] > 15:
                            why_desc = f"Sumber protein tinggi ({item['protein']}g/100g) yang sangat membantu pertumbuhan jaringan dan otot anak."
                        elif item['kalsium'] > 150:
                            why_desc = f"Mengandung kalsium tinggi ({item['kalsium']}mg/100g) yang ideal untuk pembentukan tulang dan gigi kuat."
                        elif item['zatBesi'] > 2.5:
                            why_desc = f"Kaya zat besi ({item['zatBesi']}mg/100g) untuk mendukung kecerdasan otak dan mencegah lesu/anemia."
                        
                        # UI assets bindings
                        bg_colors = ['#F89EBD', '#8DD68F', '#B5A2EC', '#FFD166']
                        bg = bg_colors[counter % len(bg_colors)]
                        
                        recs_by_meal[meal].append({
                            "name": item['nama'],
                            "kkal": int(item['kkal']),
                            "protein": float(item['protein']),
                            "kalsium": float(item['kalsium']),
                            "zatBesi": float(item['zatBesi']),
                            "bg": bg,
                            "why": why_desc,
                            "tags": [cat, "Rekomendasi AI"]
                        })
                        counter += 1
                
                recommended_foods = recs_by_meal
        except Exception as e:
            print(f"Error reading rules: {e}", file=sys.stderr)
            
    # Fallback default recommendations if rules JSON read fails
    if not recommended_foods:
        recommended_foods = {
            "Sarapan": [
                {"name": "Telur Ayam Rebus", "kkal": 154, "protein": 12.4, "bg": "#F89EBD", "why": "Protein lengkap tinggi untuk energi pagi anak.", "tags": ["Telur", "Protein"]},
                {"name": "Susu Sapi Segar", "kkal": 200, "protein": 14.0, "bg": "#8DD68F", "why": "Kalsium tinggi melimpah untuk kekuatan pertumbuhan tulang.", "tags": ["Susu", "Kalsium"]}
            ],
            "Cemilan": [
                {"name": "Pisang Segar", "kkal": 74, "protein": 5.0, "bg": "#8DD68F", "why": "Kalium melimpah, camilan sehat berenergi cepat.", "tags": ["Buah", "Kalium"]}
            ],
            "Makan Siang": [
                {"name": "Nasi + Sayur Bayam", "kkal": 203, "protein": 5.9, "bg": "#B5A2EC", "why": "Kombinasi zat besi dan serat melimpah pencegah anemia.", "tags": ["Sayur", "Zat Besi"]}
            ],
            "Makan Malam": [
                {"name": "Tahu Kukus Brokoli", "kkal": 180, "protein": 12.0, "bg": "#FFD166", "why": "Ringan di lambung malam hari, kaya kalsium dan antioksidan.", "tags": ["Tahu", "Kalsium"]}
            ]
        }

    # Final response
    output = {
        "overall_percentage": overall_pct,
        "nutrition_score": skor_gizi,
        "deficiencies": deficiencies,
        "recommendations": recommended_foods,
        "status": {
            "energi": "Cukup" if pct_kkal >= 80 else "Kurang",
            "protein": "Cukup" if pct_protein >= 80 else "Kurang",
            "kalsium": "Cukup" if pct_kalsium >= 80 else "Kurang",
            "zatBesi": "Cukup" if pct_zatBesi >= 80 else "Kurang"
        }
    }
    
    return output

if __name__ == "__main__":
    # Receive input as standard input JSON
    try:
        input_data = json.load(sys.stdin)
    except Exception:
        # Fallback if no stdin
        input_data = {}
        
    result = predict(input_data)
    print(json.dumps(result, ensure_ascii=False))
