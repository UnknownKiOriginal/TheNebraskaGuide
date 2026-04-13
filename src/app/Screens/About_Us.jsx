import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {Image, Linking, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

export const About_Us = () => {
   return (
      <ScrollView style = {styles.container} contentContainerStyle = {{paddingBottom: 100}}>

         {/*TOP IMAGE*/}
         <View style = {styles.hero}>
            <Image
               source = {require('../assets/images/The-Nebraska-Guide-Logo-Resized-No-Background.png')}
               style = {styles.logo}
               resizeMode = 'contain'
            />
            <Text style = {styles.appName}>The Nebraska Guide</Text>
            <Text style = {styles.tagline}>find YOUR perfect spot in nature</Text>
            <Text style = {styles.version}>Version 1.0.0</Text>
         </View>

         {/*ABOUT SECTION*/}
         <View style = {styles.card}>
            <Text style = {styles.cardTitle}>About This App</Text>
            <Text style = {styles.bodyText}>
               The Nebraska Guide is a nature discovery app built to help adventurers,
               photographers, hikers, and curious explorers find their perfect spot in
               Nebraska. With detailed location characteristics, real-time weather,
               historical background, and community photos, finding outdoor destination
               has  never been easier.
            </Text>
         </View>

         {/*DEVELOPER SECTION*/}
         <View style = {styles.card}>
            <Text style = {styles.cardTitle}>Developer</Text>
            <Text style = {styles.bodyText}>Built by Evan Bayer as a STEM Academy Capstone Project for the 2025-2026 school year.</Text>
            <Pressable
               style = {styles.linkedInBtn}
               onPress = {() => Linking.openURL('https://www.linkedin.com/in/evan-j-bayer/')}
            >
               <Ionicons name = 'logo-linkedin' size = {20} color = '#fff'/>
               <Text style = {styles.linkedInText}>Connect on LinkedIn</Text>
            </Pressable>
         </View>

         {/*TECH STACK*/}
         <View style = {styles.card}>
            <Text style = {styles.cardTitle}>Built With</Text>
            {[
               {icon: 'code-slash-outline', label: 'React Native & Expo'},
               {icon: 'cloud-outline', label: 'Firebase Authentication & Firestore'},
               {icon: 'map-outline', label: 'OpenStreetMap & Geoapify'},
               {icon: 'partly-sunny-outline', label: 'Open-Meteo Weather API'},
               {icon: 'leaf-outline', label: 'iNaturalist API'},
            ].map((item, i) => (
               <View key = {i} style = {styles.techRow}>
                  <Ionicons name = {item.icon} size = {19} color = '#01a598'/>
                  <Text style = {styles.techText}>{item.label}</Text>
               </View>
            ))}
         </View>

         {/*LEGAL*/}
         <View style = {styles.card}>
            <Text style = {styles.cardTitle}>Legal</Text>
            <Pressable
               style = {styles.legalRow}
               //onPress = {() => Linking.openURL()}
            >
               <Text style = {styles.legalLink}>Privacy Policy</Text>
               <Ionicons name = 'chevron-forward' size = {16} color = '#ccc'/>
            </Pressable>
            <View style = {styles.divider}/>
            <Text style = {styles.legalNote}>
               Location data sourced from OpenStreetMap contributations under 0Dbl license. Weather data provided by Open-Meteo. Nature observations from iNaturalist under CC licenses.
            </Text>
         </View>

         <Text style = {styles.footer}>Made in Nebraska</Text>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
   },
   hero: {
      alignItems: 'center',
      paddingVertical: 32,
      backgroundColor: '#fff',
      marginBottom: 8,
   },
   logo: {
      width: 100,
      height: 100,
      marginBottom: 12,
   },
   appName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#01a598',
   },
   tagline: {
      fontSize: 13,
      color: '#888',
      marginTop: 4,
   },
   version: {
      fontSize: 12,
      color: '#bbb',
      marginTop: 6,
   },
   card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 4,
   },
   cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 12,
   },
   bodyText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 22,
   },
   linkedInBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0077b5',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      gap: 8,
      marginTop: 16,
      alignSelf: 'flex-start',
   },
   linkedInText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
   },
   techRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
   },
   techText: {
      fontSize: 14,
      color: '#444',
   },
   legalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
   },
   legalLink: {
      fontSize: 14,
      color: '#01a598',
   },
   divider: {
      height: 1,
      backgroundColor: '#f0f0f0',
      marginVertical: 12,
   },
   legalNote: {
      fontSize: 12,
      color: '#aaa',
      lineHeight: 18,
   },
   footer: {
      textAlign: 'center',
      fontSize: 13,
      color: '#ccc',
      marginTop: 24,
      marginBottom: 16,
   },
});