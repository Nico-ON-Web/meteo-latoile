// CODE OK ! 
navigator.geolocation.getCurrentPosition( pos=>{
	console.log(pos)
	callApi(pos.coords.latitude, pos.coords.longitude)	

	getCity(pos.coords.latitude, pos.coords.longitude)
	
})

drawCurrentDate()

function callApi(lat,lon){
	console.log(lat,lon)
	const url = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=weather_code,temperature_2m,precipitation,is_day,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=weather_code,temperature_2m,rain,cloud_cover,wind_speed_80m,wind_direction_80m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum&timezone=auto"
		
	console.log(url)
	
	fetch(url).then(rep=>{return rep.json()}).then(res=>{
		
		/** le mot sun, suncloud, rain pour generer le bon picto et la bonne image de fond, correspond aux nomage des classes css: 
		 * .bg-weather-sun 
		 * .picto-sun
		 * .mini-picto-sun
		 */
		let currentWeatherCode = weatherAnalysis(res.current.weather_code)
		console.log(currentWeatherCode,res.current.weather_code)
		// changement de l'arriere plan en fonction du currentWeatherCode
		changeBackgroundImage(currentWeatherCode)
		drawCurrent(res.current, currentWeatherCode)
		// affichage de la liste des prévisions pour les jours suivants
		drawDaily(res.daily)
	
	})
}
// sun cloudy suncloud rain snow thunder 

let currentState;

function weatherAnalysis(code){
	
	if(code == 0){
		// clear sky
		return "sun"
	}else if(code >=1 && code < 45 ){
		// partialy cloudy
		return "suncloud"
	}else if(code >=45 && code < 61){
		// foggy & cloudy
		return "cloud"
	}else if((code >=61 && code < 71) ||(code >=80 && code < 85) ){
		// Rainy
		return "rain"
	}else if((code >=71 && code < 77) || (code>= 85 && code<95 )){
		// snow
		return "snow"
	}else if(code>95){
		// thunder
		return "thunder"
	}else{
		return "coucou"
	}
}

function changeBackgroundImage(classname){
	document.body.classList.add("bg-weather-"+classname)
}

/**
 *  affiche le temps qu'il fait actuellement dans la zone qui a la classe css "current"
 * @param {Object} w current weather
 * @param {String} classname le suffixe de la classe css pour le picto
 */
function drawCurrent(w, classname){
	let currentZone = document.querySelector(".current")
	let template=`<div class="picto-weather picto-${classname}"></div>
	<p class="tmax">${w.temperature_2m}°C</p>`
	currentZone.innerHTML = template;
	 
}


function drawDaily(daily){
	let dailyZone = document.querySelector(".carousel-daily-container")
	let template =``;
	daily.time.forEach((day,pos)=>{
		if(pos===0){
			return
		}
		let image = weatherAnalysis(daily.weather_code[pos])
		template+=`<div class="dayly-weather">
		<h4>${formatDate(day)}</h4>
		<div class="minipicto minipicto-${image}"></div>
		<h3 class="tmax">${daily.temperature_2m_max[pos]}°C</h3>
		<h3 class="tmin">${daily.temperature_2m_min[pos]}°C</h3>  
	</div>`
	})
	dailyZone.innerHTML=template
}

function formatDate(d){
	let temp = d.split('-')
	return temp[2]+"/"+temp[1]+"/"+temp[0]
}

function drawCurrentDate(){
	let datetimeZone = document.querySelector(".datetime")
	let date = new Date()
	let template =` <h2>${date.toLocaleDateString()}</h2>
	<h3>${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</h3>`
	datetimeZone.innerHTML = template
	requestAnimationFrame(drawCurrentDate)
}



async function getCity(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'fr' } // pour avoir les noms en français
  });
  const data = await response.json();

 const city = data.address.city || data.address.town || data.address.village;
 document.getElementById("city").innerHTML = city
}