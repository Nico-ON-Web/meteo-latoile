let api_key = "1UD12p6Lcm0yoGQJHAyMWgJ5miT4HIBk"
navigator.geolocation.getCurrentPosition(pos=>{

    console.log(pos)
   const url = 'https://api.tomorrow.io/v4/weather/forecast?&apikey='+api_key+'&location='+pos.coords.latitude+','+pos.coords.longitude; 
   
const options = {
  method: 'GET',
  headers: {'accept-encoding': 'deflate, gzip, br', accept: 'application/json'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    // la donnée recue par l'api
    console.log(json)

  })
  .catch(err => console.error(err));
})

