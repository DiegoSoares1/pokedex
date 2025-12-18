document.addEventListener("DOMContentLoaded", () => {
    const buttonAlterTheme = document.getElementById("button-alter-theme");
    const body = document.querySelector("body");
    const imageButtonAlterTheme = document.querySelector(".button-image");

    buttonAlterTheme.addEventListener("click", () => {
        const darkModeIsActive = body.classList.contains("dark-mode");
        body.classList.toggle("dark-mode")
        if (darkModeIsActive) {
            imageButtonAlterTheme.setAttribute("src", "./src/imagens/sun.png")
        }else{
            imageButtonAlterTheme.setAttribute("src", "./src/imagens/moon.png")
        }
    });

    // Funcionalidade de expandir/colapsar gerações
    const generationTitles = document.querySelectorAll(".generation-title");

    generationTitles.forEach(title => {
        title.addEventListener("click", () => {
            const generationSection = title.closest(".generation-section");
            if (generationSection) {
                generationSection.classList.toggle("expanded");
            }
        });
    });

    // Função para criar um card de pokemon
    function createPokemonCard(pokemon) {
        const li = document.createElement("li");
        li.className = "card-pokemon";

        const typesHTML = pokemon.types.map((type, index) => 
            `<li class="type ${type}">${pokemon.typeNames[index]}</li>`
        ).join("");

        li.innerHTML = `
            <div class="informations">
                <span>${pokemon.name}</span>
                <span>${pokemon.number}</span>
            </div>
            <img src="${pokemon.image}" alt="${pokemon.name.toLowerCase()}" class="gif">
            <ul class="types">
                ${typesHTML}
            </ul>
            <p class="description">${pokemon.description}</p>
        `;

        return li;
    }

    // Função para carregar pokemons de uma geração
    async function loadGeneration(generationNumber) {
        try {
            const response = await fetch(`./src/data/generation-${generationNumber}.json`);
            const pokemons = await response.json();
            
            const section = document.getElementById(`generation-${generationNumber}`);
            const listPokemon = section.querySelector(".list-pokemon");
            
            // Limpar lista existente
            listPokemon.innerHTML = "";
            
            // Adicionar pokemons à lista
            pokemons.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                listPokemon.appendChild(card);
            });
        } catch (error) {
            console.error(`Erro ao carregar geração ${generationNumber}:`, error);
        }
    }

    // Carregar todas as gerações
    for (let i = 1; i <= 9; i++) {
        loadGeneration(i);
    }

    // Funcionalidade dos botões Expandir/Colapsar Todas
    const expandAllButton = document.getElementById("expand-all");
    const collapseAllButton = document.getElementById("collapse-all");
    const allGenerationSections = document.querySelectorAll(".generation-section");

    expandAllButton.addEventListener("click", () => {
        allGenerationSections.forEach(section => {
            section.classList.add("expanded");
        });
    });

    collapseAllButton.addEventListener("click", () => {
        allGenerationSections.forEach(section => {
            section.classList.remove("expanded");
        });
    });

    // Atualizar contador de pokemons dinamicamente
    async function updatePokemonCount() {
        let total = 0;
        for (let i = 1; i <= 9; i++) {
            try {
                const response = await fetch(`./src/data/generation-${i}.json`);
                const pokemons = await response.json();
                total += pokemons.length;
            } catch (error) {
                console.error(`Erro ao contar pokemons da geração ${i}:`, error);
            }
        }
        const totalPokemonsElement = document.getElementById("total-pokemons");
        if (totalPokemonsElement) {
            totalPokemonsElement.textContent = total;
        }
    }

    updatePokemonCount();

    // Funcionalidade de Busca e Filtros
    const searchInput = document.getElementById("search-input");
    const typeFilter = document.getElementById("type-filter");
    const generationFilter = document.getElementById("generation-filter");
    const clearFiltersButton = document.getElementById("clear-filters");
    const resultsCount = document.getElementById("search-results-count");

    // Armazenar todos os pokemons carregados
    let allPokemons = {};

    // Carregar todos os pokemons na memória
    async function loadAllPokemons() {
        for (let i = 1; i <= 9; i++) {
            try {
                const response = await fetch(`./src/data/generation-${i}.json`);
                const pokemons = await response.json();
                allPokemons[i] = pokemons;
            } catch (error) {
                console.error(`Erro ao carregar pokemons da geração ${i}:`, error);
            }
        }
    }

    // Função para aplicar filtros
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedType = typeFilter.value;
        const selectedGeneration = generationFilter.value;

        let totalVisible = 0;

        // Iterar sobre todas as gerações
        for (let gen = 1; gen <= 9; gen++) {
            const section = document.getElementById(`generation-${gen}`);
            if (!section) continue;

            const cards = section.querySelectorAll(".card-pokemon");
            let visibleInGen = 0;

            cards.forEach(card => {
                const pokemonName = card.querySelector(".informations span:first-child").textContent.toLowerCase();
                const pokemonNumber = card.querySelector(".informations span:last-child").textContent.toLowerCase();
                const pokemonTypes = Array.from(card.querySelectorAll(".type")).map(type => type.classList[1]);

                // Verificar filtro de geração
                if (selectedGeneration && gen.toString() !== selectedGeneration) {
                    card.classList.add("hidden");
                    return;
                }

                // Verificar filtro de busca
                const matchesSearch = !searchTerm || 
                    pokemonName.includes(searchTerm) || 
                    pokemonNumber.includes(searchTerm.replace(/#/g, ''));

                // Verificar filtro de tipo
                const matchesType = !selectedType || pokemonTypes.includes(selectedType);

                if (matchesSearch && matchesType) {
                    card.classList.remove("hidden");
                    visibleInGen++;
                    totalVisible++;
                } else {
                    card.classList.add("hidden");
                }
            });

            // Expandir automaticamente se houver resultados visíveis
            if (visibleInGen > 0 && (selectedGeneration || searchTerm || selectedType)) {
                section.classList.add("expanded");
            }
        }

        // Atualizar contador de resultados
        if (searchTerm || selectedType || selectedGeneration) {
            resultsCount.textContent = `${totalVisible} pokemon${totalVisible !== 1 ? 's' : ''} encontrado${totalVisible !== 1 ? 's' : ''}`;
            resultsCount.style.display = "block";
        } else {
            resultsCount.style.display = "none";
        }
    }

    // Event listeners
    searchInput.addEventListener("input", applyFilters);
    typeFilter.addEventListener("change", applyFilters);
    generationFilter.addEventListener("change", applyFilters);

    clearFiltersButton.addEventListener("click", () => {
        searchInput.value = "";
        typeFilter.value = "";
        generationFilter.value = "";
        resultsCount.style.display = "none";
        
        // Mostrar todos os pokemons novamente
        document.querySelectorAll(".card-pokemon").forEach(card => {
            card.classList.remove("hidden");
        });
    });

    // Carregar todos os pokemons na memória
    loadAllPokemons();
});