import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppContext} from '../Context/AppContext';

export const Login = ({navigation}) => {
   const {login, loginAsGuest} = useContext(AppContext);
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [email, setEmail] = useState('');

   const handleLogin = async() => {
      if (!username.trim()) {
         setError('Please enter a username.');
         return;
      }
      if (!email.trim() || !email.includes('@')) {
         setError('Please enter a valid email.')
         return;
      }
      if (!password.trim()) {
         setError('Please enter a password.');
         return;
      }
      setError('');
      //If either fail will result in failure message (setError)
      const result = await login(email.trim(), password, username.trim());
      if (!result.success) {
         setError('Invalid email or password');
      }
   };

   return (
      //KeyboardAvoidingView pushes stuff up when the screen keyboard appears
      //behavior means how or by which method it should move the online keyboard out of the way
      <KeyboardAvoidingView style = {styles.container} behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}>
         {/*contentContainerStyle means the styles will be applied to the things that move with your scrolling*/}
         {/*keyboardShouldPersistTaps means that if handled (which it is) when clicking other buttons the keyboard will not close, but will if clicked in an open space*/}
         <ScrollView contentContainerStyle = {styles.scroll} showsVerticalScrollIndicator = {false} keyboardShouldPersistTaps = 'handled'>
            
            {/*LOGO & TITLE*/}
            <View style = {styles.logoSection}>
               <Image
                  source = {require('../assets/images/The-Nebraska-Guide-Logo-Resized-No-Background.png')}
                  style = {styles.logoImage}
                  resizeMode = 'contain'
               />
               <Text style = {styles.appName}>The Nebraska Guide</Text>
               <Text style = {styles.tagline}>find YOUR perfect spot in nature</Text>
            </View>

            {/*FORM CARD*/}
            <View style = {styles.card}>
               <Text style = {styles.cardTitle}>Welcome</Text>

               {/*ERROR MESSAGE*/}
               {error ? (
                  <View style = {styles.errorBox}>
                     <Ionicons name = 'alert-circle-outline' size = {16} color ='#c0392b'/>
                     <Text style = {styles.errorText}>{error}</Text>
                  </View>
               ) : null}

               {/*USERNAME*/}
               <Text style = {styles.label}>Username</Text>
               <View style = {styles.inputRow}>
                  <Ionicons name = {'person-outline'} size = {18} color = '#999' style = {styles.inputIcon}/>
                  <TextInput
                     style = {styles.input}
                     placeholder = 'Enter your username'
                     placeholderTextColor = '#bbb'
                     value = {username}
                     onChangeText = {setUsername}
                     autoCapitalize = 'none'
                     autoCorrect = {false}
                  />
               </View>

               {/*EMAIL*/}
               <Text style = {styles.label}>Email</Text>
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

               {/*PASSWORD*/}
               <Text style = {styles.label}>Password</Text>
               <View style = {styles.inputRow}>
                  <Ionicons name = 'lock-closed-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                  <TextInput
                     style = {styles.input}
                     placeholder = 'Enter your password'
                     placeholderTextColor = '#bbb'
                     value = {password}
                     onChangeText = {setPassword}
                     secureTextEntry = {!showPassword}
                     autoCapitalize = 'none'
                     autoCorrect = {false}
                  />

                  {/*TOGGLE SHOW/HIDE PASSWORD*/}
                  <Pressable onPress = {() => setShowPassword(!showPassword)} style = {styles.eyeBtn}>
                     <Ionicons name = {showPassword ? 'eye-off-outline' : 'eye-outline'} size = {18} color = '#999'/>
                  </Pressable>
               </View>

               {/*FORGOT PASSWORD*/}
               <Pressable onPress = {() => navigation.navigate('Forgot_Password')} style = {styles.forgotRow}>
                  <Text style = {styles.forgotText}>Forgot password</Text>
               </Pressable>

               {/*LOGIN BUTTON*/}
               <Pressable style = {styles.loginBtn} onPress = {handleLogin}>
                  <Text style = {styles.loginBtnText}>Log In</Text>
               </Pressable>

               {/*OR TEXT*/}
               <View style = {styles.dividerRow}>
                  <View style = {styles.dividerLine}/>
                  <Text style = {styles.dividerText}>or</Text>
                  <View style = {styles.dividerLine}/>
               </View>

               {/*GOOGLE BUTTON*/}
               <Pressable
                  style = {styles.googleBtn}
                  onPress = {() => alert('Google login coming soon')}
               >
                  {/*G LOGO*/}
                  <Image
                     source = {{uri: 'https://www.androidauthority.com/wp-content/uploads/2025/05/google-g-rainbow-gradient-play-store.jpg'}}
                     style = {{width: 35, height: 35}}
                     resizeMode = 'contain'
                  />
                  <Text style = {styles.googleBtnText}>Continue with Google</Text>
               </Pressable>

               {/*REGISTER LINK*/}
               <View style = {styles.registerRow}>
                  <Text style = {styles.registerPrompt}>Don't have an account?</Text>
                  <Pressable onPress = {() => navigation.navigate('Register')}>
                     <Text style = {styles.registerLink}>  Sign Up</Text>
                  </Pressable>
               </View>
            </View>

            {/*GUEST OPTION*/}
            <Pressable onPress = {loginAsGuest} style = {styles.guestBtn}>
               <Text style = {styles.guestText}>Continue as Guest</Text>
            </Pressable>
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
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
   },
   logoSection: {
      alignItems: 'center',
      marginBottom: 32,
   },
   /*
   logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#01a598',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      elevation: 4,
      shadowColor: '#01a598',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
   },
   logoLetter: {
      fontSize: 44,
      fontWeight: 'bold',
      color: '#fff',
   },
   */
  logoImage: {
   width: 150,
   height: 150,
   marginBottom: 12,
  },
   appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#01a598',
      letterSpacing: 0.5,
   },
   tagline: {
      fontSize: 13,
      color: '#888',
      marginTop: 4,
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
   cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 20,
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
   forgotRow: {
      alignItems: 'flex-end',
      marginTop: -8,
      marginBottom: 20,
   },
   forgotText: {
      fontSize: 13,
      color: '#01a598',
      fontWeight: '600',
   },
   loginBtn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
   },
   loginBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
   },
   dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
      gap: 10,
   },
   dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#eee',
   },
   dividerText: {
      fontSize: 13,
      color: '#aaa',
   },
   googleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: '#e0e0e0',
      borderRadius: 30,
      height: 52,
      backgroundColor: '#fff',
      gap: 12,
   },
   googleIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#4285F4',
      justifyContent: 'center',
      alignItems: 'center',
   },
   googleIconText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
   },
   googleBtnText: {
      fontSize: 17,
      color: '#333',
      fontWeight: '600',
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
   guestBtn: {
      alignItems: 'center',
      marginTop: 20,
      padding: 12,
   },
   guestText: {
      fontSize: 14,
      color: '#888',
      textDecorationLine: 'underline',
   },
});