#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.parse
import time
import re

def translate_text(text):
    """Traduz texto usando API MyMemory"""
    try:
        text = text.strip()
        if not text:
            return text
        
        encoded_text = urllib.parse.quote(text)
        url = f"https://api.mymemory.translated.net/get?q={encoded_text}&langpair=en|pt-BR"
        
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read())
            if data.get('responseStatus') == 200:
                translated = data['responseData']['translatedText']
                translated = re.sub(r'\s+', ' ', translated).strip()
                return translated
        return text
    except:
        return text

def is_english(description):
    """Verifica se a descrição está em inglês"""
    desc = description.lower()
    english_words = [' the ', ' a ', ' an ', ' it ', ' its ', ' is ', ' are ', ' can ', ' has ', ' have ', ' when ', ' this ', ' that ', ' from ', ' with ', ' and ', ' sweet ', ' aroma ', ' gently ', ' wafts ', ' leaf ', ' head ', ' docile ', ' loves ', ' soak ', ' sun ', ' rays ', ' pokemon ', ' pokémon ', ' uses ', ' attacks ', ' enemy ', ' protection ', ' releases ', ' smell ', ' antenna ', ' away ', ' enemies ', ' body ', ' prefers ', ' things ', ' hot ', ' rain ', ' vapor ', ' tail ', ' nature ', ' barbaric ', ' battle ', ' whips ', ' burning ', ' cuts ', ' sharp ', ' claws ', ' spits ', ' fire ', ' hot ', ' enough ', ' melt ', ' boulders ', ' cause ', ' forest ', ' fires ', ' blowing ', ' flames ', ' retracts ', ' long ', ' neck ', ' shell ', ' shoots ', ' water ', ' vigorous ', ' force ', ' recognized ', ' symbol ', ' longevity ', ' algae ', ' old ', ' crushes ', ' heavy ', ' fainting ', ' pinch ', ' withdraw ', ' inside ', ' seed ', ' plant ', ' back ', ' born ', ' grows ', ' slowly ', ' bulb ', ' grows ', ' seems ', ' lose ', ' ability ', ' stand ', ' hind ', ' legs ', ' plant ', ' blooms ', ' absorbing ', ' solar ', ' energy ', ' remains ', ' movement ', ' seek ', ' light ']
    portuguese_words = [' um ', ' uma ', ' é ', ' são ', ' pode ', ' tem ', ' quando ', ' este ', ' esta ', ' que ', ' com ', ' para ', ' por ', ' seu ', ' sua ', ' há ', ' desde ', ' dia ', ' nasce ', ' cresce ', ' lentamente ', ' pókemon ', ' pokémon ', ' aroma ', ' doce ', ' folha ', ' cabeça ', ' dócil ', ' adora ', ' absorver ', ' raios ', ' sol ', ' flutua ', ' suavemente ', ' cheiro ', ' especiarias ', ' pescoço ', ' pétalas ', ' natureza ', ' tímida ', ' assustado ', ' chamas ', ' costas ', ' batalha ', ' cuidado ', ' virar ', ' possui ', ' corpo ', ' usa ', ' ataca ', ' inimigo ', ' proteção ', ' libera ', ' fedor ', ' antena ', ' afastar ', ' inimigos ', ' prefere ', ' coisas ', ' quentes ', ' chove ', ' vapor ', ' cauda ', ' natureza ', ' bárbara ', ' chicoteia ', ' ardente ', ' corta ', ' afiadas ', ' cospe ', ' fogo ', ' quente ', ' suficiente ', ' derreter ', ' pedregulhos ', ' causar ', ' florestais ', ' soprando ', ' retrai ', ' longo ', ' pescoço ', ' concha ', ' esguicha ', ' água ', ' vigorosa ', ' reconhecido ', ' símbolo ', ' longevidade ', ' algas ', ' antigo ', ' esmaga ', ' pesado ', ' desmaios ', ' pitada ', ' retirará ', ' dentro ', ' semente ', ' planta ', ' costas ', ' nasce ', ' cresce ', ' lentamente ', ' bulbo ', ' parece ', ' perder ', ' capacidade ', ' ficar ', ' patas ', ' traseiras ', ' floresce ', ' absorvendo ', ' energia ', ' solar ', ' permanece ', ' movimento ', ' buscar ', ' luz ']
    
    has_english = any(word in desc for word in english_words)
    has_portuguese = any(word in desc for word in portuguese_words)
    
    return has_english and not has_portuguese

# Processar todas as gerações
total_updated = 0

for gen in range(1, 10):
    print(f"\n{'='*60}")
    print(f"Processando Geração {gen}...")
    print(f"{'='*60}\n")
    
    with open(f'src/data/generation-{gen}.json', 'r', encoding='utf-8') as f:
        pokemons = json.load(f)
    
    updated = 0
    to_translate = [p for p in pokemons if is_english(p['description'])]
    
    print(f"Encontrados {len(to_translate)} pokemons para traduzir de {len(pokemons)} total\n")
    
    for i, pokemon in enumerate(to_translate, 1):
        print(f"[{i}/{len(to_translate)}] Traduzindo {pokemon['name']}...", end=' ')
        
        original = pokemon['description']
        translated = translate_text(original)
        
        if translated and translated != original and len(translated) > 10:
            pokemon['description'] = translated
            updated += 1
            print(f"✓")
        else:
            print(f"⚠")
        
        time.sleep(0.3)
        
        if i % 20 == 0:
            print(f"  Progresso: {i}/{len(to_translate)}")
    
    # Salvar arquivo atualizado
    with open(f'src/data/generation-{gen}.json', 'w', encoding='utf-8') as f:
        json.dump(pokemons, f, ensure_ascii=False, indent=2)
    
    total_updated += updated
    print(f"\n✓ Geração {gen} atualizada: {updated} descrições traduzidas")

print(f"\n{'='*60}")
print(f"Tradução concluída! Total: {total_updated} descrições traduzidas")
print(f"{'='*60}")

