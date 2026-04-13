import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useState} from 'react';
import {AppContext} from '../Context/AppContext';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg'; //SVG: Scalable Vector Graphic
import useLocations from '../Services/useLocations';

const ReadinessCircle = ({percentage, label, color}) => {
	const size = 55;//Total diameter of the container including strokeWidth
	const strokeWidth = 4;//line thickness
	const radius = (size - strokeWidth) / 2;//Distance from center to edge of circle
	const circumference = 2 * radius * Math.PI;//Length around circle (~138)
	const strokeDashoffset = circumference - (percentage / 100) * circumference;//How much of the strokeWidth is seen

	return (
		<View style = {styles.circleBase}>
			<Svg width = {size} height = {size} style = {styles.svgContainer}>
				{/*Light gray circle in the background*/}
				<Circle
					cx = {size / 2}
					cy = {size / 2}
					r = {radius}
					stroke = '#E0E0E0'
					strokeWidth = {strokeWidth}
					fill = 'none'
				/>
				{/*Progress line*/}
				<Circle
					cx = {size / 2}
					cy = {size / 2}
					r = {radius}
					stroke = {color}
					strokeWidth = {strokeWidth}
					fill = 'none'
					strokeDasharray = {circumference}
					strokeDashoffset = {strokeDashoffset}//How I show a certain percentage
					strokeLinecap = 'round'//makes the end of the line look more round
					rotation = '-90'//sets the start of line to the top center
					/*Template Literals: Use backticks that work like quotes or apostrephes
					but also watch out for variables too the ${ } can hold math and variables
					that are then converted back into part of the string.*/
					origin = {`${size / 2}, ${size / 2}`}
				/>
			</Svg>
			<Text style = {styles.circleText}>{label}</Text>
		</View>
	);
};

