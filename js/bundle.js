/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function calc(){

  let result = document.querySelector(".calculating__result span");

  let height, weight, age,
      gender = localStorage.getItem("gender") || "female",
      ratio = +localStorage.getItem("ratio") || 1.375;

  function initLocalSettings(activeClass) {
    let genders = document.querySelectorAll("#gender div");
    let ratios = document.querySelectorAll(".calculating__choose_big div");

    genders.forEach(item => {
      item.classList.remove(activeClass);
      if(item.getAttribute("id") === gender) item.classList.add(activeClass);
    });

    ratios.forEach(item => {
      item.classList.remove(activeClass);
      if(+item.dataset.ratio === ratio) item.classList.add(activeClass);
    });
  }

  initLocalSettings("calculating__choose-item_active");
    
  function calcTotal() {
    if(!gender || !height || !weight || !age || !ratio) {
      result.textContent = "____";
      return;
    }

    if(gender === "female") {
      result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
  }

  calcTotal();

  function getStaticInformation(parentSelector, activeClass) {
    let elements = document.querySelectorAll(`${parentSelector} div`);

    document.querySelector(parentSelector).addEventListener("click", (evt) => {
      let target = evt.target;
      if( !(target && target.matches("div.calculating__choose-item")) ) return;
      if(target.hasAttribute("data-ratio")) {
        ratio = +target.dataset.ratio;
        localStorage.setItem("ratio", `${ratio}`);
      } else {
        gender = target.getAttribute("id");
        localStorage.setItem("gender", gender);
      }

      elements.forEach(item => item.classList.remove(activeClass));

      target.classList.add(activeClass);

      calcTotal();
    });
  }

  getStaticInformation("#gender", "calculating__choose-item_active");
  getStaticInformation(".calculating__choose_big", "calculating__choose-item_active");

  function getDynamicInformation(selector) {
    let input = document.querySelector(selector);

    input.addEventListener("input", () => {

      input.style.border = input.value.match(/\D/g) ? "1px solid red" : "none";

      switch(input.getAttribute("id")) {
        case "height":
          height = +input.value;
          break;
        case "weight":
          weight = +input.value;
          break;
        case "age":
          age = +input.value;
          break;
      }

      calcTotal();
    });
  }

  getDynamicInformation("#height");
  getDynamicInformation("#weight");
  getDynamicInformation("#age");
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function cards(){

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.transfer = 27;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      let element = document.createElement("div");

      if(this.classes.length === 0) element.classList.add("menu__item");
      else this.classes.forEach(className => element.classList.add(className));

      element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;

      this.parent.append(element);
    }
  }

  (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResource)("http://localhost:3000/menu")
  .then(data => {
    data.forEach(obj => {
      new MenuCard(...Object.values(obj), ".menu .container").render();
    });
  })
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");



function forms(formSelector, modalTimerId){

  let forms = document.querySelectorAll(formSelector);
  let message = {
    loading: "../../img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся.",
    failure: "Что-то пошло не так..."
  }

  forms.forEach(item => bindPostData(item));

  function bindPostData(form) {
    form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);
      
      let json = JSON.stringify( Object.fromEntries( new FormData(form).entries() ) );

      (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)("http://localhost:3000/requests", json)
      .then(response => {
        console.log(response);
        showThanksModal(message.success);
      })
      .catch(() => showThanksModal(message.failure))
      .finally(() => {
        form.reset();
        statusMessage.remove();
      });
    });
  }

  function showThanksModal(message) {
    let prevModalDialog = document.querySelector(".modal__dialog");
    prevModalDialog.classList.add("hide");
    (0,_modal__WEBPACK_IMPORTED_MODULE_0__.showModalWindow)(".modal", modalTimerId);

    let thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector(".modal").append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      //prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      (0,_modal__WEBPACK_IMPORTED_MODULE_0__.hideModalWindow)(".modal");
    }, 3000);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   hideModalWindow: () => (/* binding */ hideModalWindow),
/* harmony export */   showModalWindow: () => (/* binding */ showModalWindow)
/* harmony export */ });
function showModalWindow(modalSelector, modalTimerId) {
  let modalWindow = document.querySelector(modalSelector);
  modalWindow.classList.add("show", "fade");
  document.body.style.overflow = "hidden";

  if(modalTimerId) clearTimeout(modalTimerId);
}

function hideModalWindow(modalSelector) {
  let modalWindow = document.querySelector(modalSelector);
  modalWindow.classList.remove("show", "fade");
  document.body.style.overflow = "";
}

