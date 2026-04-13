import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppContext} from '../Context/AppContext';

export const Reset_Password = ({navigation, route}) => {
   const {resetPassword} = useContext(AppContext);
   const email = route?.params?.email || '';
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showNew, setShowNew] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   const handleReset = () => {
      if (!newPassword.trim()) {
         setError('Please enter a new password.');
         return;
      }
      if (newPassword.length < 6) {
         setError('Password must be at least 6 characters long.');
         return;
      }
      if (newPassword !== confirmPassword) {
         setError('Passwords do not match.');
         return;
      }
      const result = resetPassword(email, newPassword);
      if (!result.success) {
         setError(result.error || 'No account found with that email.');
         return;
      }
      setError('');
      setSuccess(true);
   };

   return (
      <KeyboardAvoidingView style = {styles.container} behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}>
         <ScrollView contentContainerStyle = {styles.scroll} showsVerticalScrollIndicator = {false} keyboardShouldPersistTaps = 'handled'>

            {/*BACK BUTTON*/}
            <Pressable onPress = {() => navigation.goBack()} style = {styles.backBtn}>
               <Ionicons name = 'arrow-back' size = {22} color = '#01a598'/>
               <Text style = {styles.backText}>Back</Text>
            </Pressable>

            {/*CHECKMARK ICON*/}
            <View style = {styles.iconSection}>
               <View style = {styles.iconCircle}>
                  <Ionicons name = 'shield-checkmark-outline' size = {45} color = '#fff'/>
               </View>
               <Text style = {styles.title}>Reset Password</Text>
               <Text style = {styles.subtitle}>Choose a strong new password for your account.</Text>
            </View>

            {/*CARD*/}
            <View style = {styles.card}>
               {success ? (
                  <View style = {styles.successBox}>
                     <Ionicons name = 'checkmark-circle-outline' size = {40} color = '#01a598'/>
                     <Text style = {styles.successTitle}>Password reset!</Text>
                     <Text style = {styles.successText}>Your password has been updated successfully. You can now log in with your new password.</Text>
                     <Pressable style = {styles.loginBtn} onPress = {() => navigation.navigate('Login')}>
                        <Text style = {styles.loginBtnText}>Back to Login</Text>
                     </Pressable>
                  </View>
               ) : (
                  <>
                  {error ? (
                     <View style = {styles.errorBox}>
                        <Ionicons name = 'alert-circle-outline' size = {16} color = '#c0392b'/>
                        <Text style = {styles.errorText}>{error}</Text>
                     </View>
                  ) : null}

                  <Text style = {styles.label}>New Password</Text>
                  <View style = {styles.inputRow}>
                     <Ionicons name = 'lock-closed-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                     <TextInput
                        style = {styles.input}
                        placeholder = 'Enter new password'
                        placeholderTextColor = '#bbb'
                        value = {newPassword}
                        onChangeText = {setNewPassword}
                        secureTextEntry = {!showNew}
                        autoCapitalize = 'none'
                     />
                     <Pressable onPress = {() => setShowNew(!showNew)} style = {styles.eyeBtn}>
                        <Ionicons name = {showNew ? 'eye-off-outline' : 'eye-outline'} size = {18} color = '#999'/>
                     </Pressable>
                  </View>

                  <Text style = {styles.label}>Confirm Password</Text>
                  <View style = {styles.inputRow}>
                     <Ionicons name = 'lock-closed-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
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
                  <Pressable style = {styles.loginBtn} onPress = {handleReset}>
                     <Text style = {styles.loginBtnText}>Reset Password</Text>
                  </Pressable>
                  </>
               )}
            </View>
         </ScrollView>
      </KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f0f9f8'
   },
   scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 40,
   },
   backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 32,
   },
   backText: {
      fontSize: 14,
      color: '#01a598',
      fontWeight: '600',
   },
   iconSection: {
      alignItems: 'center',
      marginBottom: 32,
   },
   card: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 12,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 14,
      color: '#888',
      textAlign: 'center',
      lineHeight: 20,
   },
   iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#01a598',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      elevation: 4,
      shadowColor: '#01a598',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 12,
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
      fontSize: 13,
      color: '#c0392b',
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
   loginBtn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      width: '100%',
      paddingHorizontal: 16,
   },
   loginBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
   },
   successBox: {
      alignItems: 'center',
      paddingVertical: 16,
      gap: 12,
   },
   successTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#222',
   },
   successText: {
      fontSize: 14,
      color: '#888',
      textAlign: 'center',
      lineHeight: 22,
   },
})