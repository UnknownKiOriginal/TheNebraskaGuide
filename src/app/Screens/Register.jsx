import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useContext} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import { AppContext } from '../Context/AppContext';

export const Register = ({navigation}) => {
   const {register} = useContext(AppContext);
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [error, setError] = useState('');

   const handleRegister = async () => {
      if (!username.trim()) {
         setError('Please enter a username.');
         return;
      }
      if (username.length < 3) {
         setError('Username must be at least 3 characters long.');
         return;
      }
      if (!email.trim() || !email.includes('@')) {
         setError('Please enter a valid email address.');
         return;
      }
      if (!password.trim()) {
         setError('Please enter a password.');
         return;
      }
      if (password.length < 6) {
         setError('Password must be at least 6 characters long.');
         return;
      }
      if (password !== confirmPassword) {
         setError('Passwords do not match.');
         return;
      }
      setError('');
      const result = await register(email.trim(), password, username.trim());
      if (!result.success) {
         setError('Registration failed. Email may already be in use.');
      };
   };

   return (
      <KeyboardAvoidingView style = {styles.container} behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}>
         <ScrollView contentContainerStyle = {styles.scroll} showsVerticalScrollIndicator = {false} keyboardShouldPersistTaps = 'handled'>
            
            {/*BACK BUTTON*/}
            <Pressable onPress = {() => navigation.goBack()} style = {styles.backBtn}>
               <Ionicons name = 'arrow-back' size = {22} color = '#01a598'/>
               <Text style = {styles.backText}>Back to Login</Text>
            </Pressable>

            {/*HEADER*/}
            <View style = {styles.iconSection}>
               <View style = {styles.iconCircle}>
                  <Ionicons name = 'person-add-outline' size = {40} color = '#fff'/>
               </View>
               <Text style = {styles.title}>Create Account</Text>
               <Text style = {styles.subtitle}>Join The Nebraska Guide today.</Text>
            </View>

            {/*FORM CARD*/}
            <View style = {styles.card}>

               {/*ERRORS*/}
               {error ? (
                  <View style = {styles.errorBox}>
                     <Ionicons name = 'alert-circle-outline' size = {16} color = '#c0392b'/>
                     <Text style = {styles.errorText}>{error}</Text>
                  </View>
               ) : null}

               {/*USERNAME*/}
               <Text style = {styles.label}>Username</Text>
               <View style = {styles.inputRow}>
                  <Ionicons name = 'person-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                  <TextInput
                     style = {styles.input}
                     placeholder = 'Choose a username'
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
                     placeholder = 'Create a password'
                     placeholderTextColor = '#bbb'
                     value = {password}
                     onChangeText = {setPassword}
                     secureTextEntry = {!showPassword}
                     autoCapitalize = 'none'
                  />
                  <Pressable onPress = {() => setShowPassword(!showPassword)} style = {styles.eyeBtn}>
                     <Ionicons name = {showPassword ? 'eye-off-outline' : 'eye-outline'} size = {18} color = '#999'/>
                  </Pressable>
               </View>

               {/*CONFIRM PASSWORD*/}
               <Text style = {styles.label}>Confirm Password</Text>
               <View style = {styles.inputRow}>
                  <Ionicons name = 'lock-closed-outline' size = {18} color = '#999' style = {styles.inputIcon}/>
                  <TextInput
                     style = {styles.input}
                     placeholder = 'Re-enter your password'
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

               {/*REGISTER BUTTON*/}
               <Pressable style = {styles.registerBtn} onPress = {handleRegister}>
                  <Text style = {styles.registerBtnText}>Create Account</Text>
               </Pressable>

               {/*LOGIN LINK*/}
               <View style = {styles.loginRow}>
                  <Text style = {styles.loginPrompt}>Already have an account?  </Text>
                  <Pressable onPress = {() => navigation.navigate('Login')}>
                     <Text style = {styles.loginLink}>Log In</Text>
                  </Pressable>
               </View>
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
   registerBtn: {
      backgroundColor: '#01a598',
      borderRadius: 30,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      marginTop: 4,
   },
   registerBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
   },
   loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
   },
   loginPrompt: {
      fontSize: 14,
      color: '#888',
   },
   loginLink: {
      fontSize: 14,
      color: '#01a598',
      fontWeight: 'bold',
   },
});