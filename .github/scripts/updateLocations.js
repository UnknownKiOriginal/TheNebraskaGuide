//This script that runs every Saturday at 11:59PM
//It fetches Nebraska trail/location data from OpenStreetMap Overpass API to Locations.csv if they don't already exist

//fs is Node.js's own file system module that allows me to read and write files
//require() loads and caches JavaScript modules
const fs = require('fs');
//https is Node.js's own module for making web requests
const https = require('https');

const fetchOverpass = (query) => {
    //promise and async/await are the same but async/await is cleaner
    return new Promise((resolve, reject) => {

        //Regex: \s (whitespace) everything within it such as \t (tabs), \n (newline), \r (carriage return)
        //cariage return originates at the typewriter where the carriage was the silver lever that slides back and forth from beguinning to end of a line, in summary, carriage return to the beguinning of the current line
        
        //regular expressions again (regex, / /g) more explanation below
        //finds multiple spaces (\s), tabs, or newlines and turns them into spaces
        //the additional + after \s means to find every consecutive piece of whitespace and treat them as a single group
        
        const body = `data=${encodeURIComponent(query)}`;
        /*const body = `data=` + query.replace(/\s+/g, ' ').trim()
            //replace(find a, replace with b)
            //the following symbols have to be hidden becuause they hold a different job, like the ampersand as a variable seperator
            //replace & with %26 (its hidden version)
            .replace(/&/g, '%26')
            //replace + with %2B, \+ is used instead of just + because like with \s+ the plus sign looks ot find more of the previous character
            .replace(/\+/g, '%2B')
            //turn empty spaces into plus signs
            .replace(/ /g, '+');*/
        const options = {
            hostname: 'overpass-api.de',
            path: '/api/interpreter',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //Buffer is a temporary storage in memory to hold data while being moved form one place to another so after translating from string to bytes the data does get cut apart
                'Content-Length': Buffer.byteLength(body),
                'User-Agent': 'TheNebraskaGuide/1.0',
            }
        };
        //https.request requests a web address which I addressed as options
        //res (short for response) is the path through which data will from the website
        const req = https.request(options, (res) => {
            let data = '';
            //.on() is a listener for a specific event to happen then run some code
            //'data' is the premade event we are listening for, it's triggered each time a small 'chunk' of data arrives from the internet
            //chunk is a function name representing the small pieces of data
            //=> in this case is telling to add the values to the right of it
            //Need to use 'chunk =>' instead of 'data =>' because chunk in syntax looks like '(chunk) => {}' since it's a function so we chose chunk because data is already an assigned variable
            res.on('data', chunk => data += chunk);
            //the event triggers once when the internet sends over all the new data
            //() is an empty parameter that means no more instructions are being sent, except within the curly brackets
            res.on('end', () => {
                try {
                    //resolve states the transfer was successfull then with JSON.parse translates the JSON file from the data variable to a JavaScript Object (variables, arrays, lists, and so on)
                    console.log('Overpass raw response: ', data.substring(0, 5000));
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log('Overpass response preview:', data.substring(0, 200));
                    reject(e);
                }
            });
        });
        //event listener for if there was an error like OpenStreetMap Overpass API was down or the netowrk is having problems, if there's an error reject stops the scripts
        req.on('error', reject);
        req.write(body);
        req.end();
    });
};

