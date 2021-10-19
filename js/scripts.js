
let pokemonRepository = (function () {

  let pokemonList = [];
  //   {name: 'Bulbasaur', height: 0.7, types:['Grass','Poison']},
  //   {name: 'Charizard', height: 1.7, types:['Fire','Flying']},
  //   {name: 'Blastoise', height: 0.6, types:['Water']},
  //   {name: 'Arbok', height: 3.5, types:['Poison']},
  //   {name: 'Nidoking', height: 1.4, types:['Ground','Poison']},
  // ];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20';

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ){
      pokemonList.push(pokemon);
    } else {
       console.log('Pokemon entry is not in correct form.');
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
    loadDetails(pokemon).then(function(){
      console.log(pokemon);
    });
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
  }

  function addListener(button, pokemon) {
    button.addEventListener('click', function() {
      showDetails(pokemon)
  });
}

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then( function (json) {
      json.results.forEach( function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
    }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function(details){
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function(e) {
      console.error(e);
    })
  }

  return {
    add: add,
    getAll: getAll,
    pokeSearch: pokeSearch,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
// let newPokemon = {name: 'Raichu', height: .8, types:['Electric']};
// pokemonRepository.add(newPokemon);

// let inIndex = pokemonRepository.pokeSearch('Arbok');
// if(inIndex.length != 0) {
//   document.write(`<p> ${inIndex[0].name} (height: ${inIndex[0].height}) (types: ${inIndex[0].types})</p>`);
// }
// else {
//   document.write('Pokemon not found.')
// }

//pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
