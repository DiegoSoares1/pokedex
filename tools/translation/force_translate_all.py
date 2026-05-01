#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import urllib.request
import time

def get_portuguese_description(pokedex_num):
    """Busca descrição em português brasileiro da PokeAPI"""
    try:
        url = f"https://pokeapi.co/api/v2/pokemon/{pokedex_num}/"
        with urllib.request.urlopen(url, timeout=10) as response:
            pokemon_data = json.loads(response.read())
        
        species_url = pokemon_data['species']['url']
        with urllib.request.urlopen(species_url, timeout=10) as species_response:
            species_data = json.loads(species_response.read())
        
        # Procurar descrição em português brasileiro
        for entry in species_data.get('flavor_text_entries', []):
            if entry['language']['name'] == 'pt':
                description = entry['flavor_text']
                description = description.replace('\n', ' ').replace('\f', ' ').replace('\u000c', ' ')
                while '  ' in description:
                    description = description.replace('  ', ' ')
                return description.strip()
        
        return None
    except Exception as e:
        return None

# Processar todas as gerações
total_updated = 0
total_not_found = 0

for gen in range(1, 10):
    print(f"\nGeração {gen}...")
    
    with open(f'src/data/generation-{gen}.json', 'r', encoding='utf-8') as f:
        pokemons = json.load(f)
    
    updated = 0
    not_found = 0
    
    for i, pokemon in enumerate(pokemons, 1):
        pokedex_num = int(pokemon['number'].replace('#', ''))
        current_desc = pokemon['description'].lower()
        
        # Verificar se está em inglês
        is_english = any(word in current_desc for word in ['the ', ' a ', ' an ', ' is ', ' are ', ' it ', ' its ', ' can ', ' has ', ' have ', ' when ', ' where ', ' which ', ' this ', ' that '])
        is_portuguese = any(word in current_desc for word in ['um ', 'uma ', 'o ', 'a ', 'os ', 'as ', 'é ', 'são ', 'tem ', 'têm ', 'pode ', 'com ', 'para ', 'por ', 'que ', 'quando ', 'onde ', 'como ', 'este ', 'esta ', 'esse ', 'essa '])
        
        if is_english and not is_portuguese:
            pt_desc = get_portuguese_description(pokedex_num)
            if pt_desc:
                pokemon['description'] = pt_desc
                updated += 1
                if updated % 10 == 0:
                    print(f"  {updated} traduzidos...")
            else:
                not_found += 1
            time.sleep(0.1)
    
    if updated > 0:
        with open(f'src/data/generation-{gen}.json', 'w', encoding='utf-8') as f:
            json.dump(pokemons, f, ensure_ascii=False, indent=2)
    
    total_updated += updated
    total_not_found += not_found
    print(f"  Gen {gen}: {updated} traduzidos, {not_found} não encontrados")

print(f"\n{'='*60}")
print(f"Total traduzido: {total_updated}")
print(f"Total não encontrado: {total_not_found}")
print(f"{'='*60}")

