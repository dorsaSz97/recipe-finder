import { API_URL, PER_PAGE } from './config.js';

// TODO: create svg sprite
// TODO: everything in webpack
// TODO: backdrop for the recipe view

export const state = {
  currRecipe: {},
  search: {
    results: [], // array of result objects [{},{}]
    resultsPerPage: PER_PAGE,
    currPage: 1,
  },
  bookmarks: [],
  mealplans: [],
  cart: [],
};

// DONE
export const getSearchResults = async function (query) {
  try {
    const res = await fetch(`${API_URL}search.php?s=${query}`);
    const data = await res.json(); //{melas:[]}

    if (data.meals === null) throw new Error('Something wrong with fetching');

    // go to first page after a new search
    state.search.currPage = 1;

    state.search.results = data.meals.map(meal => {
      // creating new objects because we wanna change the property names
      return {
        name: meal.strMeal,
        id: meal.idMeal,
        area: meal.strArea,
        servings: 1,
        category: meal.strCategory,
        instructions: meal.strInstructions,
        imageUrl: meal.strMealThumb,
        videoUrl: meal.strYoutube,
        sourceUrl: meal.strSource,
        ingredients: [],
        bookmarked: false,
      };
    });

    // we have 20 ingredients in the data object and we are putting them in the ingredients array of each result object, in the form of an object with measurement and ingredient's name
    data.meals.map((meal, mealIndex) => {
      for (let i = 1; i <= 20; i++) {
        // if there is any ingredient and its not empty
        if (meal[`strIngredient${i}`]) {
          const ingredient = {};
          ingredient.name = meal[`strIngredient${i}`]; //flour

          if (meal[`strMeasure${i}`].includes('/')) {
            const [firstFraction, secondFraction] = [
              ...meal[`strMeasure${i}`].split(' ')[0].replace('/', '').slice(),
            ];
            ingredient.quantity = +firstFraction / +secondFraction;
            ingredient.unit = meal[`strMeasure${i}`].split(' ')[1];
          } else {
            ingredient.quantity = isNaN(
              Number.parseFloat(meal[`strMeasure${i}`], 10)
            )
              ? meal[`strMeasure${i}`]
              : Number.parseFloat(meal[`strMeasure${i}`], 10);
            ingredient.unit = meal[`strMeasure${i}`]
              .split(ingredient.quantity)[1]
              .trim();
          }

          state.search.results[mealIndex].ingredients.push(ingredient);
        }
      }
    });

    // in each search if they are on the bookmarks array, fill the heart for the recipe
    state.search.results.forEach(result => {
      state.bookmarks.forEach(bookmark => {
        if (result.id === bookmark.id) {
          result.bookmarked = true;
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

// DONE
export const getSearchResultsPage = function (page = state.search.currPage) {
  // update the current page
  state.search.currPage = page;

  const startIndex = state.search.resultsPerPage * (page - 1);
  const endIndex = state.search.resultsPerPage * page;

  // excluding the endIndex itself
  return state.search.results.slice(startIndex, endIndex);
};

export const loadCurrentRecipe = async function (recipe) {
  // keeping track of the current visible recipe
  try {
    const res = await fetch(`${API_URL}lookup.php?i=${recipe.id}`);
    const data = await res.json();
    const currRecipe = data.meals[0]; // recipe object of the current meal {}

    state.currRecipe = {
      name: currRecipe.strMeal,
      id: currRecipe.idMeal,
      area: currRecipe.strArea,
      servings: 1,
      category: currRecipe.strCategory,
      instructions: currRecipe.strInstructions,
      imageUrl: currRecipe.strMealThumb,
      videoUrl: currRecipe.strYoutube,
      sourceUrl: currRecipe.strSource,
      ingredients: [],
      bookmarked: false,
      time: '',
      day: '',
    };

    for (let i = 1; i <= 20; i++) {
      if (currRecipe[`strIngredient${i}`]) {
        const ingredient = {};
        ingredient.name = currRecipe[`strIngredient${i}`];

        if (currRecipe[`strMeasure${i}`].includes('/')) {
          const [firstFraction, secondFraction] = [
            ...currRecipe[`strMeasure${i}`]
              .split(' ')[0]
              .replace('/', '')
              .slice(),
          ];

          ingredient.quantity = +firstFraction / +secondFraction;
          ingredient.unit = currRecipe[`strMeasure${i}`].split(' ')[1];
        } else {
          ingredient.quantity = isNaN(
            Number.parseFloat(currRecipe[`strMeasure${i}`], 10)
          )
            ? currRecipe[`strMeasure${i}`]
            : Number.parseFloat(currRecipe[`strMeasure${i}`], 10);
          ingredient.unit = currRecipe[`strMeasure${i}`]
            .split(ingredient.quantity)[1]
            .trim();
        }

        state.currRecipe.ingredients.push(ingredient);
      }
    }

    state.bookmarks.forEach(bookmark => {
      if (state.currRecipe.id === bookmark.id) {
        state.currRecipe.bookmarked = true;
      }
    });

    return state.currRecipe;
  } catch (err) {
    throw err;
  }
};

export const updateServings = function (newServings) {
  state.currRecipe.ingredients.forEach(ingredient => {
    if (!isNaN(ingredient.quantity))
      return (ingredient.quantity =
        (ingredient.quantity * +newServings) / state.currRecipe.servings);
  });

  state.currRecipe.servings = newServings;
};

const setCartLS = function () {
  localStorage.setItem('cart', JSON.stringify(state.cart));
};

export const addToCart = function (checkedIngredients) {
  if (state.cart.length !== 0) {
    checkedIngredients.forEach(checkedIng => {
      if (
        state.cart.every(item => {
          return checkedIng !== item;
        })
      ) {
        state.cart.push(checkedIng);
      }
    });
  } else {
    state.cart = checkedIngredients;
  }
  setCartLS();
};

// DONE
export const removeFromCart = function (ingredient) {
  // find the index of the clicked ingredient
  const ingredientIndex = state.cart.findIndex(item => item === ingredient);
  if (ingredientIndex === null) return;

  // remove the element from the cart and localstorage
  state.cart.splice(ingredientIndex, 1);
  setCartLS();
};

const setMealplanLS = function () {
  localStorage.setItem('mealplans', JSON.stringify(state.mealplans));
};

export const addMealplan = function (mealplan, recipe) {
  if (!mealplan.day || !mealplan.time) return;

  // to count if the condition matches for every element in the mealplans array so that we dont add the same meal for the same day and time
  let count = 0;

  if (recipe.id === state.currRecipe.id) {
    state.currRecipe.day = mealplan.day;
    state.currRecipe.time = mealplan.time;

    if (state.mealplans.length !== 0) {
      state.mealplans.forEach(mealp => {
        if (
          mealp.day === state.currRecipe.day &&
          mealp.time === state.currRecipe.time
        )
          return;

        count++;
      });

      if (count === state.mealplans.length) {
        state.mealplans.push(state.currRecipe);
        setMealplanLS();
      }
    } else {
      state.mealplans.push(state.currRecipe);
      setMealplanLS();
    }
  }
  console.log(state.mealplans);
  return state.mealplans;
};

// export const removeMealplan = function (mealplan, recipe) {
//   if (!mealplan.day || !mealplan.time) return;

//   // to count if the condition matches for every element in the mealplans array so that we dont add the same meal for the same day and time
//   let count = 0;

//   if (recipe.id === state.currRecipe.id) {
//     state.currRecipe.day = mealplan.day;
//     state.currRecipe.time = mealplan.time;

//     if (state.mealplans.length !== 0) {
//       state.mealplans.forEach(mealp => {
//         if (
//           mealp.day === state.currRecipe.day &&
//           mealp.time === state.currRecipe.time
//         )
//           return;

//         count++;
//       });

//       if (count === state.mealplans.length) {
//         state.mealplans.push(state.currRecipe);
//         setMealplanLS();
//       }
//     } else {
//       state.mealplans.push(state.currRecipe);
//       setMealplanLS();
//     }
//   }

//   return state.mealplans;
// };

// export const showMealPlan = function (day) {
//   // let dailyplan = [];
//   console.log(state.MEALPLANS.filter(mp => mp.days === day));
//   return state.MEALPLANS.filter(mp => mp.days === day);
// };

const setBookmarkLS = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.currRecipe.id) state.currRecipe.bookmarked = true;
  state.bookmarks.push(recipe);

  setBookmarkLS();
};

export const removeBookmark = function (recipe) {
  if (recipe.id === state.currRecipe.id) state.currRecipe.bookmarked = false;
  const currRecipeIndex = state.bookmarks.findIndex(r => r.id === recipe.id);
  state.bookmarks.splice(currRecipeIndex, 1);

  setBookmarkLS();
};
export const loadDailyMealplan = function (day) {
  const mealsForDay = state.mealplans.filter(meal => meal.day === day);

  return mealsForDay;
};

const init = function () {
  const mealplansLS = localStorage.getItem('mealplans');
  if (mealplansLS) {
    state.mealplans = JSON.parse(mealplansLS);
  }
  const bookmarksLS = localStorage.getItem('bookmarks');
  if (bookmarksLS) {
    state.bookmarks = JSON.parse(bookmarksLS);
  }
  const cartLS = localStorage.getItem('cart');
  if (cartLS) {
    state.cart = JSON.parse(cartLS);
  }
};
init();
