// doc https://docs.tomorrow.io/reference/

let api_key = "1UD12p6Lcm0yoGQJHAyMWgJ5miT4HIBk"
navigator.geolocation.getCurrentPosition(pos=>{

  console.log(pos)
  // const url = 'https://api.tomorrow.io/v4/weather/forecast?&apikey='+api_key+'&location='+pos.coords.latitude+','+pos.coords.longitude+"&units=metric"; 

  const urltest = "./reponse.json"
   
  const options = {
    method: 'GET',
    headers: {'accept-encoding': 'deflate, gzip, br', accept: 'application/json'}
  };

  fetch(urltest, options)
    .then(res => res.json())
    .then(json => {
      // la donnée recue par l'api
      console.log(json)
      displayWeather(json.timelines.daily[1].values.weatherCodeMax)

      const tempMin = json.timelines.daily[1].values.temperatureMin;
      const tempMax = json.timelines.daily[1].values.temperatureMax;
      displayTemperatures(tempMin,tempMax)

    })
    .catch(err => console.error(err));
})


/**
 * Affiche le temps dans la section qui a l'id zone dans la page web
 * @param {Object} wcode le wheathercode
 * 
 */
function displayWeather(wcode){
  fetch("./datas/weathercodes.json").then(res=> res.json()).then(data=>{
    let temps = data[wcode].weather
    let image = data[wcode].image 
    document.getElementById("zone").innerHTML=`
    <img src="./datas/icons/${image}" alt="${temps}"/>
    <h4>${temps}</h4>
    `
  })
}



function windSpeedKmh(windspeedMS){
    return  windspeedMS * 3.6 
}

function displayTemperatures(min, max){
  document.getElementById("temperatures").innerHTML = `<div>
        Min
        <span>${min}°C</span>
    </div>
    <div>
        Max
        <span>${max}°C</span>
    </div>
  `
}
