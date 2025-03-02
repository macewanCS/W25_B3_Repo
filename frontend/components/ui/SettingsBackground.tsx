import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSession } from "@/components/Context";
import { fetchUserData, updateUserData } from "@/util/Backend";
import { router } from 'expo-router';

export function MainSettingsBackground() {
    // For the settings tab (both roles)
    return;
}

export function UserSettingsBackground({ title = "", children }) {
    // For the sub-settings (both roles)
    const tabBarHeight = useBottomTabBarHeight();

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={[styles.card, { marginBottom: tabBarHeight }]}>
                <ThemedView style={styles.header} />
                <ThemedView style={styles.profileContainer}></ThemedView>
                <ThemedView style={styles.content}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.push('/settings')}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <ThemedText style={styles.titleText}>{title}</ThemedText>
                    {children}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        flex: 1,
        width: "100%",
    },
    header: {
        height: 120,
        backgroundColor: "#e9c030",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: -50,
    },
    content: {
        padding: 16,
        flex: 1,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        borderBottomWidth: 1,
        borderBottomColor: "transparent",
        paddingVertical: 4,
        paddingBottom: 16,
    },
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#232323",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // Ensure the back button is on top
    },
});