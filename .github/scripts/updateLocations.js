//This script that runs every Saturday at 11:59PM
//It fetches Nebraska trail/location data from iNaturalist to locations.csv if they don't already exist

//fs is Node.js's own file system module that allows me to read and write files
//require() loads and caches JavaScript modules
const fs = require('fs');
//https is Node.js's own module for making web requests
const https = require('https');

const fetchJSON = (url) => {
    //promise and async/await are the same but async/await is cleaner
    return new Promise((resolve, reject) => {
        //https.get gets a web address which I addressed as url
        //res (short for response) is an object that has everything the website sent back
        https.get(url, (res) => {
            let data = '';
            //.on() is a listener for a specific event to happen then run some code
            //'data' is the premade event we are listening for, it's triggered each time a small 'chunk' of data arrives from the internet
            //chunk is a variable name representing the small pieces of data
            //=> in this case is telling to add the values to the right of it
            //Need to use 'chunk =>' instead of 'data =>' because chunk in syntax looks like '(chunk) => {}' since it's a function so we chose chunk because data is already an assigned variable
            res.on('data', chunk => data += chunk);
            //the event triggers once when the internet sends over all the new data
            //() is an empty parameter that means no more instructions are being sent, except within the curly brackets
            res.on('end', () => {
                try {
                    //resolve states the transfer was successfull then with JSON.parse translates the JSON file from the data variable to a JavaScript Object (variables, arrays, lists, and so on)
                    resolve(JSON.parse(data));
                  //e is just a local variable for holding error infomration
                } catch (e) {
                    reject(e);
                };
            });
        //event listener for if there was an error like iNaturalist was down or the netowrk is having problems, if there's an error reject stops the scripts
        }).on('error', reject);
    });
};

//If values contain commas or quotes it will be wrapped in quotes so the CSV won't break
const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        //`${}` is known as a template literal, variables inside the brackets and text outside - notice the use of backticks instead of apostrophe's
        //The quotes wrapping around everything will be visibly seen on screen
        //replace() is self explanatory with the parameters meaning: replace(the target, the replacement)
        //The slashes in /"/ represent the start and end of a search with the search topic in between (")
        //g stands for global flag and means we won't stop the search at just the first quotation but instead replace all of them it can find
        return `"${str.replace(/"/g, '""')}"`;
    };
    return str;//The return for the strings that don't need extra quotes
};

//Uses Anthropic API to create location data that can't be gained form iNaturalist.
const generateLocationData = (name, place) => {
    //Promise doesn't block the code from going but has other tasks happen in the background while it completes another task
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                context: `You are a Nebraska outdoor location expert. Generate structured data for this Nebraska locations: "${name}" near "${place}".
                Respond with ONLY a valid JSON object, no extra text, no markdown, no backticks. Use this exact structure:
                {
                    "description_geography": "100+ word description of the geology, terrain, and landscape",
                    "description_nature": "100+ word description of wildlife, plants, and ecosystem",
                    "description_culture": "100+ word description of history, cultral significance, and human use",
                    "tags": "Tag1, Tag2, Tag3, Tag4, Tag5, ... Tag30+,
                }`
            }];
        });
        //headers is what 
        const options = {
            //hostname is the server we're using
            hostname: 'api.anthropic.com',
            //path is the specific location on the server we're using
            path: '/v1/messages',
            //method is what's happing, for example, GET receives data but POST means we're sending data
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //process.env read the api key from GitHub where the API key is hidden so it doens't actually appear in the code
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                //Content-Length tell the sever exactly hwo much bytes is being sent
                'Content-Length': Buffer.byteLength(body),
            };
        };

        //https.request is what's is sent to anthropic
        //I simplified res from response that is recieved from anthropic
        const req = https.request(options, (res) => {
            let data = '';
            //Reminder: data arrives in chunks which is why I named it chunks
            //.on is an event listener
            res.on('data', chunk => data += chunk);
            //on finish and the data arrived it's pulled and extracted
            res.on('end', () => {
                try {
                    //parse in this case turns string to JSON object
                    const response = JSON.parse(data);
                    //context[0] is where Claude replies
                    const text = response.context[0].text;
                    //text format to JSON format object should be in format already but needs to be in correct file
                    const parsed = JSON.parse(text);
                    //resolve was one of the above parameters
                    resolve(parsed);
                } catch (e) {
                    console.log('API parse error: ', e.message);
                    resolve({
                        description_geography: `${name} is a natural location in Nebraska. The rest of the information could not be loaded.`,
                        description_nature: `The area around ${name} features native Nebraska wildlife and plant life. The rest of the information could not be loaded.`,
                        description_culture: `${name} holds significance is Nebraska's natural and cultural history. The rest of the information could not be loaded.`,
                        tags: 'Wildlife Sightings, Nature, Nebraska, Open Space',
                    });
                }
            });
        });
        //If network fails write body (the request we gave to Claude)
        req.on('error', reject);
        req.write(body);
        req.end();
    });
};

