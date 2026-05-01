/**
 * componentModule.js
 * Responsável por criar elementos DOM de pokémon cards
 */

export function createPokemonCard(pokemon) {
  const card = document.createElement('li');
  card.className = 'card-pokemon';
  card.dataset.name = pokemon.name;
  card.dataset.generation = String(pokemon.generation);

  const info = document.createElement('div');
  info.className = 'informations';
  info.innerHTML = `
    <span>${pokemon.name}</span>
    <span>${pokemon.number}</span>
  `;

  const sprite = document.createElement('img');
  sprite.className = 'gif';
  sprite.src = pokemon.image;
  sprite.alt = `${pokemon.name} gif`;

  const types = document.createElement('ul');
  types.className = 'types';
  pokemon.types.forEach((type, index) => {
    const li = document.createElement('li');
    li.className = `type ${type}`;
    li.textContent = pokemon.typeNames[index] || type;
    types.appendChild(li);
  });

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = pokemon.description;

  card.append(info, sprite, types, description);
  return card;
}