export const Home = ({navigation}) => {
   //useState (memory), useEffect (lifecycle/timing), useContext (global data)
   //Remember, hooks must be called within the used function
   const {communityPosts, heightCm, weightKg, getSatisfaction} = useContext(AppContext);

   // Same BMI formula as Locations screen
   const difficultyPercent = (() => {
      if (!heightCm || !weightKg) return 0;
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      return Math.min(100, Math.max(0, Math.round(((bmi - 15) / 25) * 100)));
   })();
   const {locations, loading} = useLocations();
   const [searchText, setSearchText] = useState('');//Reminder: searchText is a variable, setSearchText refreshes (rewrites) the value
   const [selectedTags, setSelectedTags] = useState([]);
   const [filterVisible, setFilterVisible] = useState(false);
   const filteredLocations = locations.filter(location => {
      const query = searchText.toLowerCase();
      const matchesSearch = !searchText.trim() ||
         //take a location name/address/tag make it lowercase (if possible)
         //.includes() means check if query is included in the location word
         location.name?.toLowerCase().includes(query) ||
         location.address?.toLowerCase().includes(query);
         //tags are csv so use .join to remove commas
         //location.tags?.join(',').toLowerCase().includes(query)
      const matchesTags = selectedTags.length === 0 ||
         selectedTags.every(tag => location.tags?.includes(tag));
      return matchesSearch && matchesTags;
   });
   const tagCategories = [
  {
    label: 'Park & Administrative',
    tags: ['National Park', 'National Monument', 'National Historic Site', 'State Park', 'State Recreation Area', 'Wildlife Management Area', 'Nature Preserve', 'Wilderness Area', 'Designated Scenic Area', 'Open Space']
  },
  {
    label: 'Historic Trails',
    tags: ['Oregon Trail Site', 'California Trail Site', 'Mormon Trail Site', 'Pony Express Route', 'Lewis and Clark Trail']
  },
  {
    label: 'Early History',
    tags: ['Native American History', 'Pioneer History', 'Frontier History', 'Archaeological Site', 'Petroglyphs', 'Burial Mounds', 'Homestead Site', 'Ghost Town', 'Historic Landmark', 'Historic Cemetery', 'Sod House', 'Log Cabin', 'Covered Wagon', 'Pioneer Artifacts', 'Native American Artifacts', 'Military Artifacts', 'Dugout History']
  },
  {
    label: 'Industry & Infrastructure',
    tags: ['Railroad History', 'Dam Site', 'Irrigation History', 'Water Management', 'Conservation Site', 'Railroad Artifacts', 'Agricultural History', 'Farming Context', 'Ranching History', 'Cattle History', 'Cowboy Culture', 'Rodeo Nearby', 'Irrigation Canal', 'Windmill', 'Grain Elevator', 'Historic Depot', 'Historic Post Office', 'Historic Church', 'Historic Schoolhouse', 'One Room Schoolhouse']
  },
  {
    label: 'Geology & Fossils',
    tags: ['Geological Marvel', 'Volcanic History', 'Fossil History', 'Paleontology', 'Ancient Riverbed', 'Sandstone Formation', 'Limestone Formation', 'Chalk Formation', 'Badlands Terrain', 'Buttes', 'Escarpment', 'Prehistoric Rhinos', 'Three-Toed Horses', 'Ancient Camels', 'Ice Age Remnant', 'Eocene Fossils', 'Active Dig Site', 'Rock Collecting', 'Fossil Collecting']
  },
  {
    label: 'Landforms',
    tags: ['Sand Dunes', 'Loess Hills', 'Pine Ridge', 'Sandhills Region', 'High Plains', 'Canyon', 'Bluffs', 'High Elevation', 'Elevation Gain', 'Rocky Terrain', 'Uneven Terrain']
  },
  {
    label: 'Water Features',
    tags: ['River Confluence', 'Waterfall', 'Spring Fed', 'Mineral Springs', 'Lake Views', 'Reservoir', 'River Access', 'River Island', 'Sandbar', 'Wetland Habitat', 'Riparian Zone', 'Floodplain', 'Natural Spring', 'Artesian Well', 'Hot Spring', 'Cold Spring', 'Waterfall Swimming', 'Waterfall Photography', 'Cascade', 'Plunge Pool', 'Swimming Hole', 'Clear Water', 'Blue Water', 'Green Water', 'Brown Water', 'Sandy Bottom', 'Rocky Bottom', 'Muddy Bottom', 'Fast Current', 'Slow Current', 'Tidal Area', 'Backwater', 'Oxbow Lake', 'Glacial Lake', 'Man-Made Lake', 'Natural Lake', 'Playa Lake', 'Ephemeral Pond', 'Vernal Pool']
  },
  {
    label: 'Rivers of Nebraska',
    tags: ['Platte River Valley', 'Missouri River Valley', 'Niobrara River Valley', 'Republican River Valley', 'Loup River Valley', 'Elkhorn River Valley', 'North Platte River']
  },
  {
    label: 'Regions',
    tags: ['Panhandle Region', 'Northeast Nebraska', 'Southeast Nebraska', 'Central Nebraska', 'Western Nebraska', 'Eastern Nebraska', 'Small Town Access', 'Remote Location']
  },
  {
    label: 'Flora & Plants',
    tags: ['Prairie Grass', 'Tallgrass Prairie', 'Shortgrass Prairie', 'Mixed Grass Prairie', 'Buffalo Grass', 'Big Bluestem', 'Switchgrass', 'Native Plant Life', 'Seasonal Wildflowers', 'Spring Wildflowers', 'Summer Wildflowers', 'Goldenrod', 'Sunflower Sightings', 'Prairie Sunflowers', 'Coneflowers', 'Yucca', 'Prickly Pear Cactus', 'Sagebrush', 'Ponderosa Pine', 'Rocky Mountain Juniper', 'Bur Oak Forest', 'Hardwood Forest', 'Deciduous Forest', 'Oak-Hickory Forest', 'Cottonwood Trees', 'Willow Trees', 'Aspen Trees', 'Birch Trees', 'Ferns and Mosses', 'Mushroom Foraging', 'Wild Plums', 'Autumn Foliage', 'Spring Blooms', 'Aquatic Plants', 'Butterfly Garden', 'Pollinator Habitat', 'Berry Picking', 'Thorny Vegetation', 'Cactus Sightings']
  },
  {
    label: 'Wildlife & Birds',
    tags: ['Wildlife Sightings', 'Birdwatching', 'Raptor Sightings', 'Bald Eagle Sightings', 'Golden Eagle Sightings', 'Osprey Sightings', 'Hawk Sightings', 'Owl Sightings', 'Sandhill Crane Migration', 'Snow Goose Migration', 'Waterfowl', 'Pelican Sightings', 'Great Blue Heron', 'Shorebirds', 'Songbirds', 'Warbler Sightings', 'Meadowlark Sightings', 'Dickcissel Sightings', 'Wild Turkey', 'Pheasant Sightings', 'Grouse Sightings', 'Prairie Chicken', 'Bison Herd', 'Pronghorn Antelope', 'White-Tailed Deer', 'Mule Deer', 'Elk Sightings', 'Bighorn Sheep', 'Mountain Lion Habitat', 'Coyote Sightings', 'Red Fox', 'Beaver Activity', 'River Otter', 'Raccoon Sightings', 'Prairie Dog Town', 'Ground Squirrels', 'Jackrabbits', 'Reptile Sightings', 'Turtle Sightings', 'Frog and Toad Habitat', 'Aquatic Life', 'Monarch Butterfly Migration', 'Dragonfly Sightings', 'Firefly Sightings', 'Bear Aware', 'Cougar Territory', 'Bee Activity', 'Wasp Nests Possible']
  },
  {
    label: 'Fishing',
    tags: ['Walleye Fishing', 'Bass Fishing', 'Catfishing', 'Pike Fishing', 'Trout Fishing', 'Carp Fishing', 'Fishing', 'Ice Fishing', 'Fish Cleaning Station', 'Fish Hatchery', 'Fish Hatchery History', 'Catch and Release', 'Stocked Lake', 'Fishing License Required']
  },
  {
    label: 'Trails & Hiking',
    tags: ['Paved Trail', 'Dirt Trail', 'Gravel Path', 'Crushed Limestone', 'Boardwalk Path', 'Uphill Walk', 'Flat Path', 'Steep Inclines', 'Rock Scrambling', 'Loop Trail', 'Short Loop Available', 'Long Distance Trail', 'Multi-Day Trek', 'Rail Trail', 'Backcountry Trail', 'Accessible Trail', 'Wheelchair Accessible Path', 'Peaceful Walk', 'Easy Walk', 'Short Walk', 'Moderate Hike', 'Strenuous Hike', 'Summit Hike', 'River Walk', 'Canyon Walk', 'Cave Exploration', 'Shaded Path']
  },
  {
    label: 'Recreation & Sports',
    tags: ['Horse Trail', 'Horseback Riding', 'Mountain Biking', 'Biking Friendly', 'Road Cycling', 'Swimming', 'Boating', 'Sailing', 'Jet Skiing', 'Canoeing', 'Kayaking', 'Paddleboarding', 'Paddleboat Rentals', 'River Tubing', 'Hunting', 'Archery Range', 'Shooting Range', 'Rock Climbing', 'Ropes Course', 'Zip Line', 'Mini Golf', 'Tennis Courts', 'Playground', 'Winter Sledding', 'Ice Skating', 'Cross Country Skiing', 'Snowshoeing', 'Snowmobiling', 'Hunting Season']
  },
  {
    label: 'Camping & Lodging',
    tags: ['Camping', 'Primitive Camping', 'Group Camping', 'RV Hookups', 'Cabins Available', 'Teepee Rentals', 'Lodge On-Site', 'Indoor Accommodations', 'No Camping']
  },
  {
    label: 'Education & Culture',
    tags: ['Visitor Center', 'Nature Center', 'Museum On-Site', 'Aquarium', 'Indoor Facility', 'Observatory', 'Amphitheater', 'Theater', 'Outdoor Classroom', 'School Program Site', 'Guided Tours', 'Educational Signage', 'Interpretive Programs', 'Living History', 'Reenactments', 'Community Gathering', 'Local Events', 'Summer Festival', 'Winter Festival', 'Crane Festival', 'Migration Festival', 'Harvest Festival', 'Fourth of July', 'Stargazing Event', 'Science Education', 'Environmental Education', 'Water Education', 'Prairie Education', 'Conservation Education', 'Sustainability Focus', 'Eco Tourism']
  },
  {
    label: 'Amenities',
    tags: ['Gift Shop', 'Restaurant On-Site', 'Snack Bar', 'Concessions', 'Boat Rentals', 'Bike Rentals', 'Equipment Rentals', 'Restrooms On-Site', 'Showers On-Site', 'Shower Facilities', 'Drinking Water', 'Water Stations', 'Picnic Area', 'Picnic Shelters', 'Fire Pits', 'Grills Available', 'Boat Ramps', 'Marina', 'Fuel Available', 'Parking Available', 'Free Parking', 'Gravel Parking', 'Paved Parking Lot', 'Large Vehicle Parking', 'Vault Toilet', 'Flush Toilet', 'Composting Toilet', 'Portable Toilet', 'No Restrooms', 'Water Fountain', 'Potable Water', 'Non-Potable Water', 'Water Spigot', 'Ice Available', 'Dump Station', 'Laundry Facilities', 'Recycling Available', 'WiFi Available', 'Free WiFi', 'Pay Phone', 'Cell Phone Charging', 'USB Charging Station', 'Pet Waste Stations', 'Bag Dispenser', 'Trash Cans', 'Dumpster Available']
  },
  {
    label: 'Entry & Access',
    tags: ['Free Entry', 'Paid Entry', 'National Park Pass Accepted', 'State Park Pass', 'Annual Pass', 'Reservation Required', 'First Come First Served', 'Seasonal Access', 'Seasonal Closure Risk', 'Winter Access', 'Year Round Access', 'Paved Roads', 'Dirt Road Access', '24 Hour Access', 'Gated Entrance', 'Locked After Dark', 'Self Pay Entrance', 'Honor System', 'Staffed Entrance', 'Seasonal Staff', 'Volunteer Run', 'Donation Based']
  },
  {
    label: 'Views & Environment',
    tags: ['Panoramic Views', 'Observation Tower', 'Scenic Overlook', '360 Degree Views', 'Sunrise Views', 'Sunset Views', 'Stargazing Spot', 'Dark Sky Area', 'Night Sky Photography', 'Aurora Possible', 'Meteor Shower Viewing', 'Nature Photography', 'Landscape Photography', 'Wildlife Photography', 'Astrophotography', 'Painting Location', 'Sketch Location', 'Quiet Environment', 'Crowded in Summer', 'Popular Destination', 'Hidden Gem', 'Roadside Attraction', 'Unique Landmark', 'Art Installation', 'Quirky Vibe', 'Creative Monument', 'Industrial Art', 'Modern Megalith', 'National Geographic Highlight', 'Award Winning', 'Photography Point', 'Instagram Worthy', 'No Shade', 'Minimal Shade', 'Wind Exposure', 'Arid Climate', 'High Plains Climate', 'Humid Climate']
  },
  {
    label: 'Safety & Hazards',
    tags: ['Snake Hazard', 'Rattlesnake Hazard', 'Tick Habitat', 'Mosquito Season', 'Poison Ivy Present', 'Lightning Risk', 'Flash Flood Risk', 'Flood Risk', 'Muddy When Wet', 'Loose Gravel', 'Slippery When Wet', 'River Crossings', 'Water Crossings', 'Bridge Crossings', 'Suspension Bridge', 'Historic Bridge', 'High Trestle Bridges', 'Tunnel Passage', 'Limited Cell Service', 'Minimal Cell Service', 'No Cell Service', 'No Cell Coverage', 'Cell Coverage Good', 'Cell Coverage Fair', 'Cell Coverage Poor', 'Extreme Sun Exposure', 'Steep Drop Offs', 'No Guardrails', 'Sun Protection Required', 'Water Required', 'Medical Facility Nearby', 'First Aid Station', 'Emergency Phone']
  },
  {
    label: 'Rules & Permits',
    tags: ['Family Friendly', 'Dog Friendly', 'Pet Friendly', 'Leash Required', 'Off Leash Area', 'No Dogs Allowed', 'No Pets Allowed', 'Biking Prohibited on Trails', 'No Bicycles', 'No Motorized Vehicles', 'No Hunting', 'No Fishing', 'No Swimming', 'Swimming Permitted', 'No Swimming Signs', 'No Wading', 'No Drones', 'Drones Permitted', 'No Collecting', 'No Fires', 'Fire Permitted', 'Campfire Rings', 'Firewood Available', 'Firewood For Sale', 'Firewood Free', 'Generator Allowed', 'Quiet Hours', 'No Alcohol', 'Alcohol Permitted', 'No Overnight Parking', 'No Glass Containers', 'No Littering', 'No Metal Detecting', 'No Horseback Riding', 'No Off Road Vehicles', 'Leave No Trace', 'Pack In Pack Out', 'Pack Out Required', 'Pack In Pack Out Required', 'Bear Box Required', 'Bear Box Provided', 'Food Storage Required', 'Lock Box Available']
  },
  {
    label: 'Accessibility',
    tags: ['Wheelchair Accessible', 'Stroller Friendly', 'Accessible Trail', 'ADA Accessible', 'Partially Accessible', 'Not Accessible', 'Wheelchair Accessible Restrooms', 'Accessible Parking', 'Accessible Picnic Tables', 'Accessible Fishing Pier', 'Accessible Boat Ramp', 'Accessible Overlook', 'Braille Signage', 'Audio Tours', 'Sign Language Tours', 'Sensory Friendly', 'Low Stimulation Area', 'Service Animals Welcome']
  },
];

   const toggleTag = (tag) => {
      setSelectedTags(prev =>
         //Is a certain tag already selected, if it is turn it off, if not then add it to the list of previously selected tags
         prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
   };
	return (
		<View style = {styles.container}>
			<ScrollView
				showsVerticalScrollIndicator = {false}
				contentContainerStyle = {{paddingBottom: 100}}//Space between card and bottom of the screen
			>
				
            {/*Top goal text*/}
               <View style = {styles.descriptionBox}>
                  <Text style = {styles.descriptionText}>
                     The goal is to create an app that allows you to quickly find your special spot based on your likes and dislikes through a very selective system. All the while providing all you need to know beforehand through the weather and readiness score features. 
                  </Text>
               </View>
            
            {/*Search bar*/}
            <View style = {styles.searchContainer}>
               <View style = {styles.searchBar}>
                  <Ionicons name = 'search' size = {20} color = 'black' style = {{marginLeft: 12}}/>
                  <TextInput
                     placeholder = 'Search'
                     style = {styles.searchInput}
                     placeholderTextColor = '#444'
                     value = {searchText}
                     onChangeText = {setSearchText}
                  />
                  <Pressable onPress = {() => setFilterVisible(true)}>
                     <Ionicons
                        name = {selectedTags.length > 0 ? 'options-outline' : 'options'}
                        size = {22}
                        color = {selectedTags.length > 0 ? '#01a598' : 'black'}
                        style = {{marginRight: 12}}
                     />
                  </Pressable>
               </View>
            </View>

            {/*Recent title*/}
            <Text style = {styles.sectionTitle}>Recent</Text>

            {/*Location Cards*/}
            {/*Automatically imported from Locations.csv in GitHub directed by the useLocaitons.jsx*/}
            {loading ? (
               <Text style = {{textAlign: 'center', color: '#999', marginTop: 20}}>Loading Locations...</Text>
            ) : (
               //locations.map places an object into location and iterates through the list
               filteredLocations.map((location, i) => (
                  //'Locations' refers to the location screen, and location refers to one of the objects created form the screen
                  <Pressable key = {i} style = {styles.card} onPress = {() => navigation.navigate('Locations', {location})}>
                     <Image
                        //url(Uniform Resource Locator) and uri(Uniform Resource Identifier), uri is the parent of url
                        //If there is a location image from GitHub then use the location.image if not then use the placeholder image
                        source = {
                     communityPosts[location?.name]?.[0]?.uri
                     ? {uri: communityPosts[location?.name][0].uri} : location?.image
                     ? {uri: location.image} : require('../assets/images/placeholder.jpg')
                     }
                        style = {styles.cardImage}
                        resizeMode = 'cover'
                     />
                     <View style = {styles.cardInfo}>
                        <View style = {{flex: 1}}>
                           <Text style = {styles.locationName}>{location.name}</Text>
                           <Text style = {styles.locationAddress}>{location.address}</Text>
                           {/*<Text style = {styles.starRating}>★10}</Text>*/}
                        </View>
                        <View style = {styles.progressCircle}>
                           <ReadinessCircle percentage = {getSatisfaction(location.name)} label = {getSatisfaction(location.name) + '%'} color = '#01a598'/>
                           <ReadinessCircle percentage = {difficultyPercent} label = 'Diff' color = '#FFD700'/>
                        </View>
                     </View>
                  </Pressable>
               ))
            )}
			</ScrollView>

         {/*Filter Panel*/}
            {filterVisible && (
               <View style = {styles.filterOverlay}>
                  <View style = {styles.filterPanel}>{/*Flipping this line and the next flips side filterscreen opens on
                  becuase styles.filterPanel has width: '80%' so when flex is added the remaining space is filled on the
                  right making it have text on the left side*/}
                     <Pressable style = {styles.filterDismiss} onPress = {() => setFilterVisible(false)}/>
                     <View style = {styles.filterHeader}>
                        <Text style = {styles.filterTitle}>Filter</Text>
                        {/*; can seperate two actions*/}
                        {/*
                        <Pressable onPress = {() => {setSelectedTags([]); setFilterVisible(false);}}>
                           <Text style = {styles.filterClear}>Clear All</Text>
                        </Pressable>
                        */}
                        <Pressable onPress = {() => setFilterVisible(false)}>
                           <Ionicons name = 'close' size = {24} color = '#333'/>
                        </Pressable>
                     </View>
                     <ScrollView showsVerticalScrollIndicator = {false}>
                        {/*ci represents Category Index, ti represents Text Index, similarly to how jsut i would be used normally*/}
                        {/*.map() is an updating loop, with parameters of (string/object, index/position, full list/array (optional)*/}
                        {tagCategories.map((category, ci) => (
                           <View key = {ci} style = {styles.filterCategory}>
                              <Text style = {styles.filterCategoryLabel}>{category.label}</Text>
                              <View style = {styles.filterTagsWrap}>
                                 {category.tags.map((tag, ti) => (
                                    <Pressable
                                       key = {ti}
                                       style = {[styles.filterTag, selectedTags.includes(tag) && styles.filterTagSelected]}
                                       onPress = {() => toggleTag(tag)}
                                    >
                                       <Text style = {[styles.filterTagText, selectedTags.includes(tag) && styles.filterTagTextSelected]}>{tag}</Text>
                                    </Pressable>
                                 ))}
                              </View>
                           </View>
                        ))}
                     </ScrollView>
                     <View style = {{flexDirection: 'row', gap: 10, marginTop: 16}}>
                        <Pressable
                           style = {[styles.filterApplyBtn, {flex: 1, backgroundColor: '#f0f0f0'}]}
                           onPress = {() => setSelectedTags([])}
                        >
                           <Text style = {[styles.filterApplyText, {color: '#333'}]}>Clear All</Text>
                        </Pressable>
                        <Pressable
                           style = {[styles.filterApplyBtn, {flex: 1}]}
                           onPress = {() => setFilterVisible(false)}
                        >
                           <Text style = {styles.filterApplyText}>
                              {selectedTags.length > 0 ? `Apply (${selectedTags.length})` : 'Apply'}
                           </Text>
                        </Pressable>
                     </View>
                  </View>
               </View>
            )}

		</View>
	);
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   descriptionBox: {
      backgroundColor: '#dbdbdb',
      margin: 15,
      padding: 12,
      borderRadius: 8
   },
   descriptionText: {
      textAlign: 'center',
      fontSize: 13,
      color: '#333',
   },
   searchContainer: {
      paddingHorizontal: 20,
      marginBottom: 15,
   },
   searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#01a598',
      borderRadius: 25,
      height: 45,
      backgroundColor: '#b2dfdb',
   },
   searchInput: {
      flex: 1,
      paddingLeft: 8,
      fontSize: 16,
      color: 'black',
   },
   sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginLeft: 20,
      marginBottom: 10,
      textDecorationLine: 'underline',
      textDecorationColor: '#01a598',
   },
   card: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 15,
      backgroundColor: '#fff',
      elevation: 4,
      overflow: 'hidden',
   },
   cardImage: {
      width: '100%',
      height: 180,
   },
   cardInfo: {
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
   },
   locationName: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   locationAddress: {
      fontSize: 13,
      color: '#777',
   },
   /*starRating: {
      fontSize: 14,
      color: '#01a598',
      marginTop: 4,
      fontWeight: 'bold'
   },*/
   progressCircle: {
      flexDirection: 'row'
   },
   circleBase: {
      width: 55,
      height: 55,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
   },
   svgContainer: {
      position: 'absolute',
   },
   circleText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#333',
   },
   filterOverlay: {
      position: 'absolute',//alows floating over the entire screen
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,//top, left, right, bottom alltogether stretches view across entire screen
      flexDirection: 'row', //Align objects next to each other (horizontally) instead of stacked (vertically)
      zIndex: 100,//Layer location, higher numbers on top of more things
   },
   filterDismiss: {
      flex: 1,//fill all available space
      backgroundColor: 'rgba(0,0,0,0.4)',//black with 40% transparency
   },
   filterPanel: {
      width: '80%',//covers 80% of the screen from left to right
      backgroundColor: '#fff',
      paddingTop: 50,//space available at the top
      paddingHorizontal: 16,//sets both padding left and right at once
      paddingBottom: 80,//space available at the bottom
   },
   filterHeader: {
      flexDirection: 'row',
      alignItems: 'center',//aligns objects vertically in the middle of their row
      justifyContent: 'space-between',//pushes objects to outer edges
      marginBottom: 16,//gap outside bottom of object pushing next items down
   },
   filterTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#222',
   },
   filterClear: {
      fontSize: 14,
      color: '#01a598',
      fontWeight: '600',
   },
   filterCategory: {
      marginBottom: 20,
   },
   filterCategoryLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
   },
   filterTagsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',//when object leaves edge of the specified area (view) it atomatically moves to next area below
      gap: 8,//Sets consistent 8-pixel space between objects
   },
   filterTag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,//rounds corners
      borderWidth: 1,//creates thickness to border
      borderColor: '#ddd',
      backgroundColor: '#f5f5f5',
   },
   filterTagSelected: {
      backgroundColor: '#01a598',
      borderColor: '#01a598'
   },
   filterTagText: {
      fontSize: 12,
      color: '#444',
   },
   filterTagTextSelected: {
      color: '#fff',
      fontWeight: '600',
   },
   filterApplyBtn: {
      backgroundColor: '#01a598',
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: 'center',//aligns items vertically in the middle of their row
      marginTop: 16,
   },
   filterApplyText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
   },
});

/*
FILE SUMMARY
The Home file is the first page they'll see after being signed in. Home begins with the describing of the
Scg readiness circle and the progress that can be inputted along withit. You can scroll down although not
wiht ScrollView. There' the goal text, search bar, and all necessary components of cards which are essentially
often square like objects that are used to place other objbects on them so they're used by a floating base.
These cards can be clicked on so they bring you the Locations screen.
*/