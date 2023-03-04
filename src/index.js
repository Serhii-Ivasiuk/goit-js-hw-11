import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const notificationType = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  INFO: 'info',
};

const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '34105026-760e87e01f05ad85b03df7d04',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

function handleFormSubmit(e) {
  e.preventDefault();

  clearMarkup();

  const formInputValue = e.target.elements.searchQuery.value;
  getImages(formInputValue);

  refs.form.reset();
}

function handleLoadMoreBtnClick(e) {
  console.log(e.target);
}

async function getImages(searchQuery) {
  try {
    const response = await axios.get(
      `${BASE_URL}?${searchParams}&q=${searchQuery}`
    );

    if (response.data.total === 0) {
      showNotification(
        notificationType.FAILURE,
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    showNotification(
      notificationType.SUCCESS,
      `Hooray! We found ${response.data.totalHits} images.`
    );

    const imagesData = response.data.hits;

    renderCards(imagesData);
    new SimpleLightbox('.gallery a');
  } catch (error) {
    console.error(error);
  }
}

function renderCards(images) {
  images.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        `
        <a href="${largeImageURL}">
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
          </div>
        </a>
        `
      );
    }
  );
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function showNotification(type, message) {
  return Notiflix.Notify[type](message);
}
