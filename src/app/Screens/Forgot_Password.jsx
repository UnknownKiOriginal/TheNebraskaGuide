import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';

export const Forgot_Password = ({navigation}) => {
   const [email, setEmail] = useState('');
   const [submitted, setSubmitted] = useState(false);
   const [error, setError] = useState('');

   const handleSubmit = () => {
      if (!email.trim()) {
         setError('Please enter your email address.');
         return;
      }
      if (!email.includes('@')) {
         setError('Please enter a valid email address.');
         return;
      }
      setError('');
      navigation.navigate('Reset_Password', {email: email.trim()});
   };

   return (
      <KeyboardAvoidingView style = {styles.container} behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}>
         <ScrollView contentContainerStyle = {styles.scroll} showsVerticalScrollIndicator = {false} keyboardShouldPersistTaps = 'handled'>
            
            {/*BACK BUTTON*/}
            <Pressable onPress = {() => navigation.goBack()} style = {styles.backBtn}>
               <Ionicons name = 'arrow-back' size = {22} color = '#01a598'/>
               <Text style = {styles.backText}>Back to Login</Text>
            </Pressable>

            {/*UNLOCK ICON*/}
            <View style = {styles.iconSection}>
               <View style = {styles.iconCircle}>
                  <Ionicons name = 'lock-open-outline' size = {40} color = '#fff'/>
               </View>
               <Text style = {styles.title}>Forgot Password?</Text>
               <Text style = {styles.subtitle}>Enter your email and we'll send you a reset link.</Text>
            </View>

            {/*CARD*/}
            <View style = {styles.card}>
               {submitted ? (
                  <View style = {styles.successBox}>
                     <Ionicons name = 'checkmark-circle-outline' size = {40} color = '#01a598'/>
                     <Text style = {styles.successTitle}>Email Sent!</Text>
                     <Text style = {styles.successText}>Check your inbox for a password reset link. It may take a few minutes to arrive.</Text>
                     {/*
                     <Pressable style = {styles.continueBtn} onPress = {() => navigation.navigate('Reset_Password')}>
                        <Text style = {styles.continueBtnText}>Enter New Password</Text>
                     </Pressable>
                     */}
                     <Pressable onPress = {() => navigation.navigate('Login')} style = {styles.backToLogin}>
                        <Text style = {styles.backToLoginText}>Back to Login</Text>
                     </Pressable>
                  </View>
               ) : (
                  //<> are fragment shorthands and are required when needing to return multiple things without wrapping
                  //them in <View> essentially they're an invisible wrapper that doesn't add anything to the screen
                  <>
                  {error ? (
                     <View style = {styles.errorBox}>
                        <Ionicons name = 'alert-circle-outline' size = {16} color = '#c0392b'/>
                        <Text style = {styles.errorText}>{error}</Text>
                     </View>
                  ) : null}

                  <Text style = {styles.label}>Email Address</Text>
                  <View style = {styles.inputRow}>
                     <Ionicons name = 'mail-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                     <TextInput
                        style = {styles.input}
                        placeholder = 'Enter your email'
                        placeholderTextColor = '#bbb'
                        value = {email}
                        onChangeText = {setEmail}
                        autoCapitalize = 'none'
                        keyboardType = 'email-address'
                        autoCorrect = {false}
                     />
                  </View>

                  <Pressable style = {styles.submitBtn} onPress = {handleSubmit}>
                     <Text style = {styles.submitBtnText}>Send Reset Link</Text>
                  </Pressable>

                  <View style = {styles.registerRow}>
                     <Text style = {styles.registerPrompt}>Remember your password?  </Text>
                     <Pressable onPress = {() => navigation.navigate('Login')}>
                        <Text style = {styles.registerLink}>Log In</Text>
                     </Pressable>
                  </View>
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
      backgroundColor: '#f0f9f8',
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
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
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
   card: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
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
      marginBottom: 20,
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
   submitBtn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
   },
   submitBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
   },
   registerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
   },
   registerPrompt: {
      fontSize: 14,
      color: '#888',
   },
   registerLink: {
      fontSize: 14,
      color: '#01a598',
      fontWeight: 'bold',
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
   /*
   continueBtn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: 8,
   },
   continueBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
   },
   */
   backToLogin: {
      marginTop: 4,
   },
   backToLoginText: {
      fontSize: 14,
      color: '#888',
      textDecorationLine: 'underline',
   },
});