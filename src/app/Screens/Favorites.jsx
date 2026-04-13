import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppContext} from '../Context/AppContext';

export const Favorites = ({navigation}) => {
   const {favorites, removeFavorites, communityPosts} = useContext(AppContext);
   const [searchText, setSearchText] = useState('');

   const filteredFavorites = favorites.filter(location =>
      location.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchText.toLowerCase())
   );

   return (
      <View style = {styles.container}>
         {/*SEARCH BAR*/}
         <View style = {styles.searchContainer}>
            <View style = {styles.searchBar}>
               <Ionicons name = 'search' size = {20} color = 'black' style = {{marginLeft: 12}}/>
               <TextInput
                  placeholder = 'Search favorites'
                  style = {styles.searchInput}
                  placeholderTextColor = '#444'
                  value = {searchText}
                  onChangeText = {setSearchText}
               />
            </View>
         </View>
         {favorites.length === 0 ? (
            <View style = {styles.emptyContainer}>
               <Ionicons name = 'heart-outline' size = {64} color = '#ccc'/>
               <Text style = {styles.emptyTitle}>No Favorites Yet</Text>
               <Text style = {styles.emptySubtitle}>Tap the heart on any location to save it here.</Text>
            </View>
         ) : filteredFavorites.length === 0 ? (
            <View style = {styles.emptyContainer}>
               <Ionicons name = 'search-outline' size = {64} color = '#ccc'/>
               <Text style = {styles.emptyTitle}>No Results</Text>
               <Text style = {styles.emptySubtitle}>No favorites match your search.</Text>
            </View>
         ) : (
            <ScrollView showsVerticalScrollIndicator = {false} contentContainerStyle = {{paddingBottom: 100}}>
               <Text style = {styles.countText}>{filteredFavorites.length} saved location{filteredFavorites.length !== 1 ? 's' : ''}</Text>
               {filteredFavorites.map((location, i) => (
                  <Pressable
                     key = {i}
                     style = {styles.card}
                     onPress = {() => navigation.navigate('HomeTab', {screen: 'Locations', params: {location}})}
                  >
                     <Image
                        source = {
                           communityPosts[location?.name]?.[0]?.uri ?
                           {uri: communityPosts[location.name][0].uri} :
                           location?.image ?
                           {uri: location.image} :
                           require('../assets/images/placeholder.jpg')
                        }
                        style = {styles.cardImage}
                        resizeMode = 'cover'
                     />
                     <View style = {styles.cardInfo}>
                        <View style = {{flex: 1}}>
                           <Text style = {styles.locationName}>{location.name}</Text>
                           <Text style = {styles.locationAddress}>{location.address}</Text>
                        </View>
                        {/*REMOVE FROM FAVORITES*/}
                        <Pressable
                           onPress = {() => removeFavorites(location.name)}
                           style = {styles.heartBtn}
                        >
                           <Ionicons name = 'heart' size = {26} color = '#01a598'/>
                        </Pressable>
                     </View>
                  </Pressable>
               ))}
            </ScrollView>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
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
   emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      gap: 12,
   },
   emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
   },
   emptySubtitle: {
      fontSize: 14,
      color: '#888',
      textAlign: 'center',
      lineHeight: 20,
   },
   countText: {
      fontSize: 14,
      color: '#888',
      marginLeft: 20,
      marginBottom: 10,
      marginTop: 4,
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
   heartBtn: {
      padding: 4,
   },
});