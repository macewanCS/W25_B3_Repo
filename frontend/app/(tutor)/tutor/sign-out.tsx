import React, { useState, useEffect} from 'react';
import { router } from 'expo-router';
import {useSession} from "@/components/Context";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {fetchUserData, updateUserData} from "@/util/Backend";
import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function TutorSignOut() {
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
            {/* <TouchableOpacity style={styles.Button} onPress={switchRole}>
                <ThemedText>Switch Role to {user.role === "STUDENT" ? "TUTOR" : "STUDENT"}</ThemedText>
            </TouchableOpacity> */}
            <ThemedText>Are you sure you want to sign out?</ThemedText>
            <TouchableOpacity style={styles.Button} onPress={signOut}>
                <Text style={{ fontWeight: 'bold' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={() => router.push('/settings')}>
                <Text style={{ fontWeight: 'bold' }}>No</Text>
            </TouchableOpacity>
        </UserSettingsBackground>
    ) 
}

const styles = StyleSheet.create({
    Button: {
        alignItems: "center",
        backgroundColor: "#a4becf",
        paddingVertical: 18,
        marginTop: 25,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    }
})