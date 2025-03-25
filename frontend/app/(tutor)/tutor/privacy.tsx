import React, { useState } from 'react';
import { StyleSheet, View, Switch, useColorScheme } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function TutorPrivacyScreen() {
    const lightMode = useColorScheme() === 'light';

    // Sample Options
    const [options, setOptions] = useState([
        { id: 1, name: "Full Name", enabled: true },
        // { id: 2, name: "Privacy Option 2", enabled: false },
        // { id: 3, name: "Privacy Option 3", enabled: false },
        // { id: 4, name: "Privacy Option 4", enabled: false },
    ]);

    // Toggle function to update option state
    const toggleOption = (id) => {
        setOptions((prev) =>
            prev.map((option) =>
                option.id === id ? { ...option, enabled: !option.enabled } : option
            )
        );
    };

    return (
        <UserSettingsBackground title="Privacy">
            <ThemedView style={[styles.descriptionContainer, { backgroundColor: lightMode ? "#f8f9fa" : "#232323" }]}>
                <ThemedText style={styles.descriptionText}>
                    Manage your what information on your profile is publicly visible below.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.container}>
                {options.map((option) => (
                    <ThemedView key={option.id} style={styles.notificationRow}>
                        <ThemedText style={styles.notificationText}>{option.name}</ThemedText>
                        <Switch
                            value={option.enabled}
                            onValueChange={() => toggleOption(option.id)}
                        />
                    </ThemedView>
                ))}
            </ThemedView>
        </UserSettingsBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    notificationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    notificationText: {
        fontSize: 16,
    },
    descriptionContainer: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 14,
        textAlign: "center",
    },
});