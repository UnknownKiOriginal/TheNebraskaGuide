import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppContext} from '../Context/AppContext';

export const Profile = ({navigation}) => {
   const {userName, userEmail, isLoggedIn, logout, changePassword} = useContext(AppContext);
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showCurrent, setShowCurrent] = useState(false);
   const [showNew, setShowNew] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const isGuest = !isLoggedIn;

   const handleChangePassword = () => {
      setError('');
      setSuccess('');
      if (!currentPassword.trim()) {
         setError('Please enter your current password.');
         return;
      }
      if (!newPassword.trim() || newPassword.length < 6) {
         setError('New password must be at least 6 characters.');
         return;
      }
      if (newPassword !== confirmPassword) {
         setError('New passwords do not match.');
         return;
      }
      const result = changePassword(currentPassword, newPassword);
      if (!result.success) {
         setError(result.error || 'Failed to update password.');
      } else {
         setSuccess('Password updated successfully.');
         setCurrentPassword('');
         setNewPassword('');
         setConfirmPassword('');
      }
   };

   const handleLogout = () => {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
         {text: 'Cancel', style: 'cancel'},
         {text: 'Log Out', style: 'destructive', onPress: logout},
      ]);
   };

   return (
      <ScrollView style = {styles.container} contentContainerStyle = {{paddingBottom: 100}}>

         {/*PROFILE HEADER*/}
         <View style = {styles.hero}>
            <View style = {styles.avatarCircle}>
               <Ionicons name = 'person' size = {48} color = '#fff'/>
            </View>
            <Text style = {styles.heroName}>{userName}</Text>
            {!isGuest && <Text style = {styles.heroEmail}>{userEmail}</Text>}
            {isGuest && <Text style = {styles.guestBadge}>Guest Account</Text>}
         </View>

         {/*STATS*/}
         <View style = {styles.statsRow}>
            <Pressable style = {styles.statBox} onPress = {() => navigation.navigate('Favorites')}>
               <Ionicons name = 'heart' size = {22} color = '#01a598'/>
               <Text style = {styles.statLabel}>View Favorites</Text>
            </Pressable>
         </View>

         {/*CHANGE PASSWORD*/}
         {!isGuest && (
            <>
               <Text style = {styles.sectionHeader}>Change Password</Text>
               <View style = {styles.card}>
                  {error ? (
                     <View style = {styles.errorBox}>
                        <Ionicons name = 'alert-circle-outline' size = {16} color = '#c0392b'/>
                        <Text style = {styles.errorText}>{error}</Text>
                     </View>
                  ) : null}
                  {success ? (
                     <View style = {styles.successBox}>
                        <Ionicons name = 'checkmark-circle-outline' size = {16} color = '#01a598'/>
                        <Text style = {styles.successText}>{success}</Text>
                     </View>
                  ) : null}

                  {/*CURRENT PASSWORD*/}
                  <Text style = {styles.label}>Current Password</Text>
                  <View style = {styles.inputRow}>
                     <Ionicons name = 'lock-closed-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                     <TextInput
                        style = {styles.input}
                        placeholder = 'Enter current password'
                        placeholderTextColor = '#bbb'
                        value = {currentPassword}
                        onChangeText = {setCurrentPassword}
                        secureTextEntry = {!showCurrent}
                        autoCapitalize = 'none'
                        autoCorrect = {false}
                     />
                     <Pressable onPress = {() => setShowCurrent(!showCurrent)} style = {styles.eyeBtn}>
                        <Ionicons name = {showCurrent ? 'eye-off-outline' : 'eye-outline'} size = {18} color = '#999'/>
                     </Pressable>
                  </View>

                  {/*NEW PASSWORD*/}
                  <Text style = {styles.label}>New Password</Text>
                  <View style = {styles.inputRow}>
                     <Ionicons name = 'lock-open-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                     <TextInput
                        style = {styles.input}
                        placeholder = 'Enter new password'
                        placeholderTextColor = '#bbb'
                        value = {newPassword}
                        onChangeText = {setNewPassword}
                        secureTextEntry = {!showNew}
                        autoCapitalize = 'none'
                        autoCorrect = {false}
                     />
                     <Pressable onPress = {() => setShowNew(!showNew)} style = {styles.eyeBtn}>
                        <Ionicons name = {showNew ? 'eye-off-outline' : 'eye-outline'} size = {18} color = '#999'/>
                     </Pressable>
                  </View>

                  {/*CONFIRM NEW PASSWORD*/}
                  <Text style = {styles.label}>Confirm New Password</Text>
                  <View style = {styles.inputRow}>
                     <Ionicons name = 'lock-open-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                     <TextInput
                        style = {styles.input}
                        placeholder = 'Re-enter new password'
                        placeholderTextColor = '#bbb'
                        value = {confirmPassword}
                        onChangeText = {setConfirmPassword}
                        secureTextEntry = {!showConfirm}
                        autoCapitalize = 'none'
                        autoCorrect = {false}
                     />
                     <Pressable onPress = {() => setShowConfirm(!showConfirm)} style = {styles.eyeBtn}>
                        <Ionicons name = {showConfirm ? 'eye-off-outline' : 'eye-outline'} size = {18} color = '#999'/>
                     </Pressable>
                  </View>

                  <Pressable style = {styles.btn} onPress = {handleChangePassword}>
                     <Text style = {styles.btnText}>Update Password</Text>
                  </Pressable>
                  <Pressable onPress = {() => navigation.navigate('Forgot_Password')} style = {styles.forgotRow}>
                     <Text style = {styles.forgotText}>Forgot your password? Reset it.</Text>
                  </Pressable>
               </View>
            </>
         )}

         {/*ACCOUNT ACTIONS*/}
         <Text style = {styles.sectionHeader}>Account</Text>
         <View style = {styles.card}>
            {isGuest && (
               <>
                  <Pressable style = {styles.row} onPress = {() => navigation.navigate('Register')}>
                     <Ionicons name = 'person-add-outline' size = {22} color = '#01a598'/>
                     <Text style = {styles.rowLabel}>Create Account</Text>
                     <Ionicons name = 'chevron-forward' size = {16} color = '#ccc'/>
                  </Pressable>
                  <View style = {styles.divider}/>
                  <Pressable style = {styles.row} onPress = {() => navigation.navigate('Login')}>
                     <Ionicons name = 'log-in-outline' size = {22} color = '#01a598'/>
                     <Text style = {styles.rowLabel}>Log In</Text>
                     <Ionicons name = 'chevron-forward' size = {16} color = '#ccc'/>
                  </Pressable>
                  <View style = {styles.divider}/>
               </>
            )}
            <Pressable style = {styles.row} onPress = {handleLogout}>
               <Ionicons name = 'log-out-outline' size = {22} color = '#c0392b'/>
               <Text style = {[styles.rowLabel, {color: '#c0392b'}]}>Log Out</Text>
            </Pressable>
         </View>
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
      backgroundColor: '#fff',
      paddingVertical: 32,
      marginBottom: 8,
   },
   avatarCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: '#01a598',
      justifyContent: 'center',
      marginBottom: 12,
      elevation: 4,
      shadowColor: '#01a598',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
   },
   heroName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#222',
   },
   heroEmail: {
      fontSize: 14,
      color: '#888',
      marginTop: 4,
   },
   guestBadge: {
      fontSize: 13,
      color: '#fff',
      backgroundColor: '#aaa',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 3,
      marginTop: 8,
   },
   statsRow: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginHorizontal: 16,
      borderRadius: 14,
      marginBottom: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 4,
   },
   statBox: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 16,
      gap: 4,
   },
   statNumber: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#01a598',
   },
   statLabel: {
      fontSize: 13,
      color: '#888',
   },
   statDivider: {
      width: 1,
      backgroundColor: '#f0f0f0',
      marginVertical: 12,
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
   card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      marginHorizontal: 16,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 4,
   },
   errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fdecea',
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      gap: 8,
   },
   errorText: {
      fontSize: 15,
      color: '#c0392b',
      flex: 1,
   },
   successBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e8f5e9',
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      gap: 8,
   },
   successText: {
      fontSize: 13,
      color: '#01a598',
      flex: 1,
   },
   label: {
      fontSize: 13,
      fontWeight: '600',
      color: '#444',
      marginBottom: 6,
   },
   inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#e0e0e0',
      borderRadius: 12,
      backgroundColor: '#fafafa',
      marginBottom: 16,
      paddingHorizontal: 12,
      height: 50,
   },
   inputIcon: {
      marginRight: 8,
   },
   input: {
      flex: 1, 
      fontSize: 15,
      color: '#222',
   },
   eyeBtn: {
      padding: 4,
   },
   btn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      marginTop: 4,
   },
   btnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
   },
   forgotRow: {
      alignItems: 'center',
      marginTop: 14,
   },
   forgotText: {
      fontSize: 13,
      color: '#01a598',
      textDecorationLine: 'underline',
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 12,
   },
   rowLabel: {
      flex: 1,
      fontSize: 15,
      color: '#222',
   },
   divider: {
      height: 1,
      backgroundColor: '#f0f0f0',
   },
});