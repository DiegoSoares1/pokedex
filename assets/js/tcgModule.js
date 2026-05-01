/**
 * tcgModule.js
 * Responsável por buscar e fazer cache de cartas Pokémon TCG
 */

const CACHE_STORAGE_KEY = 'tcgCardCache';
const cache = new Map();

function initializeCache() {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!stored) return;
    
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([name, url]) => {
      if (typeof url === 'string' && url) {
        cache.set(name, url);
      }
    });
  } catch (error) {
    console.warn('Erro ao carregar cache TCG:', error);
  }
}

function persistCache() {
  if (typeof localStorage === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(Object.fromEntries(cache)));
  } catch (error) {
    console.warn('Erro ao salvar cache TCG:', error);
  }
}

async function fetchCardFromApi(pokemonName) {
  const url = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(pokemonName)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('API Pokémon TCG indisponível');
  
  const data = await response.json();
  const card = data?.data?.[0];
  return card?.images?.large || null;
}

export function setupTcgCache() {
  initializeCache();
}

export async function getTcgCardImage(pokemonName) {
  const key = pokemonName.trim().toLowerCase();
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  try {
    const imageUrl = await fetchCardFromApi(pokemonName);
    if (imageUrl) {
      cache.set(key, imageUrl);
      persistCache();
      return imageUrl;
    }
  } catch (error) {
    console.error('Erro ao buscar card TCG:', error);
  }
  
  return null;
}
