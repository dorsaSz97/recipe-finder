class NavigationView {
  _parentElement = document.querySelector('.nav');
  _navActiveName = this._parentElement.dataset.currentPage;

  constructor() {
    this.activateLinks();
  }

  activateLinks() {
    this._navActiveName = this._parentElement.dataset.currentPage;

    this._parentElement
      .querySelectorAll('.nav__link')
      .forEach(link => link.classList.remove('active'));

    this._parentElement
      .querySelector(`.link--${this._navActiveName}`)
      .classList.add('active');
  }

  // -----EVENT HANDLERS------

  addHandlerBookmarksClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.link--bookmarks');
      if (!btn) return;

      document.querySelector('nav').dataset.currentPage = 'bookmarks';

      handler();
    });
  }

  addHandlerMealplanClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.link--mealplan');
      if (!btn) return;

      document.querySelector('nav').dataset.currentPage = 'mealplan';

      handler();
    });
  }

  addHandlerBrowseClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.link--browse');
      if (!btn) return;

      document.querySelector('nav').dataset.currentPage = 'browse';

      handler();
    });
  }
}

export default new NavigationView();
