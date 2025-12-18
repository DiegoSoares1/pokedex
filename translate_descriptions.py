#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import urllib.request
import time

def get_portuguese_description(pokedex_num):
    """Busca descrição em português brasileiro da PokeAPI"""
    try:
        # Buscar dados do pokemon
        url = f"https://pokeapi.co/api/v2/pokemon/{pokedex_num}/"
        with urllib.request.urlopen(url) as response:
            pokemon_data = json.loads(response.read())
        
        # Buscar espécie para obter descrições
        species_url = pokemon_data['species']['url']
        with urllib.request.urlopen(species_url) as species_response:
            species_data = json.loads(species_response.read())
        
        # Procurar descrição em português brasileiro
        for entry in species_data.get('flavor_text_entries', []):
            if entry['language']['name'] == 'pt':
                description = entry['flavor_text']
                # Limpar quebras de linha e caracteres especiais
                description = description.replace('\n', ' ').replace('\f', ' ').replace('\u000c', ' ')
                # Remover espaços múltiplos
                while '  ' in description:
                    description = description.replace('  ', ' ')
                return description.strip()
        
        # Se não encontrar em português, retornar None
        return None
    except Exception as e:
        print(f"  Erro ao buscar descrição do #{pokedex_num}: {e}")
        return None

# Processar cada geração
for gen in range(1, 10):
    print(f"\n{'='*60}")
    print(f"Traduzindo descrições - Geração {gen}")
    print(f"{'='*60}\n")
    
    # Ler JSON
    with open(f'src/data/generation-{gen}.json', 'r', encoding='utf-8') as f:
        pokemons = json.load(f)
    
    updated = 0
    not_found = 0
    
    for i, pokemon in enumerate(pokemons, 1):
        pokedex_num = int(pokemon['number'].replace('#', ''))
        current_desc = pokemon['description']
        
        # Verificar se já está em português (palavras comuns em PT-BR)
        pt_words = ['um ', 'uma ', 'o ', 'a ', 'os ', 'as ', 'é ', 'são ', 'tem ', 'têm ', 
                   'pode ', 'com ', 'para ', 'por ', 'que ', 'quando ', 'onde ', 'como ']
        is_portuguese = any(word in current_desc.lower() for word in pt_words)
        
        if is_portuguese:
            print(f"✓ {pokemon['name']} (#{pokedex_num:03d}) - já em português")
            continue
        
        print(f"Traduzindo {pokemon['name']} (#{pokedex_num:03d})...", end=' ')
        
        # Buscar descrição em português
        pt_description = get_portuguese_description(pokedex_num)
        
        if pt_description:
            pokemon['description'] = pt_description
            updated += 1
            print(f"✓ Traduzido")
        else:
            not_found += 1
            print(f"⚠ Não encontrado em PT")
        
        # Pequeno delay para não sobrecarregar a API
        time.sleep(0.1)
        
        # Salvar a cada 10 pokemons para não perder progresso
        if i % 10 == 0:
            with open(f'src/data/generation-{gen}.json', 'w', encoding='utf-8') as f:
                json.dump(pokemons, f, ensure_ascii=False, indent=2)
    
    # Salvar arquivo final
    with open(f'src/data/generation-{gen}.json', 'w', encoding='utf-8') as f:
        json.dump(pokemons, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Geração {gen} concluída!")
    print(f"  Traduzidos: {updated}")
    print(f"  Não encontrados: {not_found}")

print(f"\n{'='*60}")
print("Todas as descrições foram atualizadas!")
print(f"{'='*60}")
