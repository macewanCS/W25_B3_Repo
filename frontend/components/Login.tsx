import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';

export default function Login() {
    return (
        <View style={styles.container}>
        <IconSymbol size={310} color="#808080" name="chevron.left.forwardslash.chevron.right" style={styles.headerImage} />
        <ThemedText type="title">Login</ThemedText>
        <ThemedText>This is the login screen.</ThemedText>
        </View>
    );
}