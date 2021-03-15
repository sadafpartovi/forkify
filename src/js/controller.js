import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
//How to bring back the icon svg now that it is in the "dis" folder:
//now icons give us the url to the new path of images

//Importing "npm i core-js regenerator-runtime" in the terminal so the code is compatible with ES5 and now importing it here:
import "core-js/stable";

//This one is polyfilling and async await:
import "regenerator-runtime/runtime";

//////////////////////////////////////
//It wont reload the page so a receipes would be there and page wont be empty
if (module.hot) {
  module.hot.accept();
}
///////////////////////////////////////
const { receiveMessageOnPort } = require("worker_threads");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//////////////////////////////////////////
//function for async await:
const controlRecipe = async function () {
  try {
    //This is to get the id# of the url
    //window.location means the whole url
    const id = window.location.hash.slice(1);

    //here is for when we dont have the id in url so it doesnt give us error
    if (!id) return;

    //0) Updating Result view to mark selected the search
    resultsView.update(model.getSearchResultsPage());
    //updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    ////////////////////////////
    //Loading receipe
    //1. rendering spinner:
    // recipeView.renderSpinner();
    await model.loadRecipe(id);

    /////////////////////////////////////////

    //Rendering Receipe:
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//////////////////////////////
//calling the search function:
const controlSearchResults = async function () {
  try {
    //Spinner:
    resultsView.renderSpinner();
    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2) Load search results
    await model.loadSearchResult(query);

    //3) Render results:

    resultsView.render(model.getSearchResultsPage());

    //4 render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

////button handling for pagination
const controlPaination = function (goToPage) {
  // Render new results:

  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination
  paginationView.render(model.state.search);
};

/////////////////////////////////
//to increase or decrease serving of each recipe:
const controlServings = function (newServings) {
  //Update the recipe servings:
  model.updateServings(newServings);
  //Update the recipe view:
  recipeView.update(model.state.recipe);
};

//////////////////////
// Adding bookmark:
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/////////////
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

///////////upload btn FORM:
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show spinner:
    addRecipeView.renderSpinner();
    //Upload new recipe data

    await model.uploadRecipe(newRecipe);
    //Render Recipe:
    recipeView.render(model.state.recipe);

    ////displaying Success Message
    addRecipeView.renderMessage();

    //Render bookmark view for api:
    bookmarksView.render(model.state.bookmarks);

    //Change id in the url:
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Closing form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
//////////////////////////////////////////
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPaination);
  addRecipeView._addhandlerUpload(controlAddRecipe);
};
init();
