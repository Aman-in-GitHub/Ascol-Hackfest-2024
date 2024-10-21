// import { View, TextInput, Pressable } from 'react-native';
// import React, { useState } from 'react';
// import { createStyleSheet, useStyles } from 'react-native-unistyles';
// import { Stack } from 'expo-router';
// import Toast from 'react-native-toast-message';
// import Text from '@/components/Text';
// import zustandStorage from '@/storage/storage';

// const Login = () => {
//   const { styles, theme } = useStyles(stylesheet);

//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');

//   function handleNameChange(value: string) {
//     setName(value);
//   }

//   function handlePasswordChange(value: string) {
//     setPassword(value);
//   }

//   async function handleSubmit() {
//     const username = name.trim();
//     const userPassword = password.trim();

//     if (username.length === 0 || userPassword.length === 0) {
//       Toast.show({
//         type: 'error',
//         text1: 'Insufficient data',
//         text2: 'Fill in all the fields'
//       });

//       return;
//     }

//     try {
//       console.log('HEHRH');
//       const response = await fetch('http://127.0.0.1:8080/api/login/', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           username: 'Aman',
//           password: 'itsmeprash'
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Error: ${errorData.message || 'Network response was not ok'}`
//         );
//       }

//       const data = await response.json();
//       console.log(data);
//       const tokenId = data.tokenId;

//       zustandStorage.setItem('tokenId', tokenId);
//     } catch (error) {
//       console.error('Error during fetch:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Login failed',
//         text2: 'Please try again later'
//       });
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: 'Log In',
//           statusBarStyle: 'light',
//           headerStyle: {
//             backgroundColor: theme.colors.primary
//           },
//           headerTintColor: theme.colors.whiteColor,
//           headerTitleStyle: {
//             color: theme.colors.whiteColor,
//             fontFamily: 'HeadingFont',
//             fontSize: theme.fontSize.xl
//           }
//         }}
//       />
//       <View style={[styles.inputGroup, { marginTop: 10 }]}>
//         <Text style={styles.label}>Username</Text>
//         <TextInput
//           style={styles.input}
//           keyboardType="default"
//           placeholder="Enter your username"
//           selectionColor={theme.colors.primary}
//           onChangeText={(value) => handleNameChange(value)}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           keyboardType="default"
//           placeholder="Enter your password"
//           selectionColor={theme.colors.primary}
//           onChangeText={(value) => handlePasswordChange(value)}
//           secureTextEntry={true}
//         />
//       </View>

//       <Pressable style={styles.loginButton} onPress={handleSubmit}>
//         <Text
//           isWhite={true}
//           isBold={true}
//           style={{
//             fontSize: theme.fontSize.lg
//           }}
//         >
//           Log In
//         </Text>
//       </Pressable>
//     </View>
//   );
// };

// const stylesheet = createStyleSheet((theme) => ({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     paddingHorizontal: 8
//   },
//   inputGroup: {
//     marginBottom: 10
//   },
//   label: {
//     fontSize: theme.fontSize.lg,
//     fontFamily: 'BoldBodyTextFont',
//     color: theme.colors.blackColor,
//     marginBottom: 5
//   },
//   input: {
//     backgroundColor: theme.colors.whiteColor,
//     borderWidth: 1,
//     borderColor: theme.colors.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     fontSize: theme.fontSize.lg,
//     color: theme.colors.primary
//   },
//   loginButton: {
//     backgroundColor: theme.colors.primary,
//     borderRadius: theme.borderRadius.default,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     marginTop: 10
//   }
// }));

// export default Login;

import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';

const LoginScreen = () => {
  // State for username, password, and token
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.55:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      // Parse the response as JSON
      const data = await response.json();

      // Check if the response contains a token
      if (response.ok) {
        setToken(data.token); // Save the token
        Alert.alert('Login Successful');
      } else {
        Alert.alert('Login Failed', data.detail || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      {/* Input for username */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10
        }}
      />

      {/* Input for password */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10
        }}
      />

      {/* Login button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Display token if login is successful */}
      {token ? <Text>Token: {token}</Text> : null}
    </View>
  );
};

export default LoginScreen;
