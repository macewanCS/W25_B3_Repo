import React from 'react';
// import Login from '@/components/Login';
import { router } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { useSession } from '@/components/Context';
import { TextInput } from 'react-native';
import Ripple from 'react-native-material-ripple';

export default function SignIn() {
  const { signIn, session } = useSession();

    if (session) {
        // If the user is already authenticated, redirect to the home screen.
        return router.replace('/');
    }
  
return (
    <ThemedView style={styles.signinContainer}>
        <IconSymbol size={60} name="person.fill" color={'white'} />
        {/* <ThemedText type="defaultSemiBold" style={styles.link}
            onPress={() => {
                signIn();
                // Navigate after signing in. You may want to tweak this to ensure sign-in is
                // successful before navigating.
                router.replace('/');
            }}>
            Sign In
        </ThemedText> */}
        <View style={styles.container}>
                {/* <IconSymbol size={310} color="#808080" name="person.fill" style={styles.headerImage} /> */}
                {/* <ThemedText type="title">Login</ThemedText> */}
                <ThemedText style={{alignItems: 'center'}}>Lyrne: User Login Portal</ThemedText>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Username"
                        placeholderTextColor="#808080"
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Password"
                        placeholderTextColor="#808080"
                        secureTextEntry={true}
                    />
                </View>
                </View>

        <Ripple style={styles.loginButton}
            rippleColor="white"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleContainerBorderRadius={10}
            rippleFades={false}
            
            onPress={() => {
                signIn();
                router.replace('/');
            }}>
            <Text>Sign In</Text>
        </Ripple>
    </ThemedView>
    
);
}

const styles = StyleSheet.create({
signinContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1, 
    justifyContent: 'center',
},
inputField: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 40,
    margin: 12,
    padding: 10,
    width: 250,
},
link: {
    marginTop: 15,
    paddingVertical: 15,
    color: '#03b6fc',
},
loginButton: {
    alignItems: 'center',
    backgroundColor: '#03b6fc',
    borderRadius: 10,
    color: 'white',
    padding: 10,
    width: 250,
}
});
