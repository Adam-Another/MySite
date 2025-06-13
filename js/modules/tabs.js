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

export default tabs;