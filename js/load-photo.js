'use strict';

(function () {
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var avatarChooser = document.querySelector('#avatar');
  var imagesContainer = document.querySelector('.ad-form__photo-container');
  var imageChooser = document.querySelector('#images');
  var ImageParams = {
    WIDTH: '70px',
    HEIGHT: '70px',
    BORDER_RADIUS: '5px'
  };

  function filtrationByType(file) {
    return FILE_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  }

  function changeAvatar(src) {
    avatarPreview.src = src;
  }

  function removeImageEmpty() {
    var emptyImgWrap = document.querySelector('.ad-form__photo--empty');
    if (emptyImgWrap) {
      emptyImgWrap.remove();
    }
  }

  function addImages(src) {
    var newImageWrap = document.createElement('div');
    var image = document.createElement('img');
    newImageWrap.classList.add('ad-form__photo');
    newImageWrap.classList.add('ad-form__photo--added');
    image.src = src;
    image.style.width = ImageParams.WIDTH;
    image.style.height = ImageParams.HEIGHT;
    image.style.borderRadius = ImageParams.BORDER_RADIUS;
    newImageWrap.appendChild(image);
    imagesContainer.appendChild(newImageWrap);
    removeImageEmpty();
  }

  function addImageEmpty() {
    if (!document.querySelector('.ad-form__photo--empty')) {
      var emptyImgWrap = document.createElement('div');
      emptyImgWrap.classList.add('ad-form__photo');
      emptyImgWrap.classList.add('ad-form__photo--empty');
      imagesContainer.appendChild(emptyImgWrap);
    }
  }

  function loadFile(chooser, func) {
    var files = Array.from(chooser.files).filter(filtrationByType);
    if (files) {
      files.forEach(function (it) {
        var reader = new FileReader();
        reader.addEventListener('load', function (evt) {
          func(evt.target.result);
        });
        reader.readAsDataURL(it);
      });
    }
  }

  function removeImages() {
    avatarPreview.src = DEFAULT_AVATAR;
    var addedImages = document.querySelectorAll('.ad-form__photo--added');
    if (addedImages) {
      addedImages.forEach(function (it) {
        it.remove();
      });
    }
    addImageEmpty();
  }

  function onAvatarChange(evt) {
    loadFile(evt.target, changeAvatar);
  }

  function onPhotoChange(evt) {
    loadFile(evt.target, addImages);
  }

  function activate() {
    avatarChooser.addEventListener('change', onAvatarChange);
    imageChooser.addEventListener('change', onPhotoChange);
  }

  function deactivate() {
    avatarChooser.removeEventListener('change', onAvatarChange);
    imageChooser.removeEventListener('change', onPhotoChange);
  }

  window.loadPhoto = {
    activate: activate,
    deactivate: deactivate,
    remove: removeImages
  };
})();
