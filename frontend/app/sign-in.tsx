import React from 'react';
import { router } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from 'react-native';

import { useSession } from '@/components/Context';
import { TextInput } from 'react-native';
import Ripple from 'react-native-material-ripple';

export default function SignIn() {
  const { signIn, session } = useSession();
  const colorScheme = useColorScheme();

    if (session) {
        // If the user is already authenticated, redirect to the home screen.
        return router.replace('/');
    }
  
return (
    <ThemedView style={[styles.signinContainer, {paddingTop: 250}]}>
        <IconSymbol size={60} name="person.fill" color={colorScheme} />
        <ThemedText type="defaultSemiBold" style={styles.inputContainer}>Lyrne: User Login Portal</ThemedText>
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
        <Ripple style={styles.loginButton}
            rippleColor="white"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleContainerBorderRadius={10}
            rippleFades={false}
            onPress={() => {
                signIn();
                // When Authentication is implemented,
                // Check if user sign in is successful before redirecting
                router.replace('/');
            }}>
            <Text>Sign In</Text>
        </Ripple>
        <ThemedText style={styles.link}
            onPress={() => {
                router.replace('/register');
            }}>
            Click here to create an account.
        </ThemedText>
    </ThemedView>
);
}

const styles = StyleSheet.create({
    signinContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1, 
    },
    inputField: {
        backgroundColor: '#dbdbdb',
        borderRadius: 10,
        height: 40,
        marginTop: 12,
        padding: 10,
        width: 250,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
        color: '#4595e6',
        textDecorationLine: 'underline',
    },
    loginButton: {
        alignItems: 'center',
        backgroundColor: '#03b6fc',
        borderRadius: 10,
        color: 'white',
        justifyContent: 'center',
        marginTop: 12,
        padding: 10,
        width: 250,
        height: 40,
    },
});
