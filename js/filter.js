'use strict';

(function () {
  var PINS_LIMIT = 5;
  var filter = document.querySelector('.map__filters');
  var filterItems = filter.querySelectorAll('select, input');
  var typeSelect = filter.querySelector('#housing-type');
  var priceSelect = filter.querySelector('#housing-price');
  var roomsSelect = filter.querySelector('#housing-rooms');
  var guestsSelect = filter.querySelector('#housing-guests');
  var featuresFieldset = filter.querySelector('#housing-features');
  var PriceRange = {
    LOW: {
      MIN: 0,
      MAX: 10000
    },
    MIDDLE: {
      MIN: 10000,
      MAX: 50000
    },
    HIGH: {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var onFilterChange = window.form.debounce(function () {
    var filteredData = window.data.slice(0);
    window.pin.remove();
    window.card.remove();
    window.pin.render(filtrationAll(filteredData).slice(0, PINS_LIMIT));
  });

  function filtrationItem(it, item, key) {
    return it.value === 'any' ? true : it.value === item[key].toString();
  }

  function filtrationByType(item) {
    return filtrationItem(typeSelect, item.offer, 'type');
  }

  function filtrationByPrice(item) {
    var filteringPrice = PriceRange[priceSelect.value.toUpperCase()];
    return filteringPrice ? item.offer.price >= filteringPrice.MIN && item.offer.price <= filteringPrice.MAX : true;
  }

  function filtrationByRooms(item) {
    return filtrationItem(roomsSelect, item.offer, 'rooms');
  }

  function filtrationByGuests(item) {
    return filtrationItem(guestsSelect, item.offer, 'guests');
  }

  function filtrationByFeatures(item) {
    var checkedFeaturesItems = featuresFieldset.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  }

  function filtrationAll(data) {
    return data.filter(function (item) {
      return filtrationByType(item) &&
      filtrationByPrice(item) &&
      filtrationByRooms(item) &&
      filtrationByGuests(item) &&
      filtrationByFeatures(item);
    });
  }

  function activateFilter() {
    filterItems.forEach(function (it) {
      it.disabled = false;
    });
    onFilterChange();
    filter.addEventListener('change', onFilterChange);
  }

  function resetFilter() {
    filterItems.forEach(function (it) {
      it.value = 'any';
    });
    var featuresItems = featuresFieldset.querySelectorAll('input');
    featuresItems.forEach(function (feature) {
      feature.checked = false;
    });
  }

  function deactivateFilter() {
    filterItems.forEach(function (it) {
      it.disabled = true;
    });
    resetFilter();
    filter.removeEventListener('change', onFilterChange);
  }

  function activateFiltration(adData) {
    activateFilter();
    return adData.slice(0, PINS_LIMIT);
  }

  function deactivateFiltration() {
    deactivateFilter();
  }

  window.filter = {
    activate: activateFiltration,
    deactivate: deactivateFiltration
  };
})();
