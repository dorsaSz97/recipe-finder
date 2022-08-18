import iconHeart from '../../assets/img/heart.svg';
import iconHeartFill from '../../assets/img/heart-filled.svg';

class RecipeView {
  _parentElement = document.querySelector('.recipe-window');
  _data;

  // // because it doesnt have anything to do with the logic and its only presentation, we wont do it in the init function of the controller
  // constructor() {
  // this._parentElement.addEventListener('click', e => {
  //   const btn = e.target.closest('.btn--close');
  //   if (!btn) return;

  //   this._hideRecipe();
  // });
  // }

  render(data) {
    this._data = data; // recipe object {}
    this._clear();

    const html = this._createHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', html);

    this._showRecipe();
  }

  update(data) {
    // ??? there could be a better way to do it - check out mutation observer?

    this._data = data;

    // we create the code with the current data but wont put it in the html file
    const newHtml = this._createHTML();

    // this creates a virtual dom for the new html code we have (this is the top of all the html we pass in so we can select them as its child nodes)
    const newDOM = document.createRange().createContextualFragment(newHtml);

    // because newDOM is a dom element, we can select all the nodes in it with qurySAll
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // we select all the nodes we're currently showing
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    // compare the two
    newElements.forEach((newEl, newElIndex) => {
      const currEl = currElements[newElIndex];

      // text
      if (
        !newEl.isEqualNode(currEl) && // ignore if the two are equals
        newEl.firstChild?.nodeValue.trim() !== '' // the node is text and not of other types (otherwise it would change the whole container as well because those are different as well)
      ) {
        currEl.textContent = newEl.textContent;
      }

      // attr
      if (!newEl.isEqualNode(currEl))
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _showRecipe() {
    this._parentElement.style.transform = 'translateY(-102%)';
  }

  _hideRecipe() {
    this._parentElement.style.transform = 'translateY(0%)';
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _createHTML() {
    const html = `
    <button class="btn--close">CLOSE</button>
      <div class="recipe-main-content">
        <div class="recipe-window__left">
          <header class="header">
            <div>
              <span class="category">${this._data.category}</span>
              <div class="recipe-heading">
                <h2>${this._data.name}</h2>
                <img class="btn--bookmark" src=${
                  this._data.bookmarked ? iconHeartFill : iconHeart
                }>
              </div>
            </div>
            <figure class="recipe-window__image">
              <img
                  src="${this._data.imageUrl}"
                  alt="${this._data.name}"
              />
            </figure>
          </header>
          
          <ul class="instructions">
            ${this._data.instructions
              .split('\r\n')
              .filter(instruction => instruction !== '')
              .map((instruction, step) => {
                return `
                <li>
                  <span>STEP ${step + 1} )</span>
                  ${instruction}
                </li>
                `;
              })
              .join('')}
          </ul>
        </div>

        <div class="recipe-window__right">
          <header class="header">
            <h2>ingredients</h2>
            <div class="servings">
              <button class="servings__btn btn--dec"  data-serves="${
                +this._data.servings - 1
              }">
                -
              </button>
              <span>${this._data.servings}</span>
              <button class="servings__btn btn--inc"  data-serves="${
                +this._data.servings + 1
              }">
                +
              </button>
            </div>
          </header>

          <ul class="ingredients">
          ${this._data.ingredients
            .map(ingredient => {
              return `

            <li class="ingredient">
              <input type="checkbox" name="${ingredient.name}" id="${ingredient.name}" />
              <label for="${ingredient.name}">${ingredient.quantity} ${ingredient.unit} ${ingredient.name} </label>
            </li>
           
           `;
            })
            .join('')}
          </ul>


          <div class="mealplan-selections">
            <select name="day" id="day" class="day-selection">
              <option value="">Day...</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
            </select>
            <select name="time" id="time" class="time-selection">
              <option value="">Meal...</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>
      </div>
    `;
    return html;
  }

  // -----EVENT HANDLERS------

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.servings__btn');

      if (!btn) return;

      const { serves } = btn.dataset;
      if (+serves > 0) handler(+serves);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;

      handler();
    });
  }

  addHandlerClose(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--close');
      if (!btn) return;

      const day = document.getElementById('day');
      const time = document.getElementById('time');
      const mealPlan = { day: day.value, time: time.value };

      const checkedIngredients = Array.from(
        document.querySelectorAll('input[type="checkbox"]')
      )
        .filter(inp => inp.checked === true)
        .map(inp => inp.name);

      this._hideRecipe();
      handler(mealPlan, checkedIngredients);
    });
  }
}

export default new RecipeView();