//Using this if can't find an address
const reverseGeocode = (lat, lon) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'nominatim.openstreetmap.org',
            path: `/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
            //Remember: GET retrieves data, POST submits data
            method: 'GET',
            headers: {
                'User-Agent': 'TheNebraskaGuide/1.0'
            }
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
                    const a = response.address;
                    //state_district is a county; hamlets, villages, towns, city are mainly fallback options in case they were inserted under that description for some reason
                    const road = a.road || '';
                    const city = a.city || a.town || a.village || a.hamlet || '';
                    const state = a.state || 'Nebraska';
                    const postcode = a.postcode || '';
                    //Boolean will determine if a variable is missing and exclude if not present
                    const formatted = [road, city, state, postcode].filter(Boolean).join(', ');
                    resolve(formatted || `${city || 'Nebraska'}, Nebraska`);
                } catch (e) {
                    //if all else fails we have to just say it's in Nebraska
                    resolve('Nebraska');
                }
            });
        });
        req.on('error', () => resolve('Nebraska'));
        req.end();
    });
};

//Wikimedia Commons supposedly is a good free image API (no API key necessary)
const fetchWikimediaImage = (lat, lon, name) => {
    return new Promise((resolve) => {
        //gscoord is wikimedias coordinate center, gsradius is the search radius in meters
        //gslimit is how I control what iamge we get, I can just use the first one
        const path = `/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=5&format=json&origin=*`;
        const options = {
            hostname: 'commons.wikimedia.org',
            path: path,
            method: 'GET',
            headers: {'User-Agent': 'TheNebraskaGuide/1.0'}, //keys can only use letters, numbers, and underscores so brackets are needed for hypens
        };
        //https.request is what is sent to wikimedia
        //I simplified res from response that is recieved from wikimedia
        const req = https.request(options, (res) => {
            let data = '';
            //Reminder: data arrives in chunks which is why I named it chunks
            //.on is an event listener
            res.on('data', chunk => data += chunk);
            //on finish and the data arrived it's pulled and extracted
            
            res.on('end', () => {
                try {
                    //parse in this case turns string to JSON object
                    const result = JSON.parse(data);
                    //result is lots of data from wikimedia, query is a folder, ? means if the query folder exists then it finds heosearch which is the list of images
                    const pages = result.query?.geosearch;
                    if (pages && pages.length > 0) {
                        //Get first result URL
                        const title = pages[0].title;
                        const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title.replace('File:', ''))}?width=800`;
                        resolve(imageUrl);
                    } else {
                        resolve('');
                    }
                } catch (e) {
                    resolve('');
                }
            });
        });
        req.on('error', () => resolve(''));
        req.end();
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

