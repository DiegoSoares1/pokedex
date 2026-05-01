/**
 * pokemonCard.js
 * Componente de cartão de pokémon.
 */
export function createPokemonCard(pokemon) {
  const card = document.createElement('li');
  card.className = 'pokemon-card';
  card.dataset.name = pokemon.name;
  card.dataset.generation = String(pokemon.generation);
  card.dataset.types = pokemon.types.join(',');

  const info = document.createElement('div');
  info.className = 'pokemon-card__info';
  info.innerHTML = `
    <span class="pokemon-card__name">${pokemon.name}</span>
    <span class="pokemon-card__number">${pokemon.number}</span>
  `;

  const sprite = document.createElement('img');
  sprite.className = 'pokemon-card__sprite';
  sprite.src = pokemon.image;
  sprite.alt = `${pokemon.name} gif`;

  const types = document.createElement('ul');
  types.className = 'pokemon-card__types';

  pokemon.types.forEach((type, index) => {
    const typeItem = document.createElement('li');
    typeItem.className = `pokemon-card__type pokemon-card__type--${type}`;
    typeItem.textContent = pokemon.typeNames[index] || type;
    types.appendChild(typeItem);
  });

  const description = document.createElement('p');
  description.className = 'pokemon-card__description';
  description.textContent = pokemon.description;

  card.append(info, sprite, types, description);
  return card;
}
