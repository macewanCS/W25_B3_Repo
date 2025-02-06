import React from 'react';
import { router } from 'expo-router';
import { Text, Image, Platform, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from 'react-native';
import { useSession } from "@/components/Context";
import { AppleSignIn } from "@/components/ui/SignInButtonApple";
import { GoogleSignIn } from "@/components/ui/SignInButtonGoogle";
import { WebSignIn } from "@/components/ui/SignInButtonWeb";
import LyrneLogo from '@/assets/images/lyrne-logo-clear.png';


export default function SignIn() {
    const { session } = useSession();
    const colorScheme = useColorScheme();

    React.useEffect(() => {
        if (session) {
            // If the user is already authenticated, redirect to the home screen.
            router.replace('/');
        }
    }, [session]);

    return (
        <ThemedView style={styles.signinContainer}>
            <ThemedView style={styles.topHalf}>
                <Image source={LyrneLogo} style={styles.logo} />
            </ThemedView>
            <ThemedView style={styles.bottomHalf}>
                {Platform.OS === 'ios' ? (
                    <AppleSignIn />
                ) : Platform.OS === 'android' ? (
                    // Currently using a placeholder
                    <GoogleSignIn />
                ) : (
                    // Currently using a placeholder
                    <WebSignIn />
                )}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    signinContainer: {
        flex: 1,
    },
    topHalf: {
        flex: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomHalf: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logo: {
        justifyContent: 'inherit',
        width: 300, 
        height: 300,
        marginBottom: 20,
    },
});