const main = async () => {
    //double underscores usually means a variable was specialy built-in
    //__dirname is a global variable made by node.js that stands for Directory Name which in this case means: __dirname = TheNebraskaGuide/.github/scripts
    //__dirname is like ./ but since I can't figure out the differences I know that in more cases when using JavaScript that __dirname is more reliable
    //the /../../locations.csv means I'm going back two levels, back to TheNebraskaGuide folder and into the locations.csv
    const csvPath = `${__dirname}/../../locations.csv`;
    //readFileSync means to Read File Synchronously which forces the computer to read every word of the file and to not stop until it's finished
    //csvPath the file .readFileSync looks at, 'utf8' is the encoding where this code is readable for human (this is a commonly used code)
    const currentCSV = fs.readFileSync(csvPath, 'utf8');
    //.trim() removes whitespace from both ends of a string
    //.split('\n') the long string is split into arrays at a newline (\n)
    const existingLines = currentCSV.trim().split('\n');
    //.slice(1) removes lines below 1 and keeps 1 and above which in this case means the first line was removed
    //.map() then goes through every line using .trim() and .split()
    const existingNames = existingLines.slice(1).map(line => {//line is the name for the current line when being iterated through
        //splits into more arrays at the commas and keep only the first one [0]
        //Used //g before middle parts mean: ^" = quotes at start | = or "$ = quotes at end   example: ""bat"" -> "bat"
        return line.split(',')[0].replace(/^"|"$/g, '').toLowerCase();
    });

    console.log(`Currently have ${existingNames.length} locations`);

    //Fetching Nerbaska places from iNaturalist API, place_id=36 is Nebraska, taxon_id=47126 gives nature locations, per_page=50 fetches 50 results at once
    const url = 'https://api.inaturalist.org/v1/observations?place_id=36&taxon_id=47126&quality_grade=research&per_page=50&order=desc&order_by=created_at';

    console.log('Fetching from iNaturalist...');
    //Reminder: Doesn't move on until JSON file is fetched from the url and put into data.
    const  data = await fetchJSON(url);

    let newRowsAdded = 0;
    let newRows = '';

    //Loops through each fetched iNaturalist observation
    //data.results is a list from iNaturalist API which contain sightings/observations
    for (const obs of data.results) {
        //Check if sighting has GPS coordinates if it doesn't (null) then it continues on
        if(!obs.location) continue;
        //fills the variables with their parts and splits lat and lng up to seperate arrays
        const [lat, lng] = obs.location.split(',');
        //taxon is the scientific classification/category like species, genus, or family form iNaturalist API
        //? is called optional chaining which means use this property if it exists if it doens't just use undefined so it doesn't crash
        //? only seems to be used after taxon because of the chain rule which essentially states that a property involves its child properties so... obj.prop1?.prop2.grandchild ...prop1, 2, and grandchild are all under ?
        //Name for trail information: Finds normal(common) name like corn, if missing then uses the Scientifc name, if that too is missing it defaults to 'Unknown';
        const name = obs.taxon?.preferred_common_name || obs.taxon?.name || 'Unknown';
        //This checks to see if the name from iNaturalist and the previous names match from my previously made existingNames list
        if (existingNames.includes(name.toLowerCase())) continue;
        //If iNaturalist has an observation description then use it if it doesn't then use the basic one below
        const description = obs.description || `${name} observed in Nebraska.`;
        //Checks first available photo and if it is then changes shape and size to square and medium if not there it's empty ''
        const image = obs.photos?.[0]?.url?.replace('square', 'medium') || '';
        //these tags are added to every location automatically
        const tags = 'Wildlife Sighting, Nature, Nebraska';
        //This adds a single long string of what will be in my locations.csv but currently is held in the newRows variable
        newRows += `\n${escapeCSV(name)},${escapeCSV(obs.place_guess || 'Nebraska')},${parseFloat(lat).toFixed(4)},${parseFloat(lng).toFixed(4)},50,70,${escapeCSV(tags)},${escapeCSV(description)},${escapeCSV(image)}`;
        newRowsAdded++;
        console.log(`Adding: ${name}`);
    };

    if (newRowsAdded > 0) {
        //Adding the new rows the the Locations.csv
        fs.appendFileSync(csvPath, newRows);
        console.log(`Added ${newRowsAdded} new locations to locations.csv`);
        } else {
        console.log('No new locations to add');
    };
};

//This is where I run the main function while catching errors that will potentially crash my program
//.catch() forces the error from the computer to be put into the first err(parameter)
main().catch(err => {
    //another way of `${}` but better for errors because err can be clicked on and bring you to the problem
    console.error('Script failed: ', err);
    //process.exit(1) tells GitHub Actions the script failed and won't commit it to Locations.csv
    process.exit(1);
});
