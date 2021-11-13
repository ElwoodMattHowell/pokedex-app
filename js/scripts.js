let pokemonRepository = (function () {
  let pokemonList = [];

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function showModal(pokemon) {
    let modalBody = $('.modal-body');
    let modalTitle = $('.modal-title');
    modalTitle.empty();
    modalBody.empty();

    let nameElement = $('<h4></h4>');
    let heightElement = $('<p></p>');
    let typesElement = $('<p></p>');
    let pictureElement = $('<img>');
    let pokemonTypes = [];

    loadDetails(pokemon).then(function () {
      nameElement.html(pokemon.name);
      heightElement.html(`<p>Height: ${pokemon.height}mm</p>`);
      pictureElement.attr({
        src: pokemon.artImageUrl,
        alt: `picture of ${pokemon.name}`,
      });
      pictureElement.addClass('modal-image');
    });

	  Object.keys(pokemon.types).forEach(key => {
			pokemonTypes.push(' ' + pokemon.types[key].type.name);
		});

		typesElement.text(`Type(s):  ${pokemonTypes}`);

    modalTitle.append(nameElement);
    modalBody.append(pictureElement);
    modalBody.append(heightElement);
    modalBody.append(typesElement);

    $('input').val('');
  }

  function addListItem(pokemon) {
    let pokeList = $('#poke-list');
    let listItem = $('<li></li>');
    let button = $('<button></button>');
    button.attr({
      type: 'button',
      'data-toggle': 'modal',
      'data-target': '#modal',
    });
    loadDetails(pokemon).then(function () {
      button.html(`
              <img src='${pokemon.imageUrl}'>
              <p>${pokemon.name}</p>
              `)
    });
    button.addClass('poke-button btn btn-lg');
    listItem.addClass('list-group-item col-xl-3 col-lg-4 col-md-5 col-sm-6 col-xs-10 align-items-center');
    listItem.append(button);
    pokeList.append(listItem);
    addListener(button, pokemon);
  }

  function addListener(button, pokemon) {
    button.on('pointerdown', function () {
      showModal(pokemon);
    });
  }

  function addSearch() {
    let searchButton = $('#search-button');
    searchButton.on('pointerdown', function () {
      search($('input').val());
    });
  }

  function search(pokename) {
    let result = pokemonList.find(
      ({ name }) => name === pokename.toLowerCase()
    );
    if (result) {
      showModal(result);
    } else {
      alert(`${pokename} is not on my list.  Try again.`);
      $('input').val('');
    }
  }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            types: item.types,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.artImageUrl = details.sprites.other['official-artwork'].front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }


    let navButton = $('#hamburger-button');
    let main = $('main');
    navButton.on('pointerdown', function () {
      main.addClass('navPad');
    });

  
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    addSearch: addSearch,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

pokemonRepository.addSearch();
