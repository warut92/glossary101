import json
import re

def txt_to_json(input_file, output_file):
    data = []

    with open(input_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # Split into English + Thai using regex (Thai Unicode range)
            match = re.match(r"^(.*?)([\u0E00-\u0E7F].*)$", line)
            if match:
                english = match.group(1).strip()
                thai = match.group(2).strip()
                data.append({"english": english, "thai": thai})
    
    # Save JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Example usage
txt_to_json("words.txt", "th_oss.json")
