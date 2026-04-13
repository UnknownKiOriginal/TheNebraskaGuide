import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native'; //Keep tracks of what screen was last opened
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppContext} from '../Context/AppContext.jsx';

import {About_Us} from '../Screens/About_Us.jsx';
import {Favorites} from '../Screens/Favorites.jsx';
import {Home} from '../Screens/Home.jsx';
import {Locations} from '../Screens/Locations.jsx';
import {Login} from '../Screens/Login.jsx';
import {Profile} from '../Screens/Profile.jsx';
import {Register} from '../Screens/Register.jsx';
import {Settings} from '../Screens/Settings.jsx';
import {Forgot_Password} from '../Screens/Forgot_Password.jsx';
import {Reset_Password} from '../Screens/Reset_Password.jsx';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {

	return (
		<HomeStack.Navigator screenOptions = {{headerShown: false}}>
			<HomeStack.Screen name = 'HomeMain' component = {Home}/>
			<HomeStack.Screen name = 'Locations' component = {Locations}/>
		</HomeStack.Navigator>
	);
};

/*Destructuring: Every component recieves an object called props (short for properties)
which is just a box of information. Usually, we would need to called for props.logout instead
of {logout} for the same effect. This way we are simply saying instead of just using all of
props we write {logout} to just bring out 'logout' from properties adn nothing else.*/
const TopBanner = ({logout}) => {
	const insets = useSafeAreaInsets();//Calculates notch heights
	return (//Insets measure the pixels that cna't be placed because hte camera or bottom "pill" will cover up the object
		//Height: 65 + insets.top means the top banner box is 65px tall plus accomodating for the phone's own features like the clock
		<View style = {[styles.headerContainer, {height: 65 + insets.top, paddingTop: insets.top}]}>
			<Text style = {styles.headerTitle}>The Nebraska Guide</Text>
			<Pressable onPress = {logout} style = {styles.logoutBtn}>
				<Ionicons name = 'person-outline' size = {20} color = "black"/>
				<Text style = {styles.logoutText}>Logout</Text>
			</Pressable>
		</View>
	);
};

export const AppNavigator = () => {

	const {isLoggedIn, logout} = useContext(AppContext);//useContext searches for AppContext.jsx then looks for isLoggedIn

	return (
		<NavigationContainer>{/*Keeps tracks of the screen, knows when they're visible and their hostory too*/}
			{isLoggedIn ? (//If isLoggedIn is true it activates this first section		  
				<Tab.Navigator
					//Route is the identification of the screen
					screenOptions = {({route}) => ({//screenOptions moves from HTML to JavaScript
						header: () => <TopBanner logout = {logout}/>,
						tabBarShowLabel: false,
						tabBarStyle: {
							backgroundColor: '#01a598',
							height: 60,
							position: 'absolute',//On top of everything (may need to remove if looks weird on real device)
							bottom: 0,
							elevation: 0,//Removes shadow on android
						},
						tabBarIcon: ({focused}) => {//focused is a boolean, true when on a screen and false when not on a screen
							let iconName;//Left blank so can be changed later
					  
							//=== means exactly equal to (compared to == which means it can accept a different type of varaible as long as the value is the same (0 == '0'))
							//In this situation (?) means 'if yes' and (:) means 'if no'
							//Ternary Operator format... condition ? result_if_true : result_if_false;
							/*In this case the ternary operator would equate to this...
							if (route.name === 'HomeTab') {
								if (focused === true) {
									iconName = 'home';
								} else {
									iconName = 'home-outline';
								}
							}*/
							if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
							if (route.name === 'Favorites') iconName = focused ? 'heart' : 'heart-outline';
							if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
							if (route.name === 'About_Us') iconName = focused ? 'information-circle' : 'information-circle-outline';
							if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

							return (
								<View style = {styles.iconContainer}>
									<Ionicons name = {iconName} size = {32} color = 'black'/>
								</View>
							);
						},
					})}>

					<Tab.Screen name = "HomeTab" component = {HomeStackScreen}/>
					<Tab.Screen name = "Favorites" component = {Favorites}/>
					<Tab.Screen name = "Settings" component = {Settings}/>
					<Tab.Screen name = "About_Us" component = {About_Us}/>
			   	<Tab.Screen name = "Profile" component = {Profile}/>
				</Tab.Navigator>//Tab.Navigator is like switching between two completely different screens
			) : (//If isLoggedIn is false it activates this second section
				<Stack.Navigator screenOptions = {{headerShown: false}}>
					<Stack.Screen name = "Login" component = {Login}/>
					<Stack.Screen name = "Register" component = {Register}/>
               <Stack.Screen name = "Reset_Password" component = {Reset_Password}/>
               <Stack.Screen name = "Forgot_Password" component = {Forgot_Password}/>
				</Stack.Navigator>//Stack.Navigator is like moving from settings to a specific setting and then being able to back out of it
			)}
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
   headerContainer: {
      backgroundColor: '#01a598',
      flexDirection: 'row',//By default React Native stacks things vertically this will force the top banner to push the title to the left and logout to the right
      justifyContent: 'space-between',//The Main axis position, vertical(y) axis by deafult in this case making as much space between the two text as possible
      paddingHorizontal: 20,//20px between the text and the edge of the screen
      alignItems: 'center',//The cross axis position, horizontal(x) axis by deafult perfectly aligning the two text between the top and bottom of the banner
      overflow: 'hidden',//If any extra parts goes out of the boundaries of the phone it gets cut off
   },
   iconContainer: {
      position: 'absolute',//Top layer of everything else
      top: 5,//Moves icons 5px from top of the bar
      alignItems: 'center',
      width: '100%',//Takes full length of bottom banner for icons
   },
   headerTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
   },
   logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: 5,
      borderRadius: 5,
   },
   logoutText: {
      color: 'black',
      marginLeft: 5,
      fontSize: 12,
   },
});

/*
FILE SUMMARY
The AppNavigator file acts as the memory for where you are in your app meaning whether you press on one screen
like the favorites screen and then you press on the back button to allow yourself to go back to your previous
screen without errors. In Navigation three types of navigators are set up known as the Stack, Tab, and
HomeStack. Stack directs the screens like login, Homestack to locations screen, and Tab to all other main
screen you can find on the bottom tab bar. useContext is used to see if components like isLoggedIn is either
true or false so it cna refresh the screen if there is a change in its status. Besides the bottom tab bar
the top banner was also created in the AppNavigator.
*/