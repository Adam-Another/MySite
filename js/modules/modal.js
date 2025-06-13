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

export default modal;
export {showModalWindow, hideModalWindow};