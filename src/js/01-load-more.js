import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ImagesService } from './services/get-images-service';

const ImagesApi = new ImagesService();

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let simpleLightbox = null;

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

isLoadMoreBtnShown(false);

async function handleFormSubmit(e) {
  e.preventDefault();

  isLoadMoreBtnShown(false);

  clearMarkup();

  ImagesApi.pageReset();

  ImagesApi.query = e.target.elements.searchQuery.value.trim();

  if (ImagesApi.query === '') {
    refs.form.reset();

    showNotification('info', 'Please, enter your search request.');
    return;
  }

  try {
    const {
      hits: images,
      totalHits: totalQuantity,
      total: quantity,
    } = await ImagesApi.getImages();

    if (quantity === 0) {
      showNotification(
        'failure',
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    showNotification('success', `Hooray! We found ${totalQuantity} images.`);

    renderCards(images);

    simpleLightbox = new SimpleLightbox('.gallery a');

    isLoadMoreBtnShown(true);
  } catch {
    showNotification(
      'failure',
      'Something went wrong... Please try again later.'
    );
  }
}

async function handleLoadMoreBtnClick() {
  ImagesApi.incrementPage();

  try {
    const { hits: images, totalHits: totalQuantity } =
      await ImagesApi.getImages();

    renderCards(images);

    autoScrollPage();

    simpleLightbox.refresh();

    if (totalQuantity < ImagesApi.page * ImagesApi.perPage) {
      isLoadMoreBtnShown(false);
      showNotification(
        'info',
        "We're sorry, but you've reached the end of search results."
      );
      renderEndMessage();
    }
  } catch {
    showNotification(
      'failure',
      'Something went wrong... Please try again later.'
    );
  }
}

function renderCards(data) {
  data.map(
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

function isLoadMoreBtnShown(boolean) {
  refs.loadMoreBtn.style.display = boolean ? 'block' : 'none';
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