function modal(modalSelector, triggerSelector, modalTimerId){
  let modalWindow = document.querySelector(modalSelector),
      modalTrigger = document.querySelectorAll(triggerSelector);

  modalTrigger.forEach(item => item.addEventListener("click", () => showModalWindow(modalSelector, modalTimerId)));

  // close the modal if clicked outside the modal
  modalWindow.addEventListener("click", (evt) => {
    let target = evt.target;
    if(target && target === modalWindow || target.hasAttribute("data-close")) hideModalWindow(modalSelector);
  });

  // close the modal if pressed esc
  document.addEventListener("keydown", (evt) => {
      if(evt.code === "Escape" && modalWindow.classList.contains("show")) hideModalWindow(modalSelector);
  });

  function showModalByScroll() {
    if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
      showModalWindow(modalSelector, modalTimerId);
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);


/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function slider({container, totalCounter, currentCounter, wrapper, field, slide}){

  // getting elements
  let slider = document.querySelector(container),
      total = slider.querySelector(totalCounter),
      current = slider.querySelector(currentCounter),   
      slidesWrapper = slider.querySelector(wrapper),
      slidesField = slidesWrapper.querySelector(field),
      slides = slidesField.querySelectorAll(slide),
      width = window.getComputedStyle(slidesField).width;

  // default value
  let slideIndex = 1, offset = 0; 
  
	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

  slidesField.style.width = 100 * slides.length + "%";
  slides.forEach(slide => slide.style.width = width);

  // creating dots
  let dotsWrapper = document.createElement("ol");
  dotsWrapper.classList.add("carousel-indicators");

  let dots = [], element;
  for(let i = 1; i <= slides.length; i++) {
    element = document.createElement("li");
    element.classList.add("dot");
    element.dataset.index = i;
    dotsWrapper.append(element);
    dots.push(element);
  }
  slider.append(dotsWrapper);
  dots[slideIndex - 1].classList.add("dot-item_active");

  function deleteNotDigits(str) {
    return +str.replace(/\D/g, "");
  }
  
  function slideMove(type, index) {
    switch (type) {
      case "prev":
        slideIndex = slideIndex == 1 ? slides.length : --slideIndex;
        if (offset == 0) offset = deleteNotDigits(width) * (slides.length - 1);
        else offset -= deleteNotDigits(width);
        break;
      case "next":
        slideIndex = slideIndex == slides.length ? 1 : ++slideIndex;
        if (offset == deleteNotDigits(width) * (slides.length - 1)) offset = 0;
        else offset += deleteNotDigits(width);
        break;
      case "dot":
        slideIndex = index;
        offset = deleteNotDigits(width) * (slideIndex - 1);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    current.textContent = slideIndex < 10 ? `0${slideIndex}` : slideIndex;

    dots.forEach(dot => dot.classList.remove("dot-item_active"));
    dots[slideIndex - 1].classList.add("dot-item_active");
  }

  slider.addEventListener("click", evt => {
    if(evt.target.matches("div.offer__slider-prev")) {
      slideMove("prev");
    }
    else if(evt.target.matches("div.offer__slider-next")) {
      slideMove("next");
    }
    else if(evt.target.matches("li.dot")) {
      slideMove("dot", +evt.target.dataset.index);
    }
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass){

  let tabs = document.querySelectorAll(tabsSelector),
    tabsContent = document.querySelectorAll(tabsContentSelector),
    tabsParent  = document.querySelector(tabsParentSelector);

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item, i) => {
      item.classList.remove(activeClass);
      item.classList.add("data-index");
      item.dataset.index = i;
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add(activeClass);
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (evt) => {
    let target = evt.target;
    if( !(target && target.matches(`div${tabsSelector}`)) ) return;

    hideTabContent();
    showTabContent(target.dataset.index);
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function timer(id, deadLine){

  function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.now(),
          days = Math.floor( t / (1000 * 3600 * 24) ),
          hours = Math.floor((t / (1000 * 3600)) % 24),
          minutes = Math.floor((t / (1000 * 60)) % 60),
          seconds = Math.floor((t / 1000) % 60);
    return {total: t, days, hours, minutes, seconds };
  }

  function setClock(selector, endtime) {
    let timer = document.querySelector(selector),
        days = timer.querySelector("#days"),
        hours = timer.querySelector("#hours"),
        minutes = timer.querySelector("#minutes"),
        seconds = timer.querySelector("#seconds"),
        timeInterval = setInterval(updateClock, 1000);
   
    updateClock();

    function updateClock() {
      let t = getTimeRemaining(endtime);
    
      if(t.total <= 0) {
        clearInterval(timeInterval);
        return;
      }
    
      days.textContent = t.days >= 0 && t.days < 10 ? `0${t.days}`: t.days;
      hours.textContent = t.hours >= 0 && t.hours < 10 ? `0${t.hours}`: t.hours;
      minutes.textContent = t.minutes >= 0 && t.minutes < 10 ? `0${t.minutes}`: t.minutes;
      seconds.textContent = t.seconds >= 0 && t.seconds < 10 ? `0${t.seconds}`: t.seconds;
    }
  }

  setClock(id, deadLine); 
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);



/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getResource: () => (/* binding */ getResource),
/* harmony export */   postData: () => (/* binding */ postData)
/* harmony export */ });
let postData = async (url, data) => {
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: data
  });

  return await res.json();
};

let getResource = async url => {
  let res = await fetch(url);

  if(!res.ok) throw new Error(`Could not fetch ${url}, status ${res.status}`);

  return await res.json();
};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");









document.addEventListener("DOMContentLoaded", () => {

  let modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_3__.showModalWindow)(".modal", modalTimerId), 5000);

  (0,_modules_calc__WEBPACK_IMPORTED_MODULE_0__["default"])();
  (0,_modules_cards__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_modules_forms__WEBPACK_IMPORTED_MODULE_2__["default"])("form", modalTimerId);
  (0,_modules_modal__WEBPACK_IMPORTED_MODULE_3__["default"])(".modal", "[data-modal]", modalTimerId);
  (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_4__["default"])(".tabheader__item", ".tabcontent", ".tabheader__items", "tabheader__item_active");
  (0,_modules_timer__WEBPACK_IMPORTED_MODULE_5__["default"])(".timer", "2025-07-06");
  (0,_modules_slider__WEBPACK_IMPORTED_MODULE_6__["default"])({
    container: ".offer__slider",
    totalCounter: "#total",
    currentCounter: "#current",
    wrapper: ".offer__slider-wrapper",
    field: ".offer__slider-inner",
    slide: ".offer__slide"
  });

});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map