//Uses Anthropic API to create location data that can't be gained form OpenStreetMap Overpass API.
const generateLocationData = (name, place) => {
    //Promise doesn't block the code from going but has other tasks happen in the background while it completes another task
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: `You are a Nebraska outdoor location expert. Generate structured data for this Nebraska locations: "${name}" near "${place}".
                Respond with ONLY a valid JSON object, no extra text, no markdown, no backticks. Use this exact structure:
                {
                    "description_geography": "100+ word description of the geology, terrain, and landscape",
                    "description_nature": "100+ word description of wildlife, plants, and ecosystem",
                    "description_culture": "100+ word description of history, cultral significance, and human use",
                    "tags": "Tag1, Tag2, Tag3, Tag4, Tag5, Tag30+"
                }
                Choose tags only from this list: Historic Landmark,Oregon Trail Site,California Trail Site,Mormon Trail Site,Pony Express Route,Lewis and Clark Trail,Native American History,Pioneer History,Military History,Frontier History,Archaeological Site,Petroglyphs,Burial Mounds,Homestead Site,Ghost Town,Railroad History,Dam Site,Irrigation History,Water Management,Conservation Site,National Historic Site,National Monument,National Park,State Park,State Recreation Area,Wildlife Management Area,Nature Preserve,Wilderness Area,Designated Scenic Area,Natural Landmark,Geological Marvel,Volcanic History,Fossil History,Paleontology,Ancient Riverbed,Sandstone Formation,Limestone Formation,Chalk Formation,Badlands Terrain,Sand Dunes,Loess Hills,Pine Ridge,Sandhills Region,Platte River Valley,Missouri River Valley,Niobrara River Valley,Republican River Valley,Loup River Valley,Elkhorn River Valley,North Platte River,High Plains,Panhandle Region,Northeast Nebraska,Southeast Nebraska,Central Nebraska,Western Nebraska,Eastern Nebraska,River Confluence,Waterfall,Spring Fed,Mineral Springs,Lake Views,Reservoir,River Access,River Island,Sandbar,Wetland Habitat,Riparian Zone,Floodplain,Canyon,Bluffs,Buttes,Escarpment,High Elevation,Elevation Gain,Panoramic Views,Observation Tower,Scenic Overlook,360 Degree Views,Sunrise Views,Sunset Views,Stargazing Spot,Dark Sky Area,Prairie Grass,Tallgrass Prairie,Shortgrass Prairie,Mixed Grass Prairie,Buffalo Grass,Big Bluestem,Switchgrass,Native Plant Life,Seasonal Wildflowers,Spring Wildflowers,Summer Wildflowers,Goldenrod,Sunflower Sightings,Prairie Sunflowers,Coneflowers,Yucca,Prickly Pear Cactus,Sagebrush,Ponderosa Pine,Rocky Mountain Juniper,Bur Oak Forest,Hardwood Forest,Deciduous Forest,Oak-Hickory Forest,Cottonwood Trees,Willow Trees,Aspen Trees,Birch Trees,Ferns and Mosses,Mushroom Foraging,Wild Plums,Autumn Foliage,Spring Blooms,Aquatic Plants,Wildlife Sightings,Birdwatching,Raptor Sightings,Bald Eagle Sightings,Golden Eagle Sightings,Osprey Sightings,Hawk Sightings,Owl Sightings,Sandhill Crane Migration,Snow Goose Migration,Waterfowl,Pelican Sightings,Great Blue Heron,Shorebirds,Songbirds,Warbler Sightings,Meadowlark Sightings,Dickcissel Sightings,Wild Turkey,Pheasant Sightings,Grouse Sightings,Prairie Chicken,Bison Herd,Pronghorn Antelope,White-Tailed Deer,Mule Deer,Elk Sightings,Bighorn Sheep,Mountain Lion Habitat,Coyote Sightings,Red Fox,Beaver Activity,River Otter,Raccoon Sightings,Prairie Dog Town,Ground Squirrels,Jackrabbits,Reptile Sightings,Snake Hazard,Rattlesnake Hazard,Turtle Sightings,Frog and Toad Habitat,Aquatic Life,Walleye Fishing,Bass Fishing,Catfishing,Pike Fishing,Trout Fishing,Carp Fishing,Prehistoric Rhinos,Three-Toed Horses,Ancient Camels,Ice Age Remnant,Eocene Fossils,Active Dig Site,Paved Trail,Dirt Trail,Gravel Path,Crushed Limestone,Boardwalk Path,Paved Roads,Dirt Road Access,Uphill Walk,Flat Path,Steep Inclines,Rock Scrambling,Loop Trail,Short Loop Available,Long Distance Trail,Multi-Day Trek,Rail Trail,Backcountry Trail,Accessible Trail,Wheelchair Accessible Path,Wheelchair Accessible,Stroller Friendly,Family Friendly,Dog Friendly,Pet Friendly,Horse Trail,Horseback Riding,Mountain Biking,Biking Friendly,Biking Prohibited on Trails,Road Cycling,Swimming,Beach Access,White Sand Beach,Boating,Sailing,Jet Skiing,Canoeing,Kayaking,Paddleboarding,Paddleboat Rentals,River Tubing,Fishing,Ice Fishing,Hunting,Archery Range,Shooting Range,Rock Climbing,Ropes Course,Zip Line,Mini Golf,Tennis Courts,Playground,Winter Sledding,Ice Skating,Cross Country Skiing,Snowshoeing,Snowmobiling,Camping,Primitive Camping,Group Camping,RV Hookups,Cabins Available,Teepee Rentals,Lodge On-Site,Indoor Accommodations,Visitor Center,Nature Center,Museum On-Site,Aquarium,Indoor Facility,Active Dig Site,Observatory,Amphitheater,Theater,Outdoor Classroom,School Program Site,Guided Tours,Educational Signage,Interpretive Programs,Living History,Reenactments,Gift Shop,Restaurant On-Site,Snack Bar,Concessions,Boat Rentals,Bike Rentals,Equipment Rentals,Restrooms On-Site,Showers On-Site,Shower Facilities,Drinking Water,Water Stations,Picnic Area,Picnic Shelters,Fire Pits,Grills Available,Fish Cleaning Station,Boat Ramps,Marina,Fuel Available,Parking Available,Free Parking,Gravel Parking,Paved Parking Lot,Large Vehicle Parking,Free Entry,Paid Entry,National Park Pass Accepted,State Park Pass,Annual Pass,Reservation Required,First Come First Served,Seasonal Access,Seasonal Closure Risk,Winter Access,Year Round Access,Open Space,No Shade,Minimal Shade,Shaded Path,Wind Exposure,Extreme Sun Exposure,Arid Climate,High Plains Climate,Humid Climate,Flood Risk,Muddy When Wet,Loose Gravel,Clay Soil,Sandy Soil,Rocky Terrain,Slippery When Wet,Uneven Terrain,River Crossings,Water Crossings,Bridge Crossings,Suspension Bridge,Historic Bridge,High Trestle Bridges,Tunnel Passage,Limited Cell Service,Minimal Cell Service,No Cell Service,Remote Location,Quiet Environment,Crowded in Summer,Popular Destination,Hidden Gem,Roadside Attraction,Unique Landmark,Art Installation,Quirky Vibe,Creative Monument,Industrial Art,Modern Megalith,National Geographic Highlight,Award Winning,Photography Point,Instagram Worthy,Morning Dew,Morning Mist,Fog Possible,Lightning Risk,Flash Flood Risk,Tick Habitat,Mosquito Season,Poison Ivy Present,Thorny Vegetation,Cactus Sightings,Steep Drop Offs,No Guardrails,Sun Protection Required,Water Required,Bear Aware,Cougar Territory,Wasp Nests Possible,Bee Activity,Butterfly Garden,Pollinator Habitat,Monarch Butterfly Migration,Dragonfly Sightings,Firefly Sightings,Night Sky Photography,Aurora Possible,Meteor Shower Viewing,Fossil Collecting,Rock Collecting,Berry Picking,Nature Photography,Landscape Photography,Wildlife Photography,Astrophotography,Painting Location,Sketch Location,Peaceful Walk,Easy Walk,Short Walk,Moderate Hike,Strenuous Hike,Summit Hike,River Walk,Canyon Walk,Cave Exploration,Historic Cemetery,Sod House,Log Cabin,Covered Wagon,Pioneer Artifacts,Native American Artifacts,Military Artifacts,Railroad Artifacts,Agricultural History,Farming Context,Ranching History,Cattle History,Cowboy Culture,Rodeo Nearby,Small Town Access,Community Gathering,Local Events,Summer Festival,Winter Festival,Crane Festival,Migration Festival,Harvest Festival,Fourth of July,Stargazing Event,Science Education,Environmental Education,Water Education,Prairie Education,Conservation Education,Sustainability Focus,Eco Tourism,Leave No Trace,Pack In Pack Out,No Fires,Fire Permitted,Campfire Rings,Firewood Available,Generator Allowed,Quiet Hours,No Alcohol,Alcohol Permitted,No Swimming,Swimming Permitted,No Drones,Drones Permitted,No Collecting,Leash Required,Off Leash Area,Hunting Season,Fishing License Required,Catch and Release,Stocked Lake,Fish Hatchery,Fish Hatchery History,Irrigation Canal,Windmill,Grain Elevator,Historic Depot,Historic Post Office,Historic Church,Historic Schoolhouse,One Room Schoolhouse,Dugout History,Covered Bridge,Iron Bridge,Wooden Bridge,Footbridge,Stepping Stones,Ford Crossing,Natural Spring,Artesian Well,Hot Spring,Cold Spring,Waterfall Swimming,Waterfall Photography,Cascade,Plunge Pool,Swimming Hole,Clear Water,Blue Water,Green Water,Brown Water,Sandy Bottom,Rocky Bottom,Muddy Bottom,Fast Current,Slow Current,Tidal Area,Backwater,Oxbow Lake,Glacial Lake,Man-Made Lake,Natural Lake,Playa Lake,Ephemeral Pond,Vernal Pool,Wetland Restoration,Prairie Restoration,Forest Restoration,Reforestation,Native Seed Project,Invasive Species Management, No Dogs Allowed,No Pets Allowed,No Bicycles,No Motorized Vehicles,No Hunting,No Fishing,No Swimming Signs,No Wading,No Camping,No Overnight Parking,No Glass Containers,No Littering,No Metal Detecting,No Horseback Riding,No Off Road Vehicles,ADA Accessible,Partially Accessible,Not Accessible,Wheelchair Accessible Restrooms,Accessible Parking,Accessible Picnic Tables,Accessible Fishing Pier,Accessible Boat Ramp,Accessible Overlook,Braille Signage,Audio Tours,Sign Language Tours,Sensory Friendly,Low Stimulation Area,Service Animals Welcome,Medical Facility Nearby,First Aid Station,Emergency Phone,Cell Coverage Good,Cell Coverage Fair,Cell Coverage Poor,No Cell Coverage,WiFi Available,Pay Phone,Vault Toilet,Flush Toilet,Composting Toilet,Portable Toilet,No Restrooms,Water Fountain,No Drinking Water,Water Purification Needed,Potable Water,Non-Potable Water,Water Spigot,Ice Available,Firewood For Sale,Firewood Free,Propane Available,Dump Station,Laundry Facilities,Recycling Available,Bear Box Required,Bear Box Provided,Food Storage Required,Lock Box Available,Security Cameras,Ranger Station,Ranger Patrol,Staffed Entrance,Self Pay Entrance,Honor System,24 Hour Access,Gated Entrance,Locked After Dark,Seasonal Staff,Volunteer Run,Donation Based,Free WiFi,Paid Parking,Overflow Parking,Handicap Parking,Bus Parking,Trailer Parking,Horse Trailer Parking,Boat Trailer Parking,Electric Vehicle Charging,Gas Station Nearby,Grocery Store Nearby,Hospital Nearby,Urgent Care Nearby,Pharmacy Nearby,ATM Nearby,Cell Phone Charging,USB Charging Station,Solar Powered Facilities,Eco Friendly Facilities,LEED Certified Building,Green Building,Recycled Materials,Composting Program,Low Impact Design,Carbon Neutral,Wind Powered,Pet Waste Stations,Bag Dispenser,Trash Cans,Dumpster Available,Pack Out Required,Pack In Pack Out Required`
            }]
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
            }
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
                    console.log('API response:', JSON.stringify(response).substring(0, 200));
                    //content[0] is where Claude replies
                    const text = response.content[0].text;
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
    //the /../../Locations.csv means I'm going back two levels, back to TheNebraskaGuide folder and into the Locations.csv
    const csvPath = `${__dirname}/../../Locations.csv`;
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

    //Fetching Nerbaska places from OpenStreetMap Overpass API, place_id=36 is Nebraska, taxon_id=47126 gives nature locations, per_page=50 fetches 50 results at once
    const overpassQuery = '[out:json][timeout:180];area["name"="Nebraska"]["admin_level"="4"]->.nebraska;(node["leisure"="park"]["name"](area.nebraska);way["leisure"="park"]["name"](area.nebraska);node["leisure"="nature_reserve"]["name"](area.nebraska);way["leisure"="nature_reserve"]["name"](area.nebraska);node["leisure"="nature"]["name"](area.nebraska);way["leisure"="nature"]["name"](area.nebraska););out center;';
    //retry 3 times if necessary
    let data;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            //Reminder: Doesn't move on until JSON file is fetched from the url and put into data.
            data = await fetchOverpass(overpassQuery);
            if (data.elements) break;
            console.log(`Attempt ${attempt} returned no elements, retrying in 30 seconds...`);
        } catch (e) {
            console.log(`Attempt ${attempt} failed: ${e.message}`);
            if (attempt === 3) throw e; //throw stops the script entirely unless it runs into catch (it doesn't in this case), break doesn't hard stop everything but instead leaves the loop (often because of success)
        }
        //30 seconds wait (30000 milliseconds)
        //resolve is created as a function
        await new Promise(resolve => setTimeout(resolve, 30000));
    };
    //? operates as a safety mechanism, if elements exist use .length which will give list length if missing return undefined (in this case will rpelace undefined with 0)
    console.log(`Overpass returned ${data.elements?.length || 0} elements`);

    let newRowsAdded = 0;
    const MAX_NEW_LOCATIONS = 20;
    let newRows = '';

    //Now using OpenStreetMaps Overpass API so using elements instead of results
    for (const element of data.elements) {
        //Skipping elemetns without a name because what can be done without a proper name or something
        if (!element.tags?.name) continue;
        //? operates as a safety mechanism, if elements exist use .name to give element name if missing return undefined (in this case will rpelace undefined with unamed)
        console.log(`Found element: ${element.tags?.name || 'unamed'}`);
        //Might be categorized or counted as something else on the app depending on the location so different locational possibiliites
        //Reminder: ? checks if left possibility is correct before trying right option
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        //continue means to essentially continue through to the next iteration (back to finding a name)
        if (!lat || !lon) continue;
        
        const name = element.tags.name;
        const skipWords = [
    'recreation', 'golf', 'disk golf', 'fairground', 'baseball', 'softball', 'football', 'soccer', 'tennis', 
    'unit 1', 'unit 2', 'unit 3', 'dog park', 'skate', 'splash pad', 'swimming pool', 'arena', 'stadium', 'court',
    'school', 'elementary', 'middle school', 'high school', 'academy', 'college', 'university', 'university of',
    'kindergarten', 'preschool', 'daycare', 'learning center', 'campus', 'dormitory', 'fraternity', 'sorority',
    'district', 'board of education', 'alumni', 'charter', 'seminary', 'institute', 'vocational',
    'basketball', 'volleyball', 'pickleball', 'handball', 'racquetball', 'shuffleboard', 'horseshoes', 
    'badminton', 'lacrosse', 'rugby', 'cricket', 'field hockey', 'track', 'velodrome', 'bmx', 'skatepark', 
    'gymnasium', 'fitness', 'exercise station', 'weightlifting', 'batting cage', 'shooting range', 'archery',
    'pool', 'aquatic center', 'wading pool', 'hot tub', 'sauna', 'fountain', 'water park', 'boat ramp', 
    'marina', 'pier', 'dock', 'fishing pier', 'playground', 'swing set', 'slide', 'sandbox', 'jungle gym',
    'pavilion', 'gazebo', 'picnic shelter', 'restroom', 'toilet', 'drinking fountain', 'bench', 'picnic table', 
    'barbecue', 'grill', 'fire pit', 'parking lot', 'campsite', 'rv park', 'visitor center', 'concession', 
    'vending machine', 'utility', 'substation', 'maintenance', 'storage', 'garage',
    'amphitheater', 'bandstand', 'stage', 'cinema', 'theater', 'museum', 'zoo', 'aquarium', 'theme park', 
    'amusement park', 'bowling', 'casino', 'ballroom', 'community center', 'youth center', 'senior center',
    'apartment', 'condo', 'suite', 'lot', 'block', 'subdivision', 'neighborhood', 'business park', 
    'industrial park', 'office', 'hospital', 'clinic', 'church', 'cathedral', 'mosque', 'temple', 
    'synagogue', 'cemetery', 'graveyard', 'shooting', 'gun range', 'rifle', 'firearm', 'sportsman', 'gun club'];
    //List provided by Gemini
        const nameLower = name.toLowerCase();
        if (skipWords.some(word => nameLower.includes(word))) {
            console.log(`Skipping non-trail location: ${name}`);
            continue;
        };
        if (existingNames.includes(name.toLowerCase())) continue;

        //.tags[] is one of the premade javascript object which apparently objects are another depiction (other language) of dicionaries (I thinking they were completely different) 
        let address = element.tags['addr:full'] ||
            (element.tags['addr:housenumber'] && element.tags['addr:street'] ? `${element.tags['addr:housenumber']} ${element.tags['addr:street']} ${element.tags['addr:city'] ? ', ' + element.tags['addr:city'] : ''}${element.tags['addr:state'] ? ' ' + element.tags['addr:state'] : ''}${element.tags['addr:postcode'] ? ' ' + element.tags['addr:postcode'] : ''}` : null) ||
            (element.tags['addr:city'] && element.tags['addr:state'] ? `${element.tags['addr:city']}, ${element.tags['addr:state']}` : null) ||
            element.tags['addr:street'] ||
            element.tags.location ||
            element.tags.address ||
            element.tags.description ||
            element.tags.note ||
            element.tags['is_in'] ||
            element.tags['addr:county'];
        if (!address) {
            console.log(`Looking up address for ${name}...`);
            address = await reverseGeocode(lat, lon);
        }
        //Fetching images from Wikimedia Commons using locational coordinates
        console.log(`Fetching image for ${name}...`);
        const image = await fetchWikimediaImage(lat, lon, name);
        console.log(`Image found: ${image ? 'yes' : 'no'}`};

        if (newRowsAdded >= MAX_NEW_LOCATIONS) break;
        console.log(`Generating data for ${name}...`);
        const generated = await generateLocationData(name, address);
        
        //CSV rows
        newRows += `\n${escapeCSV(name)},${escapeCSV(address)},${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)},0,0,${escapeCSV(generated.tags)},${escapeCSV(generated.description_geography)},${escapeCSV(generated.description_nature)},${escapeCSV(generated.description_culture)},${escapeCSV(image)}`;
        newRowsAdded++;
        console.log(`Adding: ${name}`);
    }

    if (newRowsAdded > 0) {
        //Adding the new rows the the Locations.csv
        fs.appendFileSync(csvPath, newRows);
        console.log(`Added ${newRowsAdded} new locations to Locations.csv`);
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
