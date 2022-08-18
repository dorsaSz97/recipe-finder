class CartView {
  _parentElement = document.querySelector('.groceries__container');
  _data;
  _errorMsg = 'Nothing in your cart!';

  render(data) {
    this._data = data; // ingredients array ['','','']

    if (this._data.length === 0) {
      this._renderError(this._errorMsg);
      return;
    }

    this._clear();

    const html = this._createHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _createHTML() {
    const html = `
            <ul class="groceries__list">
              ${this._data
                .map(ing => {
                  return `<li class="groceries__item">${ing}</li>`;
                })
                .join('')}
            </ul>
          `;
    return html;
  }

  _renderError(message) {
    this._clear();
    const html = `
          <p class="message">
          ${message}
          </p>
    `;
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  // -----EVENT HANDLERS------
  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', e => {
      const item = e.target.closest('.groceries__item');
      if (!item) return;

      handler(item.innerText);
    });
  }

  // loading the cart from the local storage as soon as the window loads (because there is nothing to click to then load the cart)
  addHandlerLoad(handler) {
    window.addEventListener('load', handler);
  }
}

export default new CartView();
