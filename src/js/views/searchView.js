class SearchView {
  _parentElement = document.querySelector('.search');

  getSearchQuery() {
    const searchQuery =
      this._parentElement.querySelector('.search__field').value;
    // clearing the search field after getting the value of it
    this._clearInput();
    return searchQuery;
  }

  makeNotClickable() {
    this._parentElement.querySelector('.search__field').blur();
    this._parentElement.querySelector('.search__field').style.pointerEvents =
      'none';
  }

  makeClickable() {
    this._parentElement.querySelector('.search__field').focus();
    this._parentElement.querySelector('.search__field').style.pointerEvents =
      'all';
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // -----EVENT HANDLERS------

  // publisher-subscriber pattern
  addHandlerSearch(handler) {
    // submitting is either with pressing the enter key or clicking the button of type submit
    this._parentElement.addEventListener('submit', e => {
      // prevent the page from reloading (we couldnt get the value otherwise)
      e.preventDefault();
      handler();
    });
  }
}

// because we dont want to make multiple instances of this view so we export one instance of it
export default new SearchView();
