import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const notificationType = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  INFO: 'info',
};

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

const infiniteScrollObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    handleInfiniteScroll();
  }
});

let page = 0;
let simpleLightbox = null;

refs.form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
  e.preventDefault();

  clearMarkup();

  page = 1;

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

  addObserver();

  simpleLightbox = new SimpleLightbox('.gallery a');
}

async function handleInfiniteScroll() {
  page += 1;

  searchParams.set('page', page);

  const response = await getImages();

  renderCards(response.data.hits);

  autoScrollPage();

  simpleLightbox.refresh();

  if (
    response.data.totalHits <
    searchParams.get('page') * searchParams.get('per_page')
  ) {
    showNotification(
      notificationType.INFO,
      "We're sorry, but you've reached the end of search results."
    );
    renderEndMessage();
    return;
  }

  addObserver();
}

function addObserver() {
  const lastCard = document.querySelector('.gallery > a:last-child');
  if (lastCard) {
    infiniteScrollObserver.observe(lastCard);
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

function renderEndMessage() {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    `
    <p class="end-message">
      The end of search results.
    </p>
    `
  );
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function showNotification(type, message) {
  return Notiflix.Notify[type](message);
}

function autoScrollPage() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
