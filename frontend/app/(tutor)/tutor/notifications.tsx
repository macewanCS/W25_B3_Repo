import React, { useState } from 'react';
import { StyleSheet, View, Switch, useColorScheme } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function TutorNotificationScreen() {
    const lightMode = useColorScheme() === 'light';

    // Sample Notifications
    const [notifications, setNotifications] = useState([
        { id: 1, name: "New Sessions", enabled: true },
        { id: 2, name: "Booking a Session", enabled: false },
        { id: 3, name: "Upcoming Session Reminders", enabled: true },
        { id: 4, name: "Chat Message Alerts", enabled: true },
    ]);

    // Toggle function to update notification state
    const toggleNotification = (id) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
            )
        );
    };

    return (
        <UserSettingsBackground title="Notification Preferences">
            <ThemedView style={[styles.descriptionContainer, { backgroundColor: lightMode ? "#f8f9fa" : "#232323" }]}>
                <ThemedText style={styles.descriptionText}>
                    Manage your email notification preferences below.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.container}>
                {notifications.map((notif) => (
                    <ThemedView key={notif.id} style={styles.notificationRow}>
                        <ThemedText style={styles.notificationText}>{notif.name}</ThemedText>
                        <Switch
                            value={notif.enabled}
                            onValueChange={() => toggleNotification(notif.id)}
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