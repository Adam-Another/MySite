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

export default timer;

