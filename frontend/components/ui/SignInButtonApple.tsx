import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { StyleSheet } from 'react-native';
import { useSession } from "@/components/Context";

export function AppleSignIn() {
    const { signIn } = useSession();

    return (
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
       
    );
}

const styles = StyleSheet.create({
    appleButton: {
        marginTop: 15,
        width: 200,
        height: 44,
    },
});
