import React from 'react';
import { Text, View, Button, useColorScheme } from 'react-native';
import { useSession } from "@/components/Context";
import {
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

export function GoogleSignIn() {
    const { signIn } = useSession();
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? 'white' : 'black';
    
    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const response = await GoogleSignin.signIn();
                    if (isSuccessResponse(response)) {
                        const {idToken, user} = response.data;
                        const {name, email, photo} = user;
                        signIn(idToken);

                    }
                }
                catch {
                    //lol
                }

            // initiate sign in
            }}
      />
    );
}