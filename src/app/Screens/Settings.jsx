import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {AppContext} from '../Context/AppContext';

export const Settings = () => {
   const {userName, logout} = useContext(AppContext);
   const [darkMode, setDarkMode] = useState(false);
   const [notifications, setNotifications] = useState(true);
   const [units, setUnits] = useState('imperial');
   const [height, setHeight] = useState('');
   const [weight, setWeight] = useState('');

   return (
      <ScrollView style = {styles.container} contentContainerStyle = {{paddingBottom: 100}}>

         {/*ACCOUNT SECTION*/}
         <Text style = {styles.sectionHeader}>Account</Text>
         <View style = {styles.card}>
            <View style = {styles.row}>
               <Ionicons name = 'person-circle-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Username</Text>
               <Text style = {styles.rowValue}>{userName}</Text>
            </View>
            <View style = {styles.divider}/>
            <Pressable style = {styles.row} onPress = {logout}>
               <Ionicons name = 'log-out-outline' size = {22} color = '#c0392b'/>
               <Text style = {[styles.rowLabel, {color: '#c0392b'}]}>Log Out</Text>
            </Pressable>
         </View>

         {/*PREFERENCES SECTION*/}
         <Text style = {styles.sectionHeader}>Preferences</Text>
         <View style = {styles.card}>
            <View style = {styles.row}>
               <Ionicons name = 'moon-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Dark Mode</Text>
               <Switch
                  value = {darkMode}
                  onValueChange = {setDarkMode}
                  /*Track is the pill color of the slide icon, not the circle part (thumb) above the pill*/
                  trackColor = {{false: '#ddd', true: '#01a598'}}
                  thumbColor = '#fff'
               />
            </View>
            <View style = {styles.divider}/>
            <View style = {styles.row}>
               <Ionicons name = 'notifications-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Notifications</Text>
               <Switch
                  value = {notifications}
                  onValueChange = {setNotifications}
                  trackColor = {{false: '#ddd', true: '#01a598'}}
                  thumbColor = '#fff'
               />
            </View>
            <View style = {styles.divider}/>
            <View style = {styles.row}>
               <Ionicons name = 'speedometer-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Units</Text>
               <View style = {styles.unitToggle}>
                  <Pressable
                     style = {[styles.unitBtn, units === 'imperial' && styles.unitBtnActive]}
                     onPress = {() => setUnits('imperial')}
                  >
                     <Text style = {[styles.unitBtnText, units === 'imperial' && styles.unitBtnTextActive]}>Imperial</Text>
                  </Pressable>
                  <Pressable
                     style = {[styles.unitBtn, units === 'metric' && styles.unitBtnActive]}
                     onPress = {() => setUnits('metric')}
                  >
                     <Text style = {[styles.unitBtnText, units === 'metric' && styles.unitBtnTextActive]}>Metric</Text>
                  </Pressable>
               </View>
            </View>
         </View>

         {/*DIFFICULTY GAUGE SECTION*/}
         <Text style = {styles.sectionHeader}>Difficulty Gauge</Text>
         <Text style = {styles.sectionSubtitle}>Height</Text>
         <View style = {styles.card}>
            <View style = {styles.row}>
               <Ionicons name = 'body-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Height</Text>
               <TextInput
                  style = {styles.inlineInput}
                  placeholder = {units === 'imperial' ? 'e.g. 5\'11"' : 'e.g. 180 cm'}
                  placeholderTextColor = '#bbb'
                  value = {height}
                  onChangeText = {setHeight}
               />
            </View>
            <View style = {styles.divider}/>
            <View style = {styles.row}>
               <Ionicons name = 'barbell-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Weight</Text>
               <TextInput
                  style = {styles.inlineInput}
                  placeholder = {units === 'imperial' ? 'e.g. 160 lbs' : 'e.g. 75 kg'}
                  placeholderTextColor = '#bbb'
                  value = {weight}
                  onChangeText = {setWeight}
                  keyboardType = 'numeric'
               />
            </View>
         </View>

         {/*APP INFO SECTION*/}
         <Text style = {styles.sectionHeader}>App Info</Text>
         <View style = {styles.card}>
            <View style = {styles.row}>
               <Ionicons name = 'information-circle-outline' size = {22} color = '#01a598'/>
               <Text style = {styles.rowLabel}>Version</Text>
               <Text style = {styles.rowValue}>1.0.0</Text>
            </View>
            <View style = {styles.divider}/>
            <View style = {styles.row}>
               <Ionicons name = 'shield-checkmark-outline' size = {22} color = '#01a698'/>
               <Text style = {styles.rowLabel}>Privacy Policy</Text>
               <Ionicons name = 'chevron-forward' size = {16} color = '#ccc'/>
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
   },
   sectionHeader: {
      fontSize: 13,
      fontWeight: '700',
      color: '#888',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginTop: 24,
      marginBottom: 8,
      marginHorizontal: 20,
   },
   sectionSubtitle: {
      fontSize: 12,
      color: '#aaa',
      marginHorizontal: 20,
      marginTop: -4,
      marginBottom: 8,
   },
   card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      marginHorizontal: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 4,
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
   },
   rowLabel: {
      flex: 1,
      fontSize: 15,
      color: '#222',
   },
   rowValue: {
      fontSize: 14,
      color: '#888',
   },
   divider: {
      height: 1,
      backgroundColor: '#f0f0f0',
      marginHorizontal: 16,
   },
   unitToggle: {
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      overflow: 'hidden',
   },
   unitBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#fff',
   },
   unitBtnActive: {
      backgroundColor: '#01a598'
   },
   unitBtnText: {
      fontSize: 13,
      color: '#888',
   },
   unitBtnTextActive: {
      color: '#fff',
      fontWeight: '600',
   },
   inlineInput: {
      fontSize: 14,
      color: '#333',
      textAlign: 'right',
      minWidth: 100,
   },
})