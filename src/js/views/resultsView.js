class ResultsView {
  _parentElement = document.querySelector('.recipes');
  _data;
  _message = 'Search for something delicious to cook :)';

  renderSpinner() {
    const html = `
    <div class="spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  `;
    // makes sure we are only showing the spinner inside that container
    this._clear();
    document.querySelector('.pagination').innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  render(data, isMealPlan = false) {
    if (Object.keys(data).length === 0 && !Array.isArray(data)) {
      this._clear();
      this.renderMessage('No favorite meals');
      return;
    }

    // we always wanna store outside values, inside the class in a property and not manipulate them directly
    this._data = data;

    // make sure we are not showing the spinner (clear out the space entirely)
    this._clear();

    if (!isMealPlan) {
      // create the html code for each recipe
      const html = this._createHTML();
      this._parentElement.insertAdjacentHTML('beforeend', html);
    } else {
      const html = this._createMealplanHTML();
      this._parentElement.insertAdjacentHTML('beforeend', html);
    }
  }

  renderDailyMeals(data) {
    this._data = data;

    document.querySelector('.weekly-meals-container').innerHTML = '';
    const html = this._createDailyMealsHTML();
    document
      .querySelector('.weekly-meals-container')
      .insertAdjacentHTML('beforeend', html);
  }
  renderMessage(message = this._message) {
    const html = `
      <div class="message">
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  _createHTML() {
    const html = this._data
      .map(meal => {
        return `
        <article class="recipe">
          <figure class="recipe__image">
            <img
              src="${meal.imageUrl}"
              alt="${meal.name}"
            />
          </figure>
          <p class="recipe__name">
            ${meal.name}
          </p>
        </article>
      `;
      })
      .join(''); // array of article code that are now a long string of articles to put in the code

    return html;
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _createMealplanHTML() {
    const html = `
            <div class="weekdays">
              <button class="weekdays__btn" data-day="saturday">Sat</button>
              <button class="weekdays__btn" data-day="sunday">Sun</button>
              <button class="weekdays__btn" data-day="monday">Mon</button>
              <button class="weekdays__btn" data-day="tuesday">Tue</button>
              <button class="weekdays__btn" data-day="wednesday">Wed</button>
              <button class="weekdays__btn" data-day="thursday">Thu</button>
              <button class="weekdays__btn" data-day="friday">Fri</button>
            </div>
            <div class="weekly-meals-container"></div>
          `;
    return html;
  }

  _createDailyMealsHTML() {
    console.log(this._data);

    // ????? maybe i can write it with switch and less code
    const html = `

          <section class="meal-type breakfast">
            <p>Breakfast</p>
            <ul class="meal-type__list">
            ${this._data
              .map(meal => {
                if (meal.time === 'breakfast')
                  return `
                <article class="recipe">
                  <figure class="recipe__image">
                    <img
                      src="${meal.imageUrl}"
                      alt="${meal.name}"
                    />
                  </figure>
                  <p class="recipe__name">
                    ${meal.name}
                  </p>
                </article>
              `;
              })
              .join('')}
            </ul>
          </section>
          <section class="meal-type lunch">
            <p>Lunch</p>
            <ul class="meal-type__list">
            ${this._data
              .map(meal => {
                if (meal.time === 'lunch')
                  return `
                <article class="recipe">
                  <figure class="recipe__image">
                    <img
                      src="${meal.imageUrl}"
                      alt="${meal.name}"
                    />
                  </figure>
                  <p class="recipe__name">
                    ${meal.name}
                  </p>
                </article>
              `;
              })
              .join('')}
            </ul>
          </section>

          <section class="meal-type dinner">
            <p>Dinner</p>
            <ul class="meal-type__list">
            ${this._data
              .map(meal => {
                if (meal.time === 'dinner')
                  return `
                <article class="recipe">
                  <figure class="recipe__image">
                    <img
                      src="${meal.imageUrl}"
                      alt="${meal.name}"
                    />
                  </figure>
                  <p class="recipe__name">
                    ${meal.name}
                  </p>
                </article>
              `;
              })
              .join('')}
            </ul>
          </section>

      `;
    return html;
  }

  // -----EVENT HANDLERS------

  addHandlerClick(handler) {
    // event delegation => because most events bubble up to their parent
    this._parentElement.addEventListener('click', e => {
      const article = e.target.closest('.recipe');
      if (!article) return;

      // sending the clicked recipes name to be loaded
      this._data.forEach(meal => {
        if (meal.name === article.querySelector('.recipe__name').innerText)
          handler(meal);
      });
    });
  }
}

export default new ResultsView();
