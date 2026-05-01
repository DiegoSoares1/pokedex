/**
 * pokemonDataModule.js
 * Responsável por carregar dados de pokémons de todas as gerações
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

export async function loadAllGenerations() {
  const data = {};

  await Promise.all(
    GENERATIONS.map(async (gen) => {
      try {
        const response = await fetch(`./data/generation-${gen.id}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const pokemons = await response.json();
        data[gen.id] = pokemons.map(pokemon => ({
          ...pokemon,
          generation: gen.id,
        }));
      } catch (error) {
        console.error(`Erro ao carregar geração ${gen.id}:`, error);
        data[gen.id] = [];
      }
    }),
  );

  return data;
}
