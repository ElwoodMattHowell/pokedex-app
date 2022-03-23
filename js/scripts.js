
let pokemonRepository = (function () {
  let pokemonList = [];

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // takes pokemon object and adds it to pokemonList
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  // returns pokemon list
  function getAll() {
    return pokemonList;
  }

  function filterSearch(name) {
    if (!name) {
      return pokemonList
    } else {
      let newPokeList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()));
      // console.log(pokemonList[0].name.split(""));
      // console.log(newPokeList);
      return newPokeList;
    }
  }

  function findPokemon() {
    pokemonList.forEach(addListItem);
    let container = document.getElementById('poke-list');

    document.getElementById('search-bar').addEventListener('input', (event) => {
      container.innerHTML = '';
      console.log(event.target.value);
      let filteredList = filterSearch(event.target.value);
      filteredList.forEach(addListItem);
    });
  }

  // loads pokemon content to modal
  function showModal(pokemon) {
    let modalBody = $('.modal-body');
    let modalTitle = $('.modal-title');
    modalTitle.empty();
    modalBody.empty();

    let heightElement = $('<p></p>');
    let typesElement = $('<p></p>');
    let pictureElement = $('<img>');
    let pokemonTypes = [];

    loadDetails(pokemon).then(function () {
      modalTitle.text(pokemon.name);
      heightElement.text(`Height: ${pokemon.height}mm`);
      pictureElement.attr({
        src: pokemon.artImageUrl,
        alt: `picture of ${pokemon.name}`
      });
      pictureElement.addClass('modal-image');
    });

    // iterates through 'types' array and stringifys the values
    Object.keys(pokemon.types).forEach(key => {
      pokemonTypes.push(' ' + pokemon.types[key].type.name);
    });

    typesElement.text(`Type(s):  ${pokemonTypes}`);

    modalBody.append(pictureElement);
    modalBody.append(heightElement);
    modalBody.append(typesElement);

    $('input').val('');
  }

  // builds and displays list of pokemon
  function addListItem(pokemon) {
    let pokeList = $('#poke-list');
    let listItem = $('<li></li>');
    let button = $('<button></button>');
    let pokeImage = $('<img/>');
    let pokeName = $('<p></p>');

    button.attr({
      type: 'button',
      'data-toggle': 'modal',
      'data-target': '#modal'
    });

    loadDetails(pokemon).then(function () {
      pokeImage.attr({
        src: `${pokemon.imageUrl}`,
        alt: `picture of ${pokemon.name}`
      });
      pokeName.text(pokemon.name);
    });

    button.addClass('poke-button btn btn-lg');
    listItem.addClass('list-group-item');
    listItem.addClass('col-xl-3 col-lg-4 col-md-5 col-sm-6 col-xs-10 align-items-center');

    button.append(pokeImage);
    button.append(pokeName);
    listItem.append(button);
    pokeList.append(listItem);

    addListener(button, pokemon);
  }

  // prompts modal to show when button is clicked
  function addListener(button, pokemon) {
    button.on('pointerdown', function () {
      showModal(pokemon);
    });
  }

  /**
    * Fetches the full list of Pokemon from the pokeAPI, then creates a pokemon object
    *  for each one and calls add on it.
    */
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
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //load details of each pokemon
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

  //calls search function when search button is clicked


  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    findPokemon: findPokemon
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.findPokemon()
});
