let pokemonRepository = (function () {

  let pokemonList = [];

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20',
        modalContainer = document.querySelector('#modal-container');

  function add(pokemon) {
      pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  // function pokeSearch(pokeName) {
  //   return pokemonList.filter(function(pokemon) {
  //     return pokemon.name === pokeName;
  //   });
  // }

  function showDetails(pokemon) {
      modalContainer.innerHTML = '';
      let modal = document.createElement('div');
      modal.classList.add('modal');

      let nameElement = document.createElement('h4');
      let heightElement = document.createElement('p');
      let pictureElement = document.createElement('img');

      loadDetails(pokemon).then(function(){
        nameElement.innerText = pokemon.name;
        heightElement.innerText = `Height: ${pokemon.height}`;
        pictureElement.src = pokemon.imageUrl;
      });

      let closeButton = document.createElement('button');
      closeButton.classList.add('modal-close');
      closeButton.innerText = 'X';
      closeButton.addEventListener('pointerdown', hideModal);

      modalContainer.addEventListener('pointerdown', (e) => {
        let target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      })

      modalContainer.appendChild(modal);
      modal.appendChild(closeButton);
      modal.appendChild(nameElement);
      modal.appendChild(heightElement);
      modal.appendChild(pictureElement);

      modalContainer.classList.add('is-visible');
    }

    function hideModal() {
      modalContainer.classList.remove('is-visible');
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
    button.addEventListener('pointerdown', function() {
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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  })

  return {
    add: add,
    getAll: getAll,
    // pokeSearch: pokeSearch,
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
