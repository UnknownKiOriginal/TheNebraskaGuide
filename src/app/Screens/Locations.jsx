import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useContext} from 'react';
import {AppContext} from '../Context/AppContext';
import {Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import useWeather from '../Services/useWeather';
import {launchImageLibrary} from 'react-native-image-picker'
import MapView, {Marker} from 'react-native-maps';


//ProgCircle must start with an uppercase letter
const ProgCircle = ({percentage, label, color}) => {
   const size = 80; //total diameter
   const strokeWidth = 7; //bar thickness
   const radius = (size - strokeWidth) / 2; //inner radius
   const circumference = 2 * radius * Math.PI;
   const strokeDashoffset = circumference - (percentage / 100) * circumference; //progress bar

   return (
      <View style = {styles.circleBase}>
         <Svg width = {size} height = {size} style = {styles.svgContainer}>
            {/*Fill is the middle color of the circle, strokeDasharray is dash length of the cirumference*/}
            {/*Behind circle stroke and above circle stroke*/}
            <Circle cx = {size / 2} cy = {size / 2} r = {radius} stroke = '#E8E8E8' strokeWidth = {strokeWidth} fill = 'none'/>
            <Circle cx = {size / 2} cy = {size / 2} r = {radius} stroke = {color} strokeWidth = {strokeWidth} fill = 'none' strokeDasharray = {circumference} strokeDashoffset = {strokeDashoffset} strokeLinecap = 'round' transform = {`rotate(-90 ${size / 2} ${size / 2})`}/>
         </Svg>
         <Text style = {styles.circlePercent}>{percentage}%</Text>
         <Text style = {styles.circleLabel}>{label}</Text>
      </View>
   );
};

const commentsTemplates = [
   {label: 'General Review', text: 'I visited ________ and overall it was [amazing / decent / disappointing]. The trail conditions were [good / muddy / rocky] and the views were [breathtaking / okay / underwhelming]. I would rate my experience a [___]/10 and would [definitely / maybe / not] recommend it to others.'},
   {label: 'Hiker\'s Report', text: 'Trail difficulty: [Easy / Moderate / Hard]. I completed the hike in approximately [__] hours. The elevation was [manageable / challenging / brutal]. Bring [water / hiking poles / sturdy boots] — you will need them. Best time to visit: [morning / afternoon / sunset].'},
   {label: 'Weather & Conditions', text: 'Visited on [date]. Weather was [sunny / cloudy / windy / stormy]. Temperature felt around [__]°F. The ground was [dry / wet / icy]. Visibility from the top was [excellent / limited / poor]. Check the forecast before you go — conditions change fast out here.'},
   {label: 'Family Visit', text: 'Brought [kids / elderly family / a group] and the experience was [great / okay / tough]. The facility has [restrooms / a gift shop / parking] which was [very helpful / adequate / lacking]. Kids aged [__] found the trail [fun / manageable / too difficult]. Overall a [wonderful / decent] family outing.'},
   {label: 'Photography Tip', text: 'Best photo spot: [describe location]. Ideal lighting is [golden hour / midday / overcast]. I used a [phone / DSLR / drone] to capture the views. The rock looks especially dramatic from the [north / south / east / west] side. Don\'t miss the [wildflowers / sky / shadow formations].'},
];

//Weather array with the current day being the first day
const getWeatherDays = () => {
   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
   const today = new Date().getDay(); //getDay() returns 0 = Sun, 1= Mon, and so on.
   return Array.from({length: 7}, (_, i) => days[(today + i) % 7]);
   // % 7 uses modulous so we can use the remainder to wrap the variables so after Sat t goes back to Sun
};
const weatherDays = getWeatherDays();

//Making weather Icons relavent to true weather
const getWeatherIcon = (code) => {
   if (code === 0) {return 'sunny-outline'}
   if (code <= 3) {return 'partly-sunny-outline'}
   if (code <= 48) {return 'cloudy-outline'}
   if (code <= 67) {return 'rainy-outline'}
   if (code <= 77) {return 'snow-outline'}
   if (code <= 82) {return 'thunderstorm-outline'}
   else {return 'cloud-outline'}
};

export const Locations = ({navigation, route}) => {
   const {communityPosts, setCommunityPosts, favorites = [], addFavorites, removeFavorites, submitRating, getSatisfaction, getUserRating, userName, heightCm, weightKg} = useContext(AppContext);

   // BMI-based difficulty: clamp(((BMI - 15) / 25) * 100, 0, 100)
   const difficultyPercent = (() => {
      if (!heightCm || !weightKg) return 0;
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      return Math.min(100, Math.max(0, Math.round(((bmi - 15) / 25) * 100)));
   })();

   //route.params.location reprents full location object with all detailed information
   //? is often used with something else but by default if ? is just used and no location was passed through it would be undefined
   const location = route.params?.location;

   //useState gives the destructuring variables a default
   //set...(variable) like setModalVisible which redraws the screen with new value

   //modalVisible controls whether the 'Add Picture' popup is shown or hidden
   const [modalVisible, setModalVisible] = useState(false);
   //userRating pre-fills with the user's existing rating if they've rated before
   const existingRating = getUserRating(location?.name);
   const [userRating, setUserRating] = useState(existingRating !== null ? String(existingRating) : '');
   //showAllTags determines if the characteristics are in full list mode
   const [showAllTags, setShowAllTags] = useState(false);
   //dropdownOpen determines whether the comment template dropdown is up
   const [dropdownOpen, setDropdownOpen] = useState(false);
   //selectedTemplate stores whihc template is being used, null being none
   const [selectedTemplate, setSelectedTemplate] = useState(null);
   //notes stores what's written in the 'Add Picture' pop up
   const [notes, setNotes] = useState('');
   //Remember that ? if not used would be considered undefined
   //Additionally, a computer reads optional chains (?) from left to right
   const {weatherData, weatherLoading} = useWeather(location?.latitude, location?.longitude);
   //starts without any posts up
   const [pickedImage, setPickedImage] = useState(null);
   const [comments, setComments] = useState([]);
   const [commentText, setCommentText] = useState('');
   const isFavorited = favorites.some(f => f.name === location?.name);

   //Needs a second question mark becasue slice is an array but location is an object two different types two different question marks
   const fewSampleTags = location?.tags?.slice(0, 10) || [];
   const allSampleTags = location?.tags || [];

   const pickImage = () => {
      launchImageLibrary({mediaType: 'photo', quality: 0.7}, (response) => {
         if (!response.didCancel && response.assets?.[0]?.uri) {
            setPickedImage(response.assets[0].uri);
         }
      });
   };

   return (
      <View style = {styles.container}>
         {/*contentContainerStyle adds 80px at the bottom for space to see bottom items*/}
         <ScrollView showsVerticalScrollIndicator = {false} contentContainerStyle = {{paddingBottom: 80}}>

            {/*TOP IMAGE*/}
            <View style = {styles.primaryBox}>
               <Image
                  source = {
                     communityPosts[location?.name]?.[0]?.uri
                     ? {uri: communityPosts[location?.name][0].uri} : location?.image
                     ? {uri: location.image} : require('../assets/images/placeholder.jpg')
                  }
                  style = {styles.primaryImage}
               />
               {/*BACK BUTTON*/}
               <Pressable style = {styles.backBtn} onPress = {() => navigation.goBack()}>
                  <Ionicons name = 'arrow-back' size = {26} color = '#fff'/>
               </Pressable>
            </View>

            {/*TOP CARD*/}
            <View style = {styles.floatingCard}>
               <View style = {styles.titleRow}>
                  <Text style = {styles.locationTitle}>{location?.name}</Text>
                  {/*! = Logical Not Operator, this actually acts more as a toggle or opposite of than
                  simply just not in this case because when isFavorited is true it can be turned off.*/}
                  <Pressable onPress = {() => isFavorited ? removeFavorites(location.name) : addFavorites(location)}>
                     <Ionicons name = {isFavorited ? 'heart' : 'heart-outline'} size = {26} color = '#01a598'/>
                  </Pressable>
               </View>
               <Text style = {styles.address}>{location?.address}</Text>
               <View style = {styles.ratingRow}>
                  <View style = {{flex: 1}}>
                     <Text style = {styles.ratingLabel}>Total Rating:
                        <Text style = {styles.ratingValue}>10/10</Text>
                     </Text>
                     <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                        <Text style = {styles.ratingLabel}>Given Rating: </Text>
                        <TextInput
                           style = {styles.ratingInput}
                           placeholder = '__'
                           placeholderTextColor = '#aaa'
                           keyboardType = 'numeric'
                           maxLength = {2}
                           value = {userRating}
                           onChangeText = {setUserRating}
                           onEndEditing = {() => {
                              const trimmed = userRating.trim();
                              if (trimmed === '') {
                                 // Blank = remove rating
                                 submitRating(location?.name, null);
                              } else {
                                 const val = parseInt(trimmed, 10);
                                 if (!isNaN(val) && val >= 0 && val <= 10) {
                                    submitRating(location?.name, val);
                                 } else {
                                    // Invalid — snap back to saved value
                                    const prev = getUserRating(location?.name);
                                    setUserRating(prev !== null ? String(prev) : '');
                                 }
                              }
                           }}
                        />
                        <Text style = {styles.ratingLabel}>/10</Text>
                        {getUserRating(location?.name) !== null && (
                           <Text style = {styles.ratingSubmittedText}> ✓ </Text>
                        )}
                     </View>
                  </View>

                  {/*PROGRESS CIRCLES*/}
                  <View style = {{flexDirection: 'row', gap: 8}}>
                     <ProgCircle percentage = {getSatisfaction(location?.name)} label = 'Satisfaction' color = '#01a598'/>
                     <ProgCircle percentage = {difficultyPercent} label = 'Difficulty' color = '#FFD700'/>
                  </View>
               </View>
            </View>

            {/*CHARACTERISTIC TABS*/}
            <View style = {styles.section}>
               <Text style = {styles.sectionTitle}>Characteristics</Text>
               {/*Wrap means to automatically keep the character tags within the sreen*/}
               <View style = {styles.tagsWrap}>
                  {/*.map() iterates through one of the arrays of the tags and the tag paramter
                  is the current array value and 'i' is the iteration number it's on so like in fewSampleTags
                  you may see tag as Old Wagon Ruts and 'i' as 0*/}
                  {(showAllTags ? allSampleTags : fewSampleTags).map((tag, i) => (
                     <View key = {i} style = {styles.tag}><Text style = {styles.tagText}>{tag}</Text></View>
                  ))}
               </View>
               <Pressable onPress = {() => setShowAllTags(!showAllTags)}>
                  <Text style = {styles.moreText}>{showAllTags ? 'less ▲' : 'more... ▼'}</Text>
               </Pressable>
            </View>

            {/*MAP*/}
            <View style = {styles.section}>
               <Text style = {styles.sectionTitle}>Map</Text>
               {location?.latitude && location?.longitude ? (
                  <MapView
                     style = {styles.map}
                     initialRegion = {{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        //Both values below show the distance in degree of the
                        //zoom. 0.01 might show a few blocks and 1.0 would show
                        //an entire city.
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                     }}
                     scrollEnabled = {true}
                     zoomEnabled = {true}
                  >
                     <Marker
                        coordinate = {{
                           latitude: location.latitude,
                           longitude: location.longitude,
                        }}
                        title = {location.name}
                        description = {location.address}
                        pinColor = '#01a598'
                     />
                  </MapView>
               ) : (
                  <View style = {styles.mapBox}>
                     <Ionicons name = 'map-outline' size = {48} color = '#ccc'/>
                     <Text style = {{color: '#ccc', marginTop: 8}}>No coordinates available</Text>
                  </View>
               )}
            </View>

            {/*WEATHER*/}
            <View style = {styles.section}>
               <Text style = {styles.sectionTitle}>Weather</Text>
               <View style = {styles.weatherCard}>
                  <Text style = {styles.weatherTitle}>7 Day Outlook</Text>
                  {/*weatherLoading is true while waiting for API response, when the data arrives it switches to false and shows the weatherRow*/}
                  {weatherLoading ? (
                     <Text style = {{color: '#fff', textAlign: 'center'}}>Loading...</Text>
                  ) : weatherData ? (
                     <View style = {styles.weatherRow}>
                        {/*weatherData.temperature_2m_max is the array of 7 high temperatures from the API, placed in like before but with real live values*/}
                        {/*.map is needed in react loop arrays to turn data into visuals */}
                        {weatherData.temperature_2m_max.map((hi, i) => (
                           //i comes from the above line and is used below to cycle through the keys (days of the week) from 0 to 6 for the seven highs of the week
                           <View key = {i} style = {styles.weatherDays}>
                              <Text style = {styles.weatherDayLabel}>{weatherDays[i]}</Text>
                              <Ionicons name = {getWeatherIcon(weatherData.weathercode[i])} size = {18} color = '#fff'/>
                              <Text style = {styles.weatherHighs}>{Math.round(hi)}°</Text>
                              {/*The loop was only for the highs so low need to have the seven values for the lows in the array put in the long way*/}
                              <Text style = {styles.weatherLows}>{Math.round(weatherData.temperature_2m_min[i])}°</Text>
                           </View>
                        ))}
                     </View>
                  ) : (
                     <Text style = {{color: '#fff', textAlign: 'center'}}>Weather unavailable</Text>
                  )}
               </View>
            </View>

            {/*INFORMATIONAL BACKGROUND*/}
            <View style = {styles.section}>
               <Text style = {styles.sectionTitle}>Informational Background</Text>
               <Text style = {styles.subHeading}>Geography</Text>
               <Text style = {styles.bodyText}>{location?.description_geography}</Text>
               <Text style = {styles.subHeading}>Flora & Fauna</Text>
               <Text style = {styles.bodyText}>{location?.description_nature}</Text>
               <Text style = {styles.subHeading}>Culture & History</Text>
               <Text style = {styles.bodyText}>{location?.description_culture}</Text>
            </View>

            {/*COMMUNITY PICTURES*/}
            <View style = {styles.section}>
               <Text style = {styles.sectionTitle}>Community Pictures</Text>
               <Pressable style = {styles.addPhotoBox} onPress = {() => setModalVisible(true)}>
                  <Ionicons name = 'add' size = {40} color = '#aaa'/>
               </Pressable>
               {/*post is the name given in the parameter that is a replacement word for sampleCommunityPosts*/}
               {(communityPosts[location?.name] || []).map(posts => (
                  <View key = {posts.id} style = {styles.communityPost}>
                     {posts.uri ? (
                        <Image source = {{uri: posts.uri}} style = {styles.communityImage} resizeMode = 'cover'/>
                     ) : null}
                     <Text style = {styles.postMetaText}>Picture Posted By: {posts.user}</Text>
                     <Text style = {styles.postMetaText}>Picture Posted On: {posts.date}</Text>
                     <Text style = {styles.postMetaText}>Additional Information: {posts.info}</Text>
                  </View>
               ))}
            </View>
            
            {/*COMMENTS*/}
            <View style = {styles.section}>
               <Text style = {styles.sectionTitle}>Comments</Text>
               <View style = {styles.dropdownRow}>
                  <Text style = {styles.dropdownLabel}>Pick your comment template type</Text>
                  <Pressable style = {styles.dropdownBtn} onPress = {() => setDropdownOpen(!dropdownOpen)}>
                     <Text style = {styles.dropdownBtnText} numberOfLines = {1}>{selectedTemplate ? selectedTemplate.label : 'Select...'}</Text>
                     {/*Chevrons are the arrow shapes*/}
                     <Ionicons name = {dropdownOpen ? 'chevron-up' : 'chevron-down'} size = {14} color = '#555'/>
                  </Pressable>
               </View>
               {/*In this case && means only show the code on the right side of the left side is true*/}
               {dropdownOpen && (
                  <View style = {styles.dropdownList}>
                     {commentsTemplates.map((template, i) => (
                        //? is a safety measure that keeps the app from crashing if the value is null or undefined
                        //&& acts as used above only if the left side is true will it activate the right side
                        //=== in this case the exactly equal to sign checks which template is chosen
                        <Pressable key = {i} style = {[styles.dropdownOption, selectedTemplate?.label === template.label && styles.dropdownOptionSelected]}
                        //onPress usually does only one thing but with these semicolons seperatin gtwo things onPress as a result does two seperate things
                        onPress = {() => {setSelectedTemplate(template); setDropdownOpen(false);}}>
                           <Text style = {[styles.dropdownOptionText, selectedTemplate?.label === template.label && {color: '#01a598', fontWeight: 'bold'}]}>{template.label}</Text>
                        </Pressable>
                     ))}
                  </View>
               )}
               {/*Shows the text of the chosen template below the selection body*/}
               {selectedTemplate && (
                  <View style = {styles.templateBox}>
                     <Text style = {styles.templateText}>{selectedTemplate.text}</Text>
                  </View>
               )}
               <TextInput
                  style = {styles.commentInput}
                  placeholder = 'Write you comment here...'
                  placeholderTextColor = '#aaa'
                  //simply means you go to newlines (be default set to true)
                  multiline
                  value = {commentText}
                  onChangeText = {setCommentText}
               />
               <Pressable style = {styles.submitCommentBtn} onPress = {() => {
                  if (commentText.trim()) {
                     {/*... means prev (object) gets added to the array called setComments*/}
                     setComments(prev => [...prev, {
                        id: Date.now(),
                        user: 'You',
                        text: commentText,
                        date: new Date().toLocaleDateString(),
                     }]);
                     setCommentText('');
                     setSelectedTemplate(null);
                     }
                  }}>
                  <Text style = {styles.submitCommentText}>Post Comment</Text>
               </Pressable>

               {comments.map(comment => (
                  <View key = {comment.id} style = {styles.commentCard}>
                     <View style = {{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                        <View style = {styles.avatar}/>
                        <Text style = {styles.commentUser}>{comment.user}</Text>
                        <Text style = {{fontSize: 11, color: '#aaa', marginLeft: 8}}>{comment.date}</Text>
                     </View>
                     <Text style = {styles.bodyText}>{comment.text}</Text>
                  </View>
               ))}
            </View>
         </ScrollView>

         {/*ADD IMAGE POP UP (MODAL)*/}
         {/*Modal is a React Native component that apperas on top of everything*/}
         {/*onRequestClose allows for the Android back button to be used*/}
         <Modal visible = {modalVisible} transparent animationType = 'fade' onRequestClose = {() => setModalVisible(false)}>
            <Pressable style = {styles.modalBackdrop} onPress = {() => setModalVisible(false)}>
               {/*The inner presable is the card so when pressing the funciton is sent to nothing so your don't back out by pressing the card*/}
               <Pressable style = {styles.modalCard} onPress = {() => {}}>
                  <Text style = {styles.sectionTitle}>Add Picture</Text>
                  <View style = {{flexDirection: 'row', gap: 15, marginBottom: 25}}>
                     <View style = {{flex: 1}}>
                        <Text style = {styles.fieldLabel}>Download A Picture Here</Text>
                        <Pressable style = {styles.uploadBox} onPress = {pickImage}>
                           {/*Remember: If true then the first option if false the second option*/}
                           {pickedImage ? (
                              <Image source = {{uri: pickedImage}} style = {{width: '100%', height: '100%', borderRadius: 10}}/>
                           ) : (
                              <Ionicons name = 'add' size = {36} color = '#aaa'/>
                           )}
                        </Pressable>
                     </View>
                     {/*The reason this is double bracket and other command like styles. are single set brackets
                     is that styles. is essentialy 'pre-packaged' and is a preset javascript command so you're just
                     calling it but in this case you have to create a style which requires a bracket for both an object
                     and a javascript starter*/}
                     <View style = {{flex: 1}}>
                        <Text style = {styles.fieldLabel}>Notes Or Other Information</Text>
                        <TextInput style = {styles.notesInput} multiline placeholder = 'text' placeholderTextColor = '#bbb' value = {notes} onChangeText = {setNotes}/>
                     </View>
                  </View>
                  <Pressable style = {styles.finishBtn} onPress = {() => {
                     if (pickedImage || notes.trim()) {
                        setCommunityPosts(prev => ({
                           ...prev,
                           [location.name]: [...(prev[location.name] || []), {
                              id: Date.now(),
                              user: userName,
                              info: notes,
                              date: new Date().toLocaleDateString(),
                              uri: pickedImage || '',
                           }],
                        }));
                     }
                     setNotes('');
                     setPickedImage(null);
                     setModalVisible(false);
                  }}>
                     <Text style = {styles.finishText}>Finish</Text>
                  </Pressable>
               </Pressable>
            </Pressable>
         </Modal>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1, //makes container fill entire screen
      backgroundColor: '#fff',
   },
   primaryBox: {
      width: '100%',
      height: 260,
   },
   primaryImage: {
      width: '100%',
      height: '100%',
   },
   backBtn: {
      position: 'absolute',//forces object to float on top of the screen
      top: 50,
      left: 16,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 20,//rounds corners
      padding: 7
   },
   floatingCard: {
      backgroundColor: '#fff',
      marginTop: -30,//pulls card upward into the above image (in this case)
      marginHorizontal: 16,
      borderRadius: 20,
      padding: 16,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8
   },
   titleRow: {
      flexDirection: 'row', //By default React Native stacks things vertically this will force the top banner to push the objects into a row
      alignItems: 'flex-start',//The cross axis position, horizontal(x) axis by deafult perfectly aligning the two objects between the top and bottom
      justifyContent: 'space-between'//The Main axis position, vertical(y) axis by default, space-between meaning making as much space between the two objects as possible
   },
   locationTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 8,
      color: '#222'
   },
   address: {
      fontSize: 12,
      color: '#888',
      marginTop: 3,
      marginBottom: 10
   },
   ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   ratingLabel:
   { fontSize: 13,
      color: '#444'
   },
   ratingValue: {
      fontWeight: 'bold',
      color: '#222'
   },
   ratingInput: {
      borderBottomWidth: 1,//gives an underline type of look to the object
      borderColor: '#ccc',
      width: 28,
      textAlign: 'center',//Decides if the text starts on the left, center, or right.
      fontSize: 13,
      color: '#333'
   },
   ratingSubmittedText: {
      marginLeft: 4,
      fontSize: 16,
      color: '#01a598',
      fontWeight: 'bold',
   },
   circleBase: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center'
   },
   svgContainer: {
      position: 'absolute'
   },
   circlePercent:{
      fontSize: 15,
      fontWeight: 'bold',
      color: '#333'
   },
   circleLabel: {
      fontSize: 9,
      color: '#999'
   },
   section: {
      paddingHorizontal: 16,
      marginTop: 22,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      textDecorationColor: '#01a598',
      marginBottom: 12,
      color: '#222',
   },
   subHeading: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#01a598',
      marginTop: 12,
      marginBottom: 4,
   },
   bodyText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 21
   },
   tagsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8//distancing between objects in a row or column
   },
   tag: {
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6
   },
   tagText: {
      fontSize: 12,
      color: '#444'
   },
   moreText: { 
      fontSize: 13,
      color: '#01a598',
      fontWeight: '600',
      marginTop: 10
   },
   mapBox: {
      height: 200,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center'
   },
   map: {
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
   },
   weatherCard: {
      backgroundColor: '#01a598',
      borderRadius: 12,
      padding: 14
   },
   weatherTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
      letterSpacing: 1,
      textAlign: 'center',
      marginBottom: 12
   },
   weatherRow: {
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   weatherDays: {
      alignItems: 'center',
      flex: 1
   },
   weatherDayLabel: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 10,
      marginBottom: 3
   },
   weatherHighs: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 13,
      marginTop: 3
   },
   weatherLows: {
      color: 'rgba(255,255,255,0.65)',
      fontSize: 11
   },
   addPhotoBox: {
      height: 110,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderStyle: 'dashed',
      marginBottom: 12
   },
   communityPost: {
      marginBottom: 12
   },
   communityImage: {
      width: '100%',
      height: 180,
      borderRadius: 10
   },
   postMetaText: {
      fontSize: 12,
      color: '#666',
      marginTop: 2
   },
   dropdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      gap: 10
   },
   dropdownLabel: {
      fontSize: 13,
      color: '#555',
      flex: 1
   },
   dropdownBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 10
   },
   dropdownBtnText: {
      fontSize: 12,
      color: '#444',
      maxWidth: 90
   },
   dropdownList: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      marginBottom: 10,
      overflow: 'hidden',
      elevation: 4
   },
   dropdownOption: {
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0'
   },
   dropdownOptionSelected: {
      backgroundColor: '#e6f7f6'
   },
   dropdownOptionText: {
      fontSize: 13,
      color: '#333'
   },
   templateBox: {
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
      borderLeftWidth: 3,
      borderLeftColor: '#01a598'
   },
   templateText: {
      fontSize: 13,
      color: '#555',
      lineHeight: 21
   },
   commentCard: {
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      marginTop: 4
   },
   avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#01a598',
      marginRight: 10
   },
   commentUser: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#333'
   },
   modalBackdrop:{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end'
   },
   modalCard: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 25,
      paddingBottom: 40
   },
   fieldLabel: {
      fontSize: 12,
      color: '#555',
      marginBottom: 8
   },
   uploadBox: {
      height: 100,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderStyle: 'dashed'
   },
   notesInput: {
      height: 100,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      fontSize: 13,
      color: '#333',
      textAlignVertical: 'top'
   },
   finishBtn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      paddingVertical: 14,
      alignItems: 'center'
   },
   finishText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold'
   },
   commentInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 10,
      fontSize: 13,
      color: '#333',
      minHeight: 80,
      textAlignVertical: 'top',
      marginBottom: 16,
      backgroundColor: '#f9f9f9'
   },
   submitCommentBtn: {
      backgroundColor: '#01a598',
      borderRadius: 20,
      paddingVertical: 10,
      alignItems: 'center',
      marginBottom: 16,
   },
   submitCommentText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
   },
});

/*
FILE SUMMARY
This file shows an exmaple location screen fro Chimney Rock since as of now data hasn't properly implemented.
The file starts with using Svg to create a circle with some basic math. The circle is saved to be used as a
component later. There are also other prefilled functions, components, and variables that are later used.
In this file there are seven main components used is making this work and looks how it is: modal, rating
input, heart toggle, tag expansion, comment dropdown, selected template, and notes field. Other features
include the progress circle, chatacteristic tags, weather card, map placeholder, a potential placeholder
for the possible vitrual tour, and the add photos part.
*/