'use strict';

(function () {
  var similarPopupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var typesMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
  };

  function checkDataAndCreateElement(nodeElement, data, option, insertText) {
    if (!data) {
      nodeElement.style.display = 'none';
      return;
    } else {
      if (option) {
        nodeElement.textContent = insertText;
      } else {
        nodeElement.innerHTML = insertText;
      }
    }
  }

  function createFeaturesPopup(nodeElement, featuresArray) {
    nodeElement.innerHTML = '';
    if (!featuresArray.length) {
      nodeElement.style.display = 'none';
      return;
    }
    featuresArray.forEach(function (feature) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + feature);
      nodeElement.appendChild(li);
    });
  }

  function createPhotosPopup(nodeElement, photosArray) {
    nodeElement.innerHTML = '';
    if (!photosArray.length) {
      nodeElement.style.display = 'none';
      return;
    }
    photosArray.forEach(function (photo) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.src = photo;
      img.width = '45';
      img.height = '40';
      img.alt = 'Фотография жилья';
      nodeElement.appendChild(img);
    });
  }

  function createAvatarPopup(nodeElement, data) {
    if (!data) {
      nodeElement.style.display = 'none';
      return;
    }
    nodeElement.src = data;
  }

  function createPopup(advertising) {
    var popupElement = similarPopupTemplate.cloneNode(true);
    var closePopupButton = popupElement.querySelector('.popup__close');
    createAvatarPopup(popupElement.querySelector('.popup__avatar'), advertising.author.avatar);
    checkDataAndCreateElement(popupElement.querySelector('.popup__title'), advertising.offer.title, true, advertising.offer.title);
    checkDataAndCreateElement(popupElement.querySelector('.popup__title'), advertising.offer.title, true, advertising.offer.title);
    checkDataAndCreateElement(popupElement.querySelector('.popup__text--address'), advertising.offer.address, true, advertising.offer.address);
    checkDataAndCreateElement(popupElement.querySelector('.popup__text--price'), advertising.offer.price, false, advertising.offer.price + '&#x20bd;<span>/ночь</span>');
    checkDataAndCreateElement(popupElement.querySelector('.popup__type'), typesMap[advertising.offer.type], true, typesMap[advertising.offer.type]);
    checkDataAndCreateElement(popupElement.querySelector('.popup__text--capacity'), advertising.offer.rooms, true, advertising.offer.rooms + ' комнаты для ' + advertising.offer.guests + ' гостей');
    checkDataAndCreateElement(popupElement.querySelector('.popup__text--time'), advertising.offer.checkin, true, 'Заезд после ' + advertising.offer.checkin + ', выезд до ' + advertising.offer.checkout);
    createFeaturesPopup(popupElement.querySelector('.popup__features'), advertising.offer.features);
    checkDataAndCreateElement(popupElement.querySelector('.popup__description'), advertising.offer.description, true, advertising.offer.description);
    createPhotosPopup(popupElement.querySelector('.popup__photos'), advertising.offer.photos);
    closePopupButton.addEventListener('click', onPopupCloseLeftClick);
    document.addEventListener('keydown', onPopupCloseEscape);
    removeCard();
    return popupElement;
  }

  function removeCard() {
    var mapCardRemovable = document.querySelector('.map__card');
    if (mapCardRemovable) {
      mapCardRemovable.remove();
    }
  }

  function onPopupCloseLeftClick(evt) {
    if (evt.button === 0) {
      removeCard();
    }
    removeEventListener('click', onPopupCloseLeftClick);
  }

  function onPopupCloseEscape(evt) {
    window.utils.onEscDown(evt, removeCard);
    document.removeEventListener('keydown', onPopupCloseEscape);
  }

  window.card = {
    createPopup: createPopup,
    remove: removeCard
  };
}());
