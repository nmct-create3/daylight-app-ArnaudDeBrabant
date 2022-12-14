// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}
// 5 TODO: maak updateSun functie
let updateSun = (sunHTML, minutesSunUp, totalMinutes) => {
  // 5a TODO: bereken hoeveel procent de zon al op is
  let percentage = (minutesSunUp / totalMinutes) * 100;
  // 5b TODO: gebruik dit percentage om de breedte van de sun te bepalen
  sunHTML.style.left = `${percentage}%`;
  let percentageB;
  if (percentage > 50) {
    percentageB = (100 - percentage) * 2;
  } else {
    percentageB = percentage * 2;
  }
  sunHTML.style.bottom = `${percentageB}%`;
  if (percentageB > 100 || percentageB < 0) {
    document.querySelector('.is-day').classList.add('is-night');
  } else {
    document.querySelector('.is-day').classList.remove('is-night');
  }

  //sunHTML.style.bottom berekenen
  sunHTML.dataset.time = _parseMillisecondsIntoReadableTime(Date.now() / 1000);
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.

let placeSunAndStartMoving = (totalMinutes, sunrise, sunset) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  

  // calculations
  let sun = document.querySelector('.js-sun');
  let currentTime = new Date(Date.now());
  let SunUp = new Date(Date.now() - sunrise);
  let sunuptotal = SunUp.getHours()*60 + SunUp.getMinutes();
  let procent = (sunuptotal / totalMinutes) * 100;
  hoursToMinutes = totalMinutes - sunuptotal;


  document.querySelector('.js-time-left').innerHTML = hoursToMinutes;
  //print
  console.log(procent);
  console.log(totalMinutes);
  console.log(sunuptotal);
  console.log(sunset);

  // We zetten de zon op de juiste plek
  if (sunuptotal <= totalMinutes + 1) {
    sun.dataset.time = currentTime.getHours() + ':' + currentTime.getMinutes();
    sun.style.left = procent + '%';
    if (procent < 50) {
      sun.style.bottom = 2 * procent + '%';
    } else {
      sun.style.bottom = 2 * (100 - procent) + '%';
    }
  }
  
  let interval = setInterval(function () {
    updateSun(sun, sunuptotal, totalMinutes, currentTime, interval);
  }, 1000);
  // We vullen het resterende aantal minuten in

  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {

  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  document.querySelector('.js-location').innerHTML = queryResponse.city.name;
  console.log(queryResponse);

  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  let sunrise = new Date(queryResponse.city.sunrise * 1000);
  let sunset = new Date(queryResponse.city.sunset * 1000);
  document.querySelector('.js-sunrise').innerHTML = sunrise.getHours()+ ':' + sunrise.getMinutes();
  document.querySelector('.js-sunset').innerHTML = sunset.getHours() + ':' + sunset.getMinutes();
  

  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  let totalDayTime = new Date(sunset - sunrise);

  placeSunAndStartMoving(((totalDayTime.getHours()*60)+totalDayTime.getMinutes()), sunrise, sunset);
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b3f042e1c4de6ac73326af10e0171b5a&units=metric&lang=nl&cnt=1`
  )
    // We gaan de JSON omzetten naar een Javascript object
    .then((response) => response.json())
    // Als dat gelukt is, gaan we naar onze showResult functie.
    .then((data) => showResult(data));
	
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
