// Referências aos elementos do DOM
const pokedexGrid = document.getElementById('pokedex-grid');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const modal = document.getElementById('pokemon-modal');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.getElementById('close-modal');

// Armazenará todos os dados dos Pokémon para a pesquisa
let allPokemonData = [];
const POKEMON_COUNT = 151; // Vamos buscar a primeira geração

/**
 * Função principal que busca os dados da API
 */
const fetchAllPokemon = async () => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`);
        const data = await response.json();
        const pokemonPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        
        allPokemonData = await Promise.all(pokemonPromises);
        allPokemonData.sort((a, b) => a.id - b.id); // Garante a ordem correta
        
        loader.style.display = 'none';
        displayPokemon(allPokemonData);

    } catch (error) {
        console.error("Falha ao buscar dados dos Pokémon:", error);
        loader.innerHTML = "<p class='text-red-500'>Erro ao carregar os dados. Tente recarregar a página.</p>";
    }
};

/**
 * Exibe os Pokémon na grade com o novo design
 * @param {Array} pokemonList - A lista de Pokémon a ser exibida
 */
const displayPokemon = (pokemonList) => {
    pokedexGrid.innerHTML = '';
    
    pokemonList.forEach(pokemon => {
        const primaryType = pokemon.types[0].type.name;
        const cardColor = getTypeColor(primaryType);
        const pokemonSprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default || pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        const typesHtml = pokemon.types.map(typeInfo =>
            `<span class="text-xs font-semibold text-white px-2 py-1 rounded-full shadow-md" style="background-color: rgba(255, 255, 255, 0.2);">${typeInfo.type.name}</span>`
        ).join(' ');
        
        const card = document.createElement('div');
        card.className = 'relative rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-white overflow-hidden';
        
        card.style.background = `linear-gradient(to bottom right, ${cardColor}, ${adjustColor(cardColor, -40)})`;

        card.innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" class="absolute -bottom-4 -right-4 w-28 h-28 opacity-20 rotate-12" alt="Pokeball watermark">
            <span class="absolute top-2 right-3 font-bold text-lg" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">#${pokemon.id.toString().padStart(3, '0')}</span>
            <img src="${pokemonSprite}" alt="${pokemon.name}" class="w-28 h-28 z-10" style="filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.4));">
            <h2 class="text-xl font-bold capitalize mt-2 z-10 text-shadow-sm">${pokemon.name}</h2>
            <div class="flex gap-2 mt-2 z-10">
                ${typesHtml}
            </div>
        `;
        
        card.addEventListener('click', () => showPokemonDetails(pokemon));
        pokedexGrid.appendChild(card);
    });
};

/**
 * Filtra os Pokémon com base na entrada de pesquisa
 */
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPokemon = allPokemonData.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm) || 
        pokemon.id.toString().padStart(3, '0').includes(searchTerm)
    );
    displayPokemon(filteredPokemon);
});

/**
 * Busca dados da cadeia de evolução e a exibe
 * @param {Object} pokemon - O objeto do Pokémon
 */
const showPokemonDetails = async (pokemon) => {
    try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionChainData = await evolutionChainResponse.json();
        displayModal(pokemon, evolutionChainData);
    } catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
        modalContent.innerHTML = "<p>Não foi possível carregar os detalhes.</p>";
    }
};

/**
 * Constrói e exibe o modal
 * @param {Object} pokemon - Dados do Pokémon
 * @param {Object} evolutionChain - Dados da cadeia de evolução
 */
const displayModal = (pokemon, evolutionChain) => {
    const primaryType = pokemon.types[0].type.name;
    const modalColor = getTypeColor(primaryType);

    const typesHtml = pokemon.types.map(typeInfo => 
        `<span class="px-3 py-1 text-sm text-white rounded-full" style="background-color: ${getTypeColor(typeInfo.type.name)}">${typeInfo.type.name}</span>`
    ).join(' ');

    const statsHtml = pokemon.stats.map(stat => `
        <div class="flex items-center gap-2">
            <span class="capitalize font-semibold w-1/3">${stat.stat.name.replace('-', ' ')}</span>
            <div class="w-2/3 bg-gray-200 rounded-full h-4">
                <div class="h-4 rounded-full text-xs text-white flex items-center justify-end px-2" style="width: ${Math.min(stat.base_stat, 150)}px; background-color: ${modalColor};">${stat.base_stat}</div>
            </div>
        </div>
    `).join('');

    const evolutionHtml = parseEvolutionChain(evolutionChain.chain);

    modalContent.innerHTML = `
        <div class="rounded-lg" style="background: linear-gradient(to bottom right, ${modalColor}, ${adjustColor(modalColor, -40)});">
            <button id="close-modal-inner" class="absolute top-4 right-4 text-white text-3xl font-bold text-shadow">&times;</button>
            <div class="text-center p-6">
                <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" class="w-40 h-40 mx-auto" style="filter: drop-shadow(2px 4px 8px rgba(0,0,0,0.5));">
                <h2 class="text-4xl font-bold capitalize mt-2 text-white text-shadow">${pokemon.name}</h2>
                <p class="text-white/80 mb-4 text-lg">#${pokemon.id.toString().padStart(3, '0')}</p>
                <div class="flex justify-center gap-2">${typesHtml}</div>
            </div>
        </div>
        
        <div class="p-6">
            <h3 class="font-bold text-xl mb-4 border-b pb-2">Estatísticas</h3>
            <div class="space-y-3">${statsHtml}</div>
            
            <h3 class="font-bold text-xl mt-6 mb-4 border-b pb-2">Evoluções</h3>
            <div class="flex justify-around items-center gap-2 flex-wrap">${evolutionHtml}</div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('close-modal-inner').addEventListener('click', () => modal.classList.add('hidden'));
};

/**
 * Função recursiva para percorrer e montar o HTML da cadeia de evolução
 * @param {Object} chain - O objeto da cadeia de evolução
 * @returns {String} - O HTML da cadeia de evolução
 */
const parseEvolutionChain = (chain) => {
    let html = `
        <div class="text-center">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromUrl(chain.species.url)}.png" class="w-24 h-24 mx-auto hover:scale-110 transition-transform">
            <p class="capitalize font-semibold">${chain.species.name}</p>
        </div>
    `;

    if (chain.evolves_to.length > 0) {
        html += '<span class="text-3xl font-bold text-gray-400 self-center">&rarr;</span>';
        chain.evolves_to.forEach(evolution => {
            html += parseEvolutionChain(evolution);
        });
    }
    return html;
};

// Funções Auxiliares
const getPokemonIdFromUrl = (url) => url.split('/').filter(Boolean).pop();

const getTypeColor = (type) => {
    const colors = {
        fire: '#F08030', grass: '#78C850', water: '#6890F0', bug: '#A8B820',
        normal: '#A8A878', poison: '#A040A0', electric: '#F8D030', ground: '#E0C068',
        fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
        ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', steel: '#B8B8D0', dark: '#705848', flying: '#A890F0'
    };
    return colors[type] || '#68A090';
};

const adjustColor = (hex, amount) => {
    return '#' + hex.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};

// Eventos para fechar o modal
closeModalButton.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// Inicia a aplicação
fetchAllPokemon();