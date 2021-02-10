'use strict';

(function () {
  var MessageText = {
    ERROR_LOAD: 'Произошла неизвестная ошибка. Пожалуйста, обновите страницу.',
    ERROR_SERVER: 'Произошла ошибка соединения. Пожалуйста, обновите страницу.',
    ERROR_TIMEOUT: 'Сервер долго не отвечает. Пожалуйста, обновите страницу.'
  };
  var ServerUrl = {
    LOAD: 'https://javascript.pages.academy/keksobooking/data',
    UPLOAD: 'https://javascript.pages.academy/keksobooking'
  };

  function createXhr(method, url, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(MessageText.ERROR_LOAD);
      }
    });
    xhr.addEventListener('error', function () {
      onError(MessageText.ERROR_SERVER);
    });
    xhr.addEventListener('timeout', function () {
      onError(MessageText.ERROR_TIMEOUT);
    });
    xhr.timeout = 3000;
    xhr.open(method, url);
    return xhr;
  }

  function load(onLoad, onError) {
    createXhr('GET', ServerUrl.LOAD, onLoad, onError).send();
  }

  function upload(onLoad, onError, data) {
    createXhr('POST', ServerUrl.UPLOAD, onLoad, onError).send(data);
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();
