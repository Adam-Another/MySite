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

    tabs.forEach((item, i) => {
      item.classList.remove("tabheader__item_active");
      item.classList.add("data-index");
      item.dataset.index = i;
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

  let getResource = async url => {
    let res = await fetch(url);

    if(!res.ok) throw new Error("Could not fetch ${url}, status ${res.status}");

    return await res.json();
  };

  getResource("http://localhost:3000/menu")
  .then(data => {
    data.forEach(obj => {
      new MenuCard(...Object.values(obj), ".menu .container").render();
    });
  })

  // Forms

  let forms = document.querySelectorAll("form");
  let message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся.",
    failure: "Что-то пошло не так..."
  }

  forms.forEach(item => bindPostData(item));

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

      postData("http://localhost:3000/requests", json)
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

  // Slider

  // getting elements
  let slider = document.querySelector(".offer__slider"),
      current = slider.querySelector("#current"),
      total = slider.querySelector("#total"),
      slidesWrapper = slider.querySelector(".offer__slider-wrapper"),
      slidesField = slidesWrapper.querySelector(".offer__slider-inner"),
      slides = slidesField.querySelectorAll(".offer__slide"),
      width = window.getComputedStyle(slidesField).width;
  /*END*/

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
  /*END*/

  // creating dots
  let dotsWrapper = document.createElement("ol");
  dotsWrapper.classList.add("carousel-indicators");

  let dots = [];
  for(let i = 1; i <= slides.length; i++) {
    element = document.createElement("li");
    element.classList.add("dot");
    element.dataset.index = i;
    dotsWrapper.append(element);
    dots.push(element);
  }
  slider.append(dotsWrapper);
  dots[slideIndex - 1].classList.add("dot-item_active");
  /*END*/

  function slideMove(type, index) {
    switch (type) {
      case "prev":
        slideIndex = slideIndex == 1 ? slides.length : --slideIndex;
        if (offset == 0) offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        else offset -= +width.slice(0, width.length - 2);
        break;
      case "next":
        slideIndex = slideIndex == slides.length ? 1 : ++slideIndex;
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) offset = 0;
        else offset += +width.slice(0, width.length - 2);
        break;
      case "dot":
        slideIndex = index;
        offset = +width.slice(0, width.length - 2) * (slideIndex - 1);
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
});
