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
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
});

let page = 1;
let simpleLightbox = null;

refs.loadMoreBtn.style.display = 'none';
refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

async function handleFormSubmit(e) {
  e.preventDefault();

  refs.loadMoreBtn.style.display = 'none';

  page = 1;

  clearMarkup();

  searchParams.set('page', page);

  const query = e.target.elements.searchQuery.value.trim();

  if (query === '') {
    refs.form.reset();
    showNotification(
      notificationType.INFO,
      'Please, enter your search request.'
    );
    return;
  }

  searchParams.set('q', query);

  const response = await getImages();

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

  renderCards(response.data.hits);

  simpleLightbox = new SimpleLightbox('.gallery a');

  refs.loadMoreBtn.style.display = 'block';
}

async function handleLoadMoreBtnClick() {
  page += 1;

  searchParams.set('page', page);

  const response = await getImages();

  renderCards(response.data.hits);

  smoothAutoScroll();

  simpleLightbox.refresh();

  if (
    response.data.totalHits <
    searchParams.get('page') * searchParams.get('per_page')
  ) {
    refs.loadMoreBtn.style.display = 'none';
    showNotification(
      notificationType.INFO,
      "We're sorry, but you've reached the end of search results."
    );
  }
}

async function getImages() {
  try {
    return await axios.get(`${BASE_URL}?${searchParams}`);
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

function smoothAutoScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
