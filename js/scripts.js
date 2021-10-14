
let pokemonRepository = (function () {

  let pokemonList = [
    {name: 'Bulbasaur', height: 0.7, types:['Grass','Poison']},
    {name: 'Charizard', height: 1.7, types:['Fire','Flying']},
    {name: 'Blastoise', height: 0.6, types:['Water']},
    {name: 'Arbok', height: 3.5, types:['Poison']},
    {name: 'Nidoking', height: 1.4, types:['Ground','Poison']},
  ];

  function add(pokemon) {
    let keyList = Object.keys(pokemon);
    let eq = keyList.includes('name') && keyList.includes('height') && keyList.includes('types');
    if (typeof pokemon === 'object' && eq) {
      pokemonList.push(pokemon);
    }
    else {
      alert('Pokemon entry is not in correct form.');
    }

  }

  function getAll() {
    return pokemonList;
  }

  function pokeSearch(pokeName) {
    return pokemonList.filter(function(pokemon) {
      return pokemon.name === pokeName;
    });
  }

  function showDetails(pokemon) {
    console.log(pokemon.name);
  }

  function addListItem(pokemon) {
    let pokeList = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('poke-button');
    listItem.appendChild(button);
    pokeList.appendChild(listItem);
    addListener(button, pokemon);
    
    // button.addEventListener('click', function() {
    //   showDetails(pokemon)
    // });
  }

  function addListener(button, pokemon) {
    button.addEventListener('click', function() {
      showDetails(pokemon)
  });
}

  return {
    add: add,
    getAll: getAll,
    pokeSearch: pokeSearch,
    addListItem: addListItem
  };

})();

let newPokemon = {name: 'Raichu', height: .8, types:['Electric']};
pokemonRepository.add(newPokemon);

// let inIndex = pokemonRepository.pokeSearch('Arbok');
// if(inIndex.length != 0) {
//   document.write(`<p> ${inIndex[0].name} (height: ${inIndex[0].height}) (types: ${inIndex[0].types})</p>`);
// }
// else {
//   document.write('Pokemon not found.')
// }

pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
