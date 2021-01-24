#!/usr/bin/python3
import json

data_formated = {}

with open('./dictionary.json') as json_dict:
    data = json.load(json_dict)
    for key in data.keys():
        item_array = data[key].split("ИСТОЧНИК:")
        english_translation = item_array[0][item_array[0].find(
            '(') + 1:item_array[0].find(')')].split(',')

        new_item = {
            "word": key.capitalize(),
            "english": [x.strip(' ') for x in english_translation],
            "meaning": item_array[0][item_array[0].find(')') + 2:].strip(),
            "resource": item_array[1].strip(),
            "related": []
        }

        data_formated[key.replace(" ", "_")] = new_item

for item in data_formated:
    related = []
    for word in data_formated[item]["english"]:
        for item2 in data_formated:
            for word2 in data_formated[item2]["english"]:
                if word == word2 and item != item2:
                    related.append(item2)
    data_formated[item]["related"] = related

with open('parser_output.json', 'w', encoding='utf8') as outfile:
    json.dump(data_formated, outfile, ensure_ascii=False)
