import axios from 'axios';
export { ImagesService };

class ImagesService {
  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '34105026-760e87e01f05ad85b03df7d04',
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    });

    const response = await axios.get(`${BASE_URL}?${searchParams}`);

    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  pageReset() {
    this.page = 1;
  }
}
