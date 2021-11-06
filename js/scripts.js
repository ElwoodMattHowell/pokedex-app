let pokemonRepository = (function () {

  let pokemonList = [];

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20'

  function add(pokemon) {
      pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function showDetails(pokemon) {
      let modalBody = $('.modal-body');
      let modalTitle = $('.modal-title');
      modalTitle.empty();
      modalBody.empty();

      let nameElement = $('<h4></h4>');
      let heightElement = $('<p></p>');
      let pictureElement = $('<img>');

      loadDetails(pokemon).then(function(){
        nameElement.html(pokemon.name);
        heightElement.html(`Height: ${pokemon.height}`);
        pictureElement.attr('src', pokemon.imageUrl);
      });

      modalTitle.append(nameElement);
      modalBody.append(pictureElement);
      modalBody.append(heightElement);

      $('input').val('');
    }

  function addListItem(pokemon) {
    let pokeList = $('#poke-list');
    let listItem = $('<li></li>');
    let button = $('<button></button>');
    button.attr({type: 'button', 'data-toggle': 'modal', 'data-target': '#modal'});
    button.text(pokemon.name);
    button.addClass('poke-button', 'btn', 'btn-primary');
    listItem.addClass('group-list-item');
    listItem.append(button);
    pokeList.append(listItem);
    addListener(button, pokemon);
  }

  function addListener(button, pokemon) {
    button.on('pointerdown', function() {
      showDetails(pokemon)
  });
}

  function addSearch() {
    let searchButton = $('#search-button');
    searchButton.on('pointerdown', function() {
      search($('input').val());
  });
}

  function search(pokename) {
    let result = pokemonList.find( ({ name }) => name === pokename.toLowerCase() );
    if (result) {
      showDetails(result);
    }
    else {
      alert(`${pokename} is not on my list.  Try again.`)
      $('input').val('');
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
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    addSearch: addSearch
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});

pokemonRepository.addSearch();
