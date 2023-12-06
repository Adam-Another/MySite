document.addEventListener("DOMContentLoaded", () => {

  // Tabs

  let tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent  = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    let $i = 0;
    tabs.forEach(item => {
      item.classList.remove("tabheader__item_active");
      item.classList.add("data-index");
      item.dataset.index = $i++;
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (evt) => {
    let target = evt.target;
    if( !(target && target.matches("div.tabheader__item")) ) return;

    hideTabContent();
    showTabContent(target.dataset.index);
  });

  // Timer

  let deadLine = "2023-12-30T21:31";

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

  setClock(".timer", deadLine);

  // Modal

  let modalWindow = document.querySelector(".modal"),
        modalBtns = document.querySelectorAll("[data-modal]");

  function showModalWindow() {
    modalWindow.classList.add("show", "fade");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  function hideModalWindow() {
    modalWindow.classList.remove("show", "fade");
    document.body.style.overflow = "";
  }

  modalBtns.forEach(item => item.addEventListener("click", showModalWindow));

  // close the modal if clicked outside the modal
  modalWindow.addEventListener("click", (evt) => {
    let target = evt.target;
    if(target && target === modalWindow || target.hasAttribute("data-close")) hideModalWindow();
  });

  // close the modal if pressed esc
  document.addEventListener("keydown", (evt) => {
      if(evt.code === "Escape" && modalWindow.classList.contains("show")) hideModalWindow();
  });

  let modalTimerId = setTimeout(showModalWindow, 50000);

  function showModalByScroll() {
    if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
      showModalWindow();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  // classes for cards

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

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    '.menu .container',
    "menu__item"
  ).render();

  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    9,
    '.menu .container',
    "menu__item"
  ).render();

  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    9,
    '.menu .container',
    "menu__item"
  ).render();

  // Forms

  let forms = document.querySelectorAll("form");
  let message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся.",
    failure: "Что-то пошло не так..."
  }

  forms.forEach(item => postData(item));

  function postData(form) {
    form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);
      
      let json = {};
      new FormData(form).forEach((val, key) => json[key] = val);

      fetch("server.php", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(json)
      })
      .then(response => response.text())
      .then(response => {
        console.log(response);
        showThanksModal(message.success);
      })
      .catch(() =>  showThanksModal(message.failure))
      .finally(() => {
        form.reset();
        statusMessage.remove();
      });
    });
  }

  function showThanksModal(message) {
    let prevModalDialog = document.querySelector(".modal__dialog");
    prevModalDialog.classList.add("hide");
    showModalWindow();

    let thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    modalWindow.append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      //prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      hideModalWindow();
    }, 3000);
  }
});
