#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import urllib.request
import urllib.error
import time

# Mapeamento de tipos para nomes em português
type_map = {
    "normal": "Normal", "fire": "Fogo", "water": "Água", "electric": "Elétrico",
    "grass": "Grama", "ice": "Gelo", "fighting": "Lutador", "poison": "Veneno",
    "ground": "Terra", "flying": "Voador", "psychic": "Psíquico", "bug": "Inseto",
    "rock": "Pedra", "ghost": "Fantasma", "dragon": "Dragão", "dark": "Sombrio",
    "steel": "Aço", "fairy": "Fada"
}

# Ranges de cada geração
generations = {
    2: {"start": 152, "end": 251, "name": "Johto"},
    3: {"start": 252, "end": 386, "name": "Hoenn"},
    4: {"start": 387, "end": 493, "name": "Sinnoh"},
    5: {"start": 494, "end": 649, "name": "Unova"},
    6: {"start": 650, "end": 721, "name": "Kalos"},
    7: {"start": 722, "end": 809, "name": "Alola"},
    8: {"start": 810, "end": 905, "name": "Galar"},
    9: {"start": 906, "end": 1025, "name": "Paldea"}
}

# URL base para baixar GIFs
gif_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/{}.gif"

def normalize_name(name):
    """Normaliza o nome do pokemon para nome de arquivo"""
    name = name.lower()
    special_cases = {
        'nidoran♀': 'nidoran-f',
        'nidoran♂': 'nidoran-m',
        "farfetch'd": 'farfetchd',
        "mr. mime": 'mr-mime',
        "mime jr.": 'mime-jr',
        "type: null": 'type-null',
        "nidoran♀": 'nidoran-f',
        "nidoran♂": 'nidoran-m',
    }
    return special_cases.get(name, name)

def fetch_pokemon_data(pokedex_num):
    """Busca dados do pokemon da PokeAPI"""
    try:
        url = f"https://pokeapi.co/api/v2/pokemon/{pokedex_num}/"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
            
            name = data['name'].replace('-', ' ').title()
            # Corrigir casos especiais
            if name == "Nidoran F":
                name = "Nidoran♀"
            elif name == "Nidoran M":
                name = "Nidoran♂"
            elif name == "Farfetch D":
                name = "Farfetch'd"
            elif name == "Mr Mime":
                name = "Mr. Mime"
            elif name == "Mime Jr":
                name = "Mime Jr."
            elif name == "Type Null":
                name = "Type: Null"
            
            types = [t['type']['name'] for t in data['types']]
            typeNames = [type_map.get(t, t.capitalize()) for t in types]
            
            # Buscar descrição em português
            species_url = data['species']['url']
            with urllib.request.urlopen(species_url) as species_response:
                species_data = json.loads(species_response.read())
                description = "Um Pokémon único com características especiais."
                
                # Tentar encontrar descrição em português
                for entry in species_data.get('flavor_text_entries', []):
                    if entry['language']['name'] == 'pt':
                        description = entry['flavor_text'].replace('\n', ' ').replace('\f', ' ')
                        break
                # Se não encontrar em português, usar inglês
                if description == "Um Pokémon único com características especiais.":
                    for entry in species_data.get('flavor_text_entries', []):
                        if entry['language']['name'] == 'en':
                            description = entry['flavor_text'].replace('\n', ' ').replace('\f', ' ')
                            break
            
            return {
                "name": name,
                "number": f"#{pokedex_num:03d}",
                "image": f"./src/imagens/{normalize_name(name)}.gif",
                "types": types,
                "typeNames": typeNames,
                "description": description
            }
    except Exception as e:
        print(f"  Erro ao buscar dados do #{pokedex_num}: {e}")
        return None

def download_gif(pokedex_num, filename):
    """Baixa o GIF do pokemon"""
    try:
        url = gif_url.format(pokedex_num)
        filepath = f"src/imagens/{filename}"
        
        # Se já existe, pular
        if os.path.exists(filepath):
            return True
        
        urllib.request.urlretrieve(url, filepath)
        
        # Verificar se foi baixado corretamente
        if os.path.getsize(filepath) > 1000:
            return True
        else:
            os.remove(filepath)
            return False
    except Exception as e:
        return False

# Processar cada geração
for gen_num, gen_info in generations.items():
    print(f"\n{'='*60}")
    print(f"Processando Geração {gen_num} - {gen_info['name']}")
    print(f"Pokemons: #{gen_info['start']} a #{gen_info['end']}")
    print(f"{'='*60}\n")
    
    pokemons = []
    downloaded = 0
    failed = []
    
    for pokedex_num in range(gen_info['start'], gen_info['end'] + 1):
        print(f"Processando #{pokedex_num:03d}...", end=' ')
        
        # Buscar dados
        pokemon_data = fetch_pokemon_data(pokedex_num)
        
        if not pokemon_data:
            print("✗ Falhou ao buscar dados")
            failed.append(pokedex_num)
            continue
        
        # Baixar GIF
        filename = normalize_name(pokemon_data['name']) + '.gif'
        if download_gif(pokedex_num, filename):
            downloaded += 1
            print(f"✓ {pokemon_data['name']}")
        else:
            print(f"⚠ {pokemon_data['name']} (GIF não baixado)")
        
        pokemons.append(pokemon_data)
        
        # Pequeno delay para não sobrecarregar a API
        time.sleep(0.1)
    
    # Salvar JSON
    json_file = f"src/data/generation-{gen_num}.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(pokemons, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Geração {gen_num} concluída!")
    print(f"  Pokemons: {len(pokemons)}")
    print(f"  GIFs baixados: {downloaded}")
    print(f"  Falharam: {len(failed)}")

print(f"\n{'='*60}")
print("Todas as gerações foram processadas!")
print(f"{'='*60}")

