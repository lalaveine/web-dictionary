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
            "english": item_array[0][item_array[0].find('(') + 1:item_array[0].find(')')].split(','),
            "meaning": item_array[0][item_array[0].find(')') + 2:].strip(),
            "resource": item_array[1].strip(),
            "related": []
        }
        data_formated[key] = new_item

with open('parser_output.json', 'w', encoding='utf8') as outfile:
    json.dump(data_formated, outfile, ensure_ascii=False)
