import React from 'react';
import { Text, View, Button, useColorScheme } from 'react-native';
import { useSession } from "@/components/Context";
import {
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {fetchUserData, updateUserData} from "@/util/Backend";


GoogleSignin.configure({
    webClientId: "",
    scopes: ['profile', 'email']
  });

export function GoogleSignIn() {
    const { signIn } = useSession();
    const colorScheme = useColorScheme();
    
    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                    const userInfo = await GoogleSignin.signIn();
                    
                    // Get user's ID token
                    const { accessToken, idToken } = await GoogleSignin.getTokens();

                    if (idToken) {
                        console.log("\nGoogle ID Token:", idToken);
                        console.log("\nGoogle access Token:", accessToken); 
                        signIn(idToken);
                        const { session } = useSession();
                        fetchUserData(session).then(data => {
                            console.log(data) //or whatever the print is i cant remember
                        })
                    } else {
                        console.error("No ID Token received!");
                    }
                } catch (error) {
                    console.error("Google Sign-In Error:", error);
                }
            }}
        />
    );
}