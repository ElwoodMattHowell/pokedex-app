let pokemonRepository = (function () {

  let pokemonList = [];

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20'
        // modalContainer = $('#modal-container');

  function add(pokemon) {
      pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function showDetails(pokemon) {
      let modalBody = $('.modal-body');
      let modalTitle = $('.modal-title');
      // modalContainer.html('');
      // let modal = $('<div></div>');
      // modal.addClass('modal');
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

      // let closeButton = $('<button></button>');
      // closeButton.addClass('modal-close');
      // closeButton.text('X');
      // closeButton.on('pointerdown', hideModal);

      // modalContainer.on('pointerdown', (e) => {
      //   let target = e.target;
      //   if (target === modalContainer) {
      //     hideModal();
      //   }
      // })

      modalTitle.append(nameElement);
      modalBody.append(pictureElement);
      modalBody.append(heightElement);


      // modalContainer.addClass('is-visible');
    }

    // function hideModal() {
    //   modalContainer.removeClass('is-visible');
    // }

  function addListItem(pokemon) {
    let pokeList = $('.pokemon-list');
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
    // console.log(url);
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

  // $('document').keypress(function(e) {
  // if (e.keyCode === 27) {
  //   hideModal();
  // }
// });

  return {
    add: add,
    getAll: getAll,
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
