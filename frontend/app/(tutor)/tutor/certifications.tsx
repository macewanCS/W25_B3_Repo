import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function TutorCertScreen() {


    return (
        <UserSettingsBackground title="Certifications & Courses" >
            
        </UserSettingsBackground>
    );

}

const styles = StyleSheet.create({
    Placeholder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});