'use strict';

(function () {
  var RED_BORDER = '2px solid red';
  var DEBOUNCE_INTERVAL = 500;
  var adForm = document.querySelector('.ad-form');
  var resetBtn = document.querySelector('.ad-form__reset');
  var main = document.querySelector('main');
  var capacitySelect = document.querySelector('#capacity');
  var roomNumberSelect = document.querySelector('#room_number');
  var priceInput = document.querySelector('#price');
  var typeInput = document.querySelector('#type');
  var titleInput = document.querySelector('#title');
  var timeInInput = document.querySelector('#timein');
  var timeOutInput = document.querySelector('#timeout');
  var RoomValues = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };
  var buildingMinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  function checkRooms(peopleAmount) {
    var capacityOptions = capacitySelect.querySelectorAll('option');
    capacityOptions.forEach(function (option) {
      option.disabled = true;
    });
    RoomValues[peopleAmount].forEach(function (setAmount) {
      capacityOptions.forEach(function (option) {
        if (Number(option.value) === setAmount) {
          option.disabled = false;
          option.selected = true;
        }
      });
    });
  }

  function onTypeInputChange(evt) {
    priceInput.min = buildingMinPrice[evt.target.value];
    priceInput.placeholder = buildingMinPrice[evt.target.value];
  }

  function onTitleGetBorder() {
    titleInput.style.border = RED_BORDER;
  }

  function onInputCheckTimeOfCheckIn() {
    timeOutInput.value = timeInInput.value;
  }

  function onInputCheckTimeOfCheckout() {
    timeInInput.value = timeOutInput.value;
  }

  function onAdFormSubmit(evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);
    window.backend.upload(onSubmitSuccess, onSubmitError, formData);
  }

  function onSubmitSuccess() {
    showSuccess();
    window.map.initPage();
  }

  function onSubmitError(errorMessage) {
    showError(errorMessage);
  }

  function createErrorMessage(errorMessage) {
    var similarErrorMessage = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var errorButton = similarErrorMessage.querySelector('.error__button');
    var message = similarErrorMessage.querySelector('.error__message');
    message.textContent = errorMessage;
    errorButton.addEventListener('click', onErrorClick);
    main.append(similarErrorMessage);
  }

  function createSuccessMessage() {
    var similarSuccessMessage = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    similarSuccessMessage.addEventListener('click', onSuccessClick);
    main.append(similarSuccessMessage);
  }

  function deleteSuccessMessage() {
    var successMessage = main.querySelector('.success');
    successMessage.remove();
  }

  function deleteErrorMessage() {
    var errorMessageGenerated = main.querySelector('.error');
    errorMessageGenerated.remove();
  }

  function showSuccess() {
    createSuccessMessage();
    document.addEventListener('keydown', onSuccessEscDown);
  }

  function showError(errorMessage) {
    createErrorMessage(errorMessage);
    document.addEventListener('keydown', onErrorEscDown);
  }

  function closeSuccess() {
    deleteSuccessMessage();
    document.removeEventListener('keydown', onSuccessEscDown);
  }

  function closeError() {
    deleteErrorMessage();
    document.removeEventListener('keydown', onErrorEscDown);
  }

  function onSuccessEscDown(evt) {
    window.utils.onEscDown(evt, closeSuccess);
  }

  function onErrorEscDown(evt) {
    window.utils.onEscDown(evt, closeError);
  }

  function onSuccessClick() {
    closeSuccess();
  }

  function onErrorClick() {
    closeError();
  }

  function onResetBtnClick(evt) {
    evt.preventDefault();
    window.map.initPage();
    window.loadPhoto.remove();
  }

  function debounce(fun) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  }

  function onTitleCheckValidity() {
    var valueLength = titleInput.value.length;
    var minValueLength = titleInput.getAttribute('minlength');
    var maxValueLength = titleInput.getAttribute('maxlength');
    if (valueLength < titleInput.getAttribute('minlength')) {
      titleInput.setCustomValidity('Ещё ' + (minValueLength - valueLength) + ' симв.');
    } else if (valueLength > maxValueLength) {
      titleInput.setCustomValidity('Удалите лишние ' + (valueLength - maxValueLength) + ' симв.');
    } else {
      titleInput.setCustomValidity('');
    }
  }

  adForm.addEventListener('submit', onAdFormSubmit);
  resetBtn.addEventListener('click', onResetBtnClick);
  typeInput.addEventListener('change', onTypeInputChange);
  titleInput.addEventListener('invalid', onTitleGetBorder);
  timeInInput.addEventListener('change', onInputCheckTimeOfCheckIn);
  timeOutInput.addEventListener('change', onInputCheckTimeOfCheckout);
  titleInput.addEventListener('input', onTitleCheckValidity);
  roomNumberSelect.addEventListener('change', function (evt) {
    var target = evt.target;
    checkRooms(target.value);
  });

  window.form = {
    checkRooms: checkRooms,
    debounce: debounce,
    showError: showError,
  };
}());
