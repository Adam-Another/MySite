import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import tabs from './modules/tabs';
import timer from './modules/timer';
import slider from './modules/slider';
import {showModalWindow} from './modules/modal';

document.addEventListener("DOMContentLoaded", () => {

  let modalTimerId = setTimeout(() => showModalWindow(".modal", modalTimerId), 5000);

  calc();
  cards();
  forms("form", modalTimerId);
  modal(".modal", "[data-modal]", modalTimerId);
  tabs(".tabheader__item", ".tabcontent", ".tabheader__items", "tabheader__item_active");
  timer(".timer", "2025-07-06");
  slider({
    container: ".offer__slider",
    totalCounter: "#total",
    currentCounter: "#current",
    wrapper: ".offer__slider-wrapper",
    field: ".offer__slider-inner",
    slide: ".offer__slide"
  });

});
