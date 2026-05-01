/**
 * app.js
 * Controlador principal da aplicação Pokédex.
 */

import { q, qAll, clearElement } from './utils/dom.js';
import { normalizeText, formatResultCount } from './utils/strings.js';
import { GENERATIONS, loadAllGenerations } from './services/pokemonDataService.js';
import { setupTcgCache, getTcgCardImage } from './services/tcgService.js';
import { createPokemonCard } from './components/pokemonCard.js';

const domElements = {
  body: document.body,
  themeButton: q('#button-alter-theme'),
  themeIcon: q('.button-image'),
  totalPokemon: q('#total-pokemons'),
  expandButton: q('#expand-all'),
  collapseButton: q('#collapse-all'),
  searchInput: q('#search-input'),
  typeFilter: q('#type-filter'),
  generationFilter: q('#generation-filter'),
  clearFiltersButton: q('#clear-filters'),
  resultsCount: q('#search-results-count'),
  generationRoot: q('#generation-root'),
  modalOverlay: q('#tcg-modal'),
  modalCloseButton: q('#close-modal'),
  modalImage: q('#tcg-card-image'),
  loadingSpinner: q('#loading-spinner'),
};

const appState = {
  generationData: {},
  cards: [],
};

function renderGenerations() {
  clearElement(domElements.generationRoot);
  appState.cards = [];

  GENERATIONS.forEach((generation) => {
    const section = document.createElement('section');
    section.className = 'generation-section generation-section--expanded';
    section.id = `generation-${generation.id}`;

    const title = document.createElement('h2');
    title.className = 'generation-title';
    title.textContent = generation.title;

    const list = document.createElement('ul');
    list.className = 'pokemon-list';

    const pokemons = appState.generationData[generation.id] || [];
    pokemons.forEach((pokemon) => {
      const card = createPokemonCard(pokemon);
      appState.cards.push(card);
      list.appendChild(card);
    });

    section.append(title, list);
    domElements.generationRoot.appendChild(section);
  });
}

function updateStats() {
  domElements.totalPokemon.textContent = String(appState.cards.length);
}

function updateResultCount(count) {
  if (count === null) {
    domElements.resultsCount.style.display = 'none';
    return;
  }

  domElements.resultsCount.textContent = formatResultCount(count);
  domElements.resultsCount.style.display = 'block';
}

function getActiveFilters() {
  return {
    search: normalizeText(domElements.searchInput.value),
    type: domElements.typeFilter.value,
    generation: domElements.generationFilter.value,
  };
}

function isCardVisible(card, filters) {
  const name = normalizeText(card.dataset.name);
  const typeList = (card.dataset.types || '').split(',');
  const generation = card.dataset.generation;

  const searchMatch = !filters.search || name.includes(filters.search);
  const typeMatch = !filters.type || typeList.includes(filters.type);
  const generationMatch = !filters.generation || generation === filters.generation;

  return searchMatch && typeMatch && generationMatch;
}

function applyFilters() {
  const filters = getActiveFilters();
  let visibleCount = 0;

  appState.cards.forEach((card) => {
    const visible = isCardVisible(card, filters);
    card.classList.toggle('hidden', !visible);

    if (visible) {
      visibleCount += 1;
      const section = card.closest('.generation-section');
      if (section && (filters.search || filters.type || filters.generation)) {
        section.classList.add('generation-section--expanded');
      }
    }
  });

  const hasActiveFilter = Boolean(filters.search || filters.type || filters.generation);
  updateResultCount(hasActiveFilter ? visibleCount : null);
}

function clearFilters() {
  domElements.searchInput.value = '';
  domElements.typeFilter.value = '';
  domElements.generationFilter.value = '';
  applyFilters();
}

async function openTcgModal(pokemonName) {
  domElements.modalOverlay.classList.add('show');
  domElements.modalOverlay.setAttribute('aria-hidden', 'false');
  domElements.loadingSpinner.textContent = 'Carregando...';
  domElements.loadingSpinner.style.display = 'block';
  domElements.modalImage.style.display = 'none';
  domElements.modalImage.src = '';

  const imageUrl = await getTcgCardImage(pokemonName);
  domElements.loadingSpinner.style.display = 'none';

  if (imageUrl) {
    domElements.modalImage.src = imageUrl;
    domElements.modalImage.style.display = 'block';
    return;
  }

  domElements.loadingSpinner.textContent = 'Card não encontrado';
  domElements.loadingSpinner.style.display = 'block';
}

function closeTcgModal() {
  domElements.modalOverlay.classList.remove('show');
  domElements.modalOverlay.setAttribute('aria-hidden', 'true');
}

function handleThemeToggle() {
  const isDarkMode = domElements.body.classList.toggle('dark-mode');
  domElements.themeIcon.src = isDarkMode ? './assets/images/moon.png' : './assets/images/sun.png';
}

function expandAllGenerations() {
  qAll('.generation-section').forEach((section) => section.classList.add('generation-section--expanded'));
}

function collapseAllGenerations() {
  qAll('.generation-section').forEach((section) => section.classList.remove('generation-section--expanded'));
}

function handleGenerationRootClick(event) {
  const title = event.target.closest('.generation-title');
  if (title) {
    title.closest('.generation-section')?.classList.toggle('generation-section--expanded');
    return;
  }

  const card = event.target.closest('.pokemon-card');
  if (card) {
    openTcgModal(card.dataset.name);
  }
}

function setupEventListeners() {
  domElements.themeButton.addEventListener('click', handleThemeToggle);
  domElements.expandButton.addEventListener('click', expandAllGenerations);
  domElements.collapseButton.addEventListener('click', collapseAllGenerations);
  domElements.searchInput.addEventListener('input', applyFilters);
  domElements.typeFilter.addEventListener('change', applyFilters);
  domElements.generationFilter.addEventListener('change', applyFilters);
  domElements.clearFiltersButton.addEventListener('click', clearFilters);
  domElements.generationRoot.addEventListener('click', handleGenerationRootClick);
  domElements.modalCloseButton.addEventListener('click', closeTcgModal);
  domElements.modalOverlay.addEventListener('click', (event) => {
    if (event.target === domElements.modalOverlay) {
      closeTcgModal();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && domElements.modalOverlay.classList.contains('show')) {
      closeTcgModal();
    }
  });
}

async function initialize() {
  setupTcgCache();

  try {
    appState.generationData = await loadAllGenerations();
    renderGenerations();
    updateStats();
    setupEventListeners();
    console.log('✓ Pokédex carregada com sucesso');
  } catch (error) {
    console.error('✗ Erro na inicialização:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
