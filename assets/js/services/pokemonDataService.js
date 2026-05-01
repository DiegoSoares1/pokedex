/**
 * pokemonDataService.js
 * Carrega todas as gerações de pokémon e normaliza os dados.
 */
export const GENERATIONS = [
  { id: 1, title: 'Geração I - Kanto' },
  { id: 2, title: 'Geração II - Johto' },
  { id: 3, title: 'Geração III - Hoenn' },
  { id: 4, title: 'Geração IV - Sinnoh' },
  { id: 5, title: 'Geração V - Unova' },
  { id: 6, title: 'Geração VI - Kalos' },
  { id: 7, title: 'Geração VII - Alola' },
  { id: 8, title: 'Geração VIII - Galar' },
  { id: 9, title: 'Geração IX - Paldea' },
];

async function fetchGenerationFile(generationId) {
  const response = await fetch(`./data/generation-${generationId}.json`);
  if (!response.ok) {
    throw new Error(`Falha ao carregar geração ${generationId}: ${response.status}`);
  }
  return response.json();
}

export async function loadAllGenerations() {
  const results = await Promise.allSettled(
    GENERATIONS.map(async (generation) => {
      const pokemons = await fetchGenerationFile(generation.id);
      return {
        generationId: generation.id,
        pokemons: pokemons.map((pokemon) => ({
          ...pokemon,
          generation: generation.id,
        })),
      };
    }),
  );

  return results.reduce((accumulator, result, index) => {
    const generationId = GENERATIONS[index].id;

    if (result.status === 'fulfilled') {
      accumulator[generationId] = result.value.pokemons;
    } else {
      console.error(`Erro ao carregar geração ${generationId}:`, result.reason);
      accumulator[generationId] = [];
    }

    return accumulator;
  }, {});
}
