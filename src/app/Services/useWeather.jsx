import React, {useEffect, useState} from 'react';

//useWeather is a custom hook that packages the data from API fetching so it can be used anywhere easily
const useWeather = (latitude, longitude) => {
   //same useState variables as in Locations.jsx in the previous version I made
   //weatherdata stores what comes from the api and setweather refreshes it while it starts at a null value
   const [weatherData, setWeatherData] = useState(null);
   //weatherLoading checks if we're still watiing for the APIs response by default this is set to true
   const [weatherLoading, setWeatherLoading] = useState(true);

   //Reminder: useEffect runs automatically in location when the screen is opened, this will allow for
   // weather data to update automatically each time you re-enter the page
   useEffect(() => {
      //Reminder: async() means ther ewill be a pause within the function
      const fetchWeather = async () => {
         try {
            //Can only use await in an async function where async says there will be waiting and await is the pause itself
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&forecast_days=7&timezone=America%2FChicago`);
            //.json() converts the raw response into a JavaScript Object so it an be used in code again
            const json = await response.json();
            //json.daily is the part of the response that has the weather for the seven days where we then save the data
            setWeatherData(json.daily);
         } catch (error) {
            console.log('Weather Fetch Error:', error);
         } finally {
            setWeatherLoading(false);
         }
      };
      fetchWeather();
      }, [latitude, longitude]);
      //This is what the hook returns
      return {weatherData, weatherLoading};
};

export default useWeather;