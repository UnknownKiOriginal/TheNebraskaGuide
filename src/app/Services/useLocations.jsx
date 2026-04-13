import React, {useEffect, useState} from 'react';

const parseCSVLine = (line) => {
   const result = [];
   let current = '';
   let inQuotes = false;
   for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
         inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
         //.push() adds something to the end of a list
         result.push(current.trim());
         current = '';
      } else {
         current += char;
      }
   }
   result.push(current.trim());
   return result;
};

//useLocations is a custom hook like useWeather
//useLocations fetches CSV from GitHub and convert each row into a JavaScript Object and if called can get all Nebraska locations
const useLocations = () => {
   const [locations, setLocations] = useState([]);
   //loading starts true so a loading screen message can be seen
   const [loading, setLoading] = useState(true);

   //Reminder: useState stores data then refreshes react when needed
   //Reminder: useEffect runs code at specific times (w/ timer or interacting with APIs) when something else happens (often outside of React)
   useEffect(() => {
      const fetchLocations = async () => {
         try {
            //fetching raw GitHub URL to access GitHub page
            const response = await fetch(
               'https://raw.githubusercontent.com/UnknownKiOriginal/TheNebraskaGuide/main/Locations.csv'
            );
            //.text() will read response as a string, we don't use .json() because the form is a string not a JSON
            const text = await response.text();
            const lines = text.trim().split('\n');
            //Excludes the first line (headers) from locations.csv
            const headers = lines[0].split(',');
            //Reminder: .map() is used to iterate through values in an array in React since it's best at during data into visuals
            //Reminder: parse in general is just a blob of data nicely formatted
            const parsed = lines.slice(1).map(line => {
               const values = parseCSVLine(line);
               //Will use object variable and call it obj
               const obj = {};
               
               //forEach is a built in loop that automatically knows how much items are in the array
               headers.forEach((header, i) => {
                  //Removes surrounding quotes from GitHub quotations wrapping
                  let val = (values[i] || '').trim().replace(/^"|"$/g, '');
                  const cleanHeader = header.trim();

                  if (cleanHeader === 'tags') {
                     //Puts tags into the object under the key of tags
                     //when looping the parameter often represent the individual variables. In this case t so for each variable it is trimmed
                     obj[cleanHeader] = val.split(',').map(t => t.trim());
                  } else if (cleanHeader === 'latitude' || cleanHeader === 'longitude') {
                     //parse turns a value into what type of variable it is parseFloat turns variables to Floats 
                     obj[cleanHeader] = parseFloat(val);
                  } else if (cleanHeader === 'difficulty' || cleanHeader === 'satisfaction') {
                     obj[cleanHeader] = parseInt(val);
                  } else {
                     obj[cleanHeader] = val;
                  }
               });
               return obj;
            });
            setLocations(parsed);
         } catch (error) {
            console.log('Locations fetch error: ', error);
         } finally {
            //success or fail at the end of the process stop the loading
            setLoading(false);
         }
      };
      fetchLocations();
   }, []); //empty [] means fetch once when the screen first loads
   //return both so they can both be used by any screen
   return {locations, loading};
};
export default useLocations;