import json

# Read your text file
with open("words.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

data = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # Split English and Thai parts (split only on the first space)
    parts = line.split(" ", 1)
    if len(parts) == 2:
        english, thai = parts
        # Clean Thai part (remove trailing \t if exists)
        thai = thai.replace("\\t", "").strip()
        # Split multiple Thai translations by comma
        thai_list = [t.strip() for t in thai.split(",")]
        
        data.append({
            "english": english,
            "thai": thai_list
        })

# Save to JSON
with open("words.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Conversion completed! File saved as words.json")
