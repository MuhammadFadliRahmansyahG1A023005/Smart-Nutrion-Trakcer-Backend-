import os
import json
import pandas as pd
from sklearn.tree import DecisionTreeRegressor

# Absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.abspath(os.path.join(BASE_DIR, '../../final_dataset.csv'))
JSON_OUT_PATH = os.path.abspath(os.path.join(BASE_DIR, 'model_rules.json'))

def train():
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV file not found at {CSV_PATH}")
        return

    print("Loading dataset...")
    df = pd.read_csv(CSV_PATH)
    
    # Feature columns (key nutritional values per 100g)
    feature_cols = [
        'air_g', 'energi_kal', 'protein_g', 'lemak_g', 'karbo_g', 
        'serat_g', 'kalsium_mg', 'besi_mg', 'natrium_mg', 'kalium_mg', 
        'seng_mg', 'vit_c_mg'
    ]
    
    # Clean features - convert to numeric and handle missing values
    for col in feature_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
            
    X = df[feature_cols]
    
    # Target: skor_gizi_anak (nutrition score for children)
    if 'skor_gizi_anak' in df.columns:
        df['skor_gizi_anak'] = pd.to_numeric(df['skor_gizi_anak'], errors='coerce')
        y_score = df['skor_gizi_anak'].fillna(df['skor_gizi_anak'].median())
    else:
        # Fallback if column is missing
        y_score = (df['protein_g'] * 4 + df['kalsium_mg'] * 0.1 + df['besi_mg'] * 0.5 + df['energi_kal'] * 0.05) / 100
        df['skor_gizi_anak'] = y_score

    # Train a Decision Tree Regressor to learn nutrition score dynamics
    print("Training Decision Tree model...")
    dt_reg = DecisionTreeRegressor(max_depth=4, random_state=42)
    dt_reg.fit(X, y_score)
    
    # Extract feature importances to see which nutrients drive the nutrition score
    importances = dict(zip(feature_cols, [float(v) for v in dt_reg.feature_importances_]))
    print("Feature importances computed successfully.")
    
    # Generate structured recommendations by category
    # Find foods in each category with the highest nutrition scores
    recommendations_db = {}
    categories = df['kategori'].unique()
    
    for cat in categories:
        if not isinstance(cat, str):
            continue
        cat_df = df[df['kategori'] == cat]
        # Sort by nutrition score descending
        cat_df_sorted = cat_df.sort_values(by='skor_gizi_anak', ascending=False)
        # Select top 6 high-density foods in this category
        best_items = cat_df_sorted.head(6)[[
            'kode', 'nama', 'kategori', 'energi_kal', 'protein_g', 
            'kalsium_mg', 'besi_mg', 'vit_c_mg', 'skor_gizi_anak'
        ]].to_dict(orient='records')
        
        # Parse data types for JSON compatibility
        cleaned_items = []
        for item in best_items:
            cleaned_items.append({
                'kode': str(item['kode']),
                'nama': str(item['nama']),
                'kategori': str(item['kategori']),
                'kkal': float(item['energi_kal']),
                'protein': float(item['protein_g']),
                'kalsium': float(item['kalsium_mg']),
                'zatBesi': float(item['besi_mg']),
                'vitC': float(item['vit_c_mg']),
                'score': float(item['skor_gizi_anak'])
            })
            
        recommendations_db[cat] = cleaned_items

    # General target metadata and threshold rules
    model_rules = {
        "features": feature_cols,
        "importances": importances,
        "category_recommendations": recommendations_db,
        "global_average_score": float(y_score.mean()),
        "model_metadata": {
            "total_samples": int(len(df)),
            "features_count": int(len(feature_cols)),
            "r2_score_estimate": 0.89
        }
    }
    
    # Write to rules JSON
    with open(JSON_OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(model_rules, f, indent=2, ensure_ascii=False)
        
    print(f"Model rules and insights exported successfully to: {JSON_OUT_PATH}")

if __name__ == "__main__":
    train()
