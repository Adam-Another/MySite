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

export default calc;