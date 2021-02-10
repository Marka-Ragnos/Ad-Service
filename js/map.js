'use strict';

(function () {
  var TAIL_HEIGHT = 22;
  var DEFAULT_MAIN_PIN_X = 600;
  var DEFAULT_MAIN_PIN_Y = 375;
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = document.querySelectorAll('.ad-form__element');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var filter = document.querySelector('.map__filters');
  var filterItems = filter.querySelectorAll('select, input');
  var roomNumberSelect = document.querySelector('#room_number');
  var addressInput = document.querySelector('#address');
  var titleInput = document.querySelector('#title');
  var activePage = false;
  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65,
  };
  var DragLimit = {
    X: {
      MIN: 0,
      MAX: 1200
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  function activationToggleInput(element, flag) {
    element.forEach(function (it) {
      if (flag) {
        it.disabled = true;
      } else {
        it.disabled = false;
      }
    });
  }

  function setAddressCoords(coords) {
    addressInput.value = coords.x + ', ' + coords.y;
  }

  function getMainPinDefaultCoords() {
    return {
      x: DEFAULT_MAIN_PIN_X,
      y: DEFAULT_MAIN_PIN_Y
    };
  }

  function onLoadSuccess(adData) {
    window.data = adData.slice(0);
    window.filter.activate(adData);
  }

  function onLoadError(errorMessage) {
    window.form.showError(errorMessage);
  }

  function activateMap() {
    window.backend.load(onLoadSuccess, onLoadError);
    window.loadPhoto.activate();
    window.form.checkRooms(roomNumberSelect.value);
    activationToggleInput(filterItems, false);
    activationToggleInput(adFormFieldsets, false);
    setAddressCoords(getMainPinDefaultCoords());
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
  }

  function deactivateMap() {
    window.loadPhoto.deactivate();
    window.loadPhoto.remove();
    window.pin.remove();
    window.card.remove();
    activationToggleInput(filterItems, true);
    activationToggleInput(adFormFieldsets, true);
    setAddressCoords(getMainPinDefaultCoords());
    window.filter.deactivate();
    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    map.classList.add('map--faded');
    mainPin.style.top = DEFAULT_MAIN_PIN_Y - PinSize.HEIGHT / 2 + 'px';
    mainPin.style.left = DEFAULT_MAIN_PIN_X - PinSize.WIDTH / 2 + 'px';
    titleInput.style.border = '';
    activePage = false;
  }

  function onMainPinMouseDownActivate(evt) {
    evt.preventDefault();
    if (evt.button === 0) {
      activateMap();
    }
    mainPin.removeEventListener('mousedown', onMainPinMouseDownActivate);
  }

  function onMainPinKeyDownActivate(evt) {
    evt.preventDefault();
    if (evt.key === 'Enter') {
      activateMap();
    }
    mainPin.removeEventListener('keydown', onMainPinKeyDownActivate);
  }

  function onMainPinMouseDown(evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var mainPinPosition = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };
      var Border = {
        TOP: DragLimit.Y.MIN - mainPin.offsetHeight - TAIL_HEIGHT,
        BOTTOM: DragLimit.Y.MAX - mainPin.offsetHeight - TAIL_HEIGHT,
        LEFT: DragLimit.X.MIN - mainPin.offsetWidth / 2,
        RIGHT: DragLimit.X.MAX - mainPin.offsetWidth / 2
      };
      if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
        mainPin.style.left = mainPinPosition.x + 'px';
      }
      if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
        mainPin.style.top = mainPinPosition.y + 'px';
      }
      var pinTailCoords = {
        x: mainPinPosition.x + Math.ceil(PinSize.WIDTH / 2),
        y: mainPinPosition.y + PinSize.HEIGHT + TAIL_HEIGHT
      };
      setAddressCoords(pinTailCoords);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      if (!activePage) {
        activePage = true;
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function initPage() {
    deactivateMap();
    activePage = false;
    mainPin.addEventListener('mousedown', onMainPinMouseDownActivate);
    mainPin.addEventListener('keydown', onMainPinKeyDownActivate);
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
  }

  initPage();

  window.map = {
    initPage: initPage
  };
}());
