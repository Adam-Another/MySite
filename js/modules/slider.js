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

export default slider;