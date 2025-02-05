import React from 'react';
import { router } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import {useSession} from "@/components/Context";


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
            <ThemedText type="defaultSemiBold">Lyrne: User Login Portal</ThemedText>

            <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={5}
                style={styles.appleButton}
                onPress={async () => {
                    try {
                        const credential = await AppleAuthentication.signInAsync({
                            requestedScopes: [
                                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                AppleAuthentication.AppleAuthenticationScope.EMAIL,
                            ],
                        });

                        signIn(credential.identityToken);

                    } catch (e) {
                        if (e.code === 'ERR_REQUEST_CANCELED') {
                            // handle that the user canceled the sign-in flow
                        } else {
                            // handle other errors
                        }
                    }
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    signinContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1, 
    },
    appleButton: {
        marginTop: 15,
        width: 200,
        height: 44,
    },
});
