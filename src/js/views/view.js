import { mark } from "regenerator-runtime";
import icons from "url:../../img/icons.svg";
export default class View {
  _data;

  /**
   * Render the Recieved object to the DOM
   * @param {Object | object[]} data the data to be rendered
   * @param {boolean} [render= true ] if false create marup string
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {object} View object
   * @author Sadaf Partovi
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    ///First we want to remove all the text and everything from the parent element where the recipe will go:
    this._clear();
    /////Inserting html to the page:
    //"afterbegin" insert it as a first child element
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //////This is for the Serving update not to update the image over again:
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //These would convert string to real DOM objects
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    //Update change TEXT
    //node.Value only replace text
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Update change attribute:
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  //////////////////////
  _clear() {
    this._parentElement.innerHTML = "";
  }

  //////////////////////////////////////////////////////////
  //Displaying error in the view:
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //////////////////////////////////////////////////////////
  //Displaying succes msg in the view:
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  //////////////////////////////////////////////////////////
  //Spinner Function:
  renderSpinner() {
    const markup = `
  <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
