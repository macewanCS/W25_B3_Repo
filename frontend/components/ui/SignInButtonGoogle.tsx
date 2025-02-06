import React from 'react';
import { Text, View, Button, useColorScheme } from 'react-native';
import { useSession } from "@/components/Context";

export function GoogleSignIn() {
    const { signIn } = useSession();
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? 'white' : 'black';
    
    return (
        // Placeholder for Google sign-in button
        <View>
            <Text style={{ color: textColor, paddingBottom: 10 }}>
                This is a temporary button:
            </Text>
            <Button title="Sign In" onPress={() => {
                 signIn("tempToken");
                }} 
            />
        </View>
    );
}