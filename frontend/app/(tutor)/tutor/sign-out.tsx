import React, { useState, useEffect} from 'react';
import { router } from 'expo-router';
import {useSession} from "@/components/Context";
import { Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import {fetchUserData, updateUserData} from "@/util/Backend";
import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function TutorSignOut() {
    const colorScheme = useColorScheme();
    const lightMode = colorScheme === 'light';
    const { session, signOut } = useSession();
    const [user, setUserData] = useState({});

    useEffect(() => {
        fetchUserData(session).then(data => {
            // user = data
            setUserData(data);
            
        });
    }, [session]);

    const switchRole = async () => {
        if (user.role == "STUDENT") {
            await updateUserData({role: "TUTOR"}, session)
        } else if (user.role == "TUTOR") {
            await updateUserData({role: "STUDENT"}, session)
            // setUserData({role: "STUDENT"})
        } else {
            console.log(`didn't hit ${user.role}`)
        }
        router.navigate('/')
    }

    return(
        <UserSettingsBackground title="Log Out" >
            <ThemedText>Are you sure you want to sign out?</ThemedText>
            <TouchableOpacity style={[styles.YesButton, { backgroundColor: lightMode ? "#fff" : "#232323" }]} onPress={signOut}>
                <ThemedText style={{ fontWeight: 'bold' }}>Yes</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NoButton} onPress={() => router.push('/settings')}>
                <ThemedText style={{ fontWeight: 'bold' }}>No</ThemedText>
            </TouchableOpacity>
        </UserSettingsBackground>
    ) 
}

const styles = StyleSheet.create({
    YesButton: {
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#007bff",
        paddingVertical: 18,
        marginTop: 25,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    NoButton: {
        alignItems: "center",
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        borderWidth: 3,
        paddingVertical: 18,
        marginTop: 25,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    }
})
