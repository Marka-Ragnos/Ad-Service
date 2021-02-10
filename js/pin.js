'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  function createPin(advertising) {
    var pinElement = similarPinTemplate.cloneNode(true);
    pinElement.querySelector('img').src = advertising.author.avatar;
    pinElement.querySelector('img').alt = advertising.offer.title;
    pinElement.style = 'left: ' + advertising.location.x + 'px; top: ' + advertising.location.y + 'px;';
    pinElement.addEventListener('click', function () {
      map.appendChild(window.card.createPopup(advertising));
    });
    return pinElement;
  }

  function renderPins(pins) {
    pins.forEach(function (pin) {
      mapPins.appendChild(createPin(pin));
    });
  }

  function removePins() {
    var mapPinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinsItems.forEach(function (it) {
      it.remove();
    });
  }

  window.pin = {
    create: createPin,
    render: renderPins,
    remove: removePins
  };
}());
