export const normalizeText = (text) => text.trim().toLowerCase();

export function formatResultCount(count) {
  if (count === 0) {
    return 'Nenhum pokémon encontrado';
  }

  return count === 1
    ? '1 pokémon encontrado'
    : `${count} pokémons encontrados`;
}
