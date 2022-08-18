import './styles/index.scss';
import * as model from './js/model.js';
import searchView from './js/views/searchView';
import resultsView from './js/views/resultsView';
import paginationView from './js/views/paginationView';
import recipeView from './js/views/recipeView';
import navigationView from './js/views/navigationView';
import cartView from './js/views/cartView';
import weekdaysView from './js/views/weekdaysView';

const controlDisplayRecipe = async function (recipe) {
  try {
    // 1) Creating a new recipe object for the current clicked recipe
    const currRecipe = await model.loadCurrentRecipe(recipe);

    // 2) Render the clicked recipe
    recipeView.render(currRecipe);
  } catch (err) {
    console.error(err);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.currRecipe);
};

const controlBookmark = function () {
  // 1) Toggle the bookmarked property of the current recipe
  if (model.state.currRecipe.bookmarked) {
    model.removeBookmark(model.state.currRecipe);
  } else {
    // should be else because otherwise both will happen one after the other and the first if wouldnt take effect
    model.addBookmark(model.state.currRecipe);
  }

  // 2) Render the new recipeView with the bookmark icon filled
  recipeView.update(model.state.currRecipe);
};

const controlExtraDetails = function (mealplan, checkedIngredients) {
  // 1) Add the chosen day and time for the current recipe to the array of mealplans
  model.addMealplan(mealplan, model.state.currRecipe);

  // 2) Add the checked ingredients to the model
  model.addToCart(checkedIngredients);

  // 3) Render ingredients to the cartView
  cartView.render(model.state.cart);

  // 4) Render the new bookmarks

  if (document.querySelector('nav').dataset.currentPage === 'bookmarks')
    resultsView.render(model.state.bookmarks);
};

const controlDailyMealResults = function (day) {
  const mealsForDay = model.loadDailyMealplan(day);

  resultsView.renderDailyMeals(mealsForDay);
};

// DONEs

const controlDeleteIngredients = function (ingredient) {
  //  1) Delete the ingredient
  model.removeFromCart(ingredient);

  // 2) Render the new cart
  cartView.render(model.state.cart);
};

const controlCartLoad = function () {
  cartView.render(model.state.cart);
};

const controlSearchResults = async function () {
  try {
    // 1) Render the spinner in the resultsView until the data is loaded
    resultsView.renderSpinner();

    // 2) Get the search query the user has entered
    const query = searchView.getSearchQuery();
    // guard clause
    if (!query) return;

    // 3) Load the data from the API with the query
    await model.getSearchResults(query);

    // 4 ) Load the correct amount of results based on the currPage (its page 1 by default => the first 6 results)
    const refinedData = model.getSearchResultsPage();

    // 5) Based on the received data render the results from the correct page
    resultsView.render(refinedData);

    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new set of results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlBrowseResults = function () {
  paginationView.clear();
  navigationView.activateLinks();
  // 2) Making the search field ready to be typed in
  searchView.makeClickable();

  resultsView.renderMessage();
};

const controlBookmarksResults = function () {
  paginationView.clear();
  navigationView.activateLinks();
  // 1) Making the search field unavailable
  searchView.makeNotClickable();

  // 2) Render the bookmarks in the reusltsView instead of all the searched recipes
  resultsView.render(model.state.bookmarks);
};

const controlMealplanResults = function () {
  paginationView.clear();
  navigationView.activateLinks();
  searchView.makeNotClickable();

  // 2) Render the mealplan in the reusltsView instead of all the searched recipes
  resultsView.render(model.state.mealplans, true);
};

const init = function () {
  resultsView.renderMessage();
  cartView.addHandlerDelete(controlDeleteIngredients);
  cartView.addHandlerLoad(controlCartLoad);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  navigationView.addHandlerBrowseClick(controlBrowseResults);
  navigationView.addHandlerBookmarksClick(controlBookmarksResults);
  navigationView.addHandlerMealplanClick(controlMealplanResults);

  resultsView.addHandlerClick(controlDisplayRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  recipeView.addHandlerClose(controlExtraDetails);

  weekdaysView.addHandlerClick(controlDailyMealResults);
};

// because this is the entry point and has all the modules imported in it. the other ones are just sitting there waiting for controller's order
init();
