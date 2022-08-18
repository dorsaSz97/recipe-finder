class PaginationView {
  _parentElement = document.querySelector('.pagination');
  _data;

  render(data) {
    this._data = data; //search object of the model's state

    this.clear();

    const html = this._createHTML();
    this._parentElement.insertAdjacentHTML('beforeend', html);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  // -----EVENT HANDLERS------
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;

      // we need to have a connection between dom and what we wanna happen
      handler(+btn.dataset.goto);
    });
  }

  _createHTML() {
    const currentPage = this._data.currPage;
    const allPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // having multiple ifs is better than super nested if/else
    // 1) we only have one page -> no buttons
    if (currentPage === 1 && allPages === 1) {
      return `
      <button data-goto="" class="pagination__btn pagination__btn--prev">
        <span></span>
      </button>

        <span>${currentPage}</span>
        
      <button data-goto="" class="pagination__btn pagination__btn--next">
        <span></span>
      </button>
      `;
    }

    // 2) we are on the last page and there were other pages before
    if (currentPage === allPages && allPages > 1) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="pagination__btn pagination__btn--prev">
        <span>&lt; Page ${currentPage - 1}</span>
      </button>

        <span>${currentPage}</span>
        
      <button data-goto="" class="pagination__btn pagination__btn--next">
        <span></span>
      </button>
      `;
    }

    // 3) we are on the first page and there are other pages after
    if (currentPage === 1 && allPages > 1) {
      return `
      <button data-goto="" class="pagination__btn pagination__btn--prev">
        <span></span>
      </button>

        <span>${currentPage}</span>
        
      <button data-goto="${
        currentPage + 1
      }" class="pagination__btn pagination__btn--next">
        <span>Page ${currentPage + 1} &gt;</span>
      </button>
      `;
    }
    // 4) we are somewhere in the middle
    if (currentPage < allPages) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="pagination__btn pagination__btn--prev">
        <span>&lt; Page ${currentPage - 1}</span>
      </button>

        <span>${currentPage}</span>
        
      <button data-goto="${
        currentPage + 1
      }" class="pagination__btn pagination__btn--next">
        <span>Page ${currentPage + 1} &gt;</span>
      </button>
      `;
    }

    return '';
  }
}

export default new PaginationView();
