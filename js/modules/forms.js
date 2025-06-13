import {showModalWindow, hideModalWindow} from './modal';
import {postData} from '../services/services';

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

      postData("http://localhost:3000/requests", json)
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
    showModalWindow(".modal", modalTimerId);

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
      hideModalWindow(".modal");
    }, 3000);
  }
}

export default forms;