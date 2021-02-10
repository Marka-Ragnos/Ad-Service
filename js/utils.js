'use strict';

(function () {
  function onEscDown(evt, func) {
    if (evt.key === 'Escape') {
      func();
    }
  }

  window.utils = {
    onEscDown: onEscDown
  };
}());
