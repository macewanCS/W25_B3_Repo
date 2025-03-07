import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from '@/components/ui/IconSymbol';
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function MyStudentsScreen() {
    const lightMode = useColorScheme() === 'light';

    // Example data for active students
    const [students] = useState([
        {
            id: '1',
            name: 'John Doe',
            course: 'Mathematics',
            sessionPrice: 50,
            phoneNumber: '+123-456-7890',
        },
        {
            id: '2',
            name: 'Jane Smith',
            course: 'Physics',
            sessionPrice: 60,
            phoneNumber: '+098-765-4321',
        },
        {
            id: '3',
            name: 'Emily Johnson',
            course: 'Chemistry',
            sessionPrice: 55,
            phoneNumber: '+112-233-4455',
        },
        {
            id: '4',
            name: 'Michael Brown',
            course: 'Biology',
            sessionPrice: 45,
            phoneNumber: '+122-233-3444',
        },
        {
            id: '5',
            name: 'Sophia Williams',
            course: 'English Literature',
            sessionPrice: 40,
            phoneNumber: '+133-344-4555',
        },
        {
            id: '6',
            name: 'Oliver Harris',
            course: 'Computer Science',
            sessionPrice: 70,
            phoneNumber: '+144-455-5666',
        },
        {
            id: '7',
            name: 'Amelia Taylor',
            course: 'History',
            sessionPrice: 50,
            phoneNumber: '+155-566-6777',
        },
        {
            id: '8',
            name: 'Lucas Martin',
            course: 'Economics',
            sessionPrice: 65,
            phoneNumber: '+166-677-7888',
        },
    ]);
    

    // const renderStudentItem = ({ item }) => (
    //     <View style={styles.studentRow}>
    //         <ThemedView style={styles.studentInfo}>
    //             <ThemedText style={styles.studentName}>{item.name}</ThemedText>
    //             <Text style={styles.studentDetails}>Course: {item.course}</Text>
    //             <Text style={styles.studentDetails}>Session Price: ${item.sessionPrice}</Text>
    //             <Text style={styles.studentDetails}>Phone: {item.phoneNumber}</Text>
    //         </ThemedView>
    //     </View>
    // );

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.studentRow, 
                { backgroundColor: lightMode ? '#ccc' : '#232323' }
            ]}
            // onPress={() => handleStudentPress(item)}
        >
            <ThemedView style={styles.studentInfo}>
                <ThemedText style={styles.studentName}>{item.name}</ThemedText>
                <ThemedText style={styles.studentDetails}>Course: {item.course}</ThemedText>
                <ThemedText style={styles.studentDetails}>Session Price: ${item.sessionPrice}</ThemedText>
                <ThemedText style={styles.studentDetails}>Phone: {item.phoneNumber}</ThemedText>
            </ThemedView>
        </TouchableOpacity>
    );

    return (
        // <UserSettingsBackground title="My Students">
        <ThemedView style={styles.container}>
            <ThemedText style={styles.header}>Current Students:</ThemedText>
            <ThemedView style={styles.listContainer}>
                <FlatList
                    data={students}
                    renderItem={renderStudentItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </ThemedView>
        </ThemedView>
        // </UserSettingsBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    listContainer: {
        flex: 1,
        padding: 16,
        marginBottom: 50,
    },
    studentRow: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        elevation: 2, // Adds shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    studentInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    studentDetails: {
        fontSize: 14,
        marginBottom: 4,
    },
});
