/**
 * tcgService.js
 * Busca e faz cache de cartas Pokémon TCG.
 */
const CACHE_STORAGE_KEY = 'tcgCardCache';
const tcgCache = new Map();

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizePokemonName(pokemonName) {
  return pokemonName.trim().toLowerCase();
}

function initializeCache() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const stored = localStorage.getItem(CACHE_STORAGE_KEY);
  const parsed = stored && safeParseJson(stored);

  if (parsed && typeof parsed === 'object') {
    Object.entries(parsed).forEach(([name, imageUrl]) => {
      if (typeof imageUrl === 'string' && imageUrl.length) {
        tcgCache.set(name, imageUrl);
      }
    });
  }
}

function persistCache() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(Object.fromEntries(tcgCache)));
}

async function fetchTcgCardImage(pokemonName) {
  const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(pokemonName)}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('API Pokémon TCG indisponível');
  }

  const data = await response.json();
  return data?.data?.[0]?.images?.large || null;
}

export function setupTcgCache() {
  initializeCache();
}

export async function getTcgCardImage(pokemonName) {
  const key = normalizePokemonName(pokemonName);

  if (tcgCache.has(key)) {
    return tcgCache.get(key);
  }

  try {
    const imageUrl = await fetchTcgCardImage(pokemonName);
    if (imageUrl) {
      tcgCache.set(key, imageUrl);
      persistCache();
      return imageUrl;
    }
  } catch (error) {
    console.error('Erro ao buscar card TCG:', error);
  }

  return null;
}
