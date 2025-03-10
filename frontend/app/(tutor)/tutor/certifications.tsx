import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Button, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from "@/components/ThemedText";
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";

export default function TutorCertScreen() {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [certificates, setCertificates] = useState([
        { id: '1', name: 'Teaching Certificate', uri: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Math Certification', uri: 'https://via.placeholder.com/150' },
    ]);

    const courses = [ // Placeholder list for courses
        { id: '1', name: 'Biology' },
        { id: '2', name: 'Chemistry' },
        { id: '3', name: 'Computer Science' },
        { id: '4', name: 'English' },
        { id: '5', name: 'Mathematics' },
        { id: '6', name: 'Physics' },
        { id: '7', name: 'Science' },
        { id: '8', name: 'Social Studies' },
    ];

    const handleUpload = () => {
        // TODO: set up uploading image/file
        alert(`Pick certificate for ${selectedCourse?.name} here.\nApproval will be required.`);
    };

    return (
        <UserSettingsBackground title="Certifications & Courses">
            {/* Uploaded Certificates */}
            <ThemedText style={styles.sectionTitle}>Your Certificates</ThemedText>
            <FlatList
                data={certificates}
                keyExtractor={(item) => item.id}
                horizontal
                renderItem={({ item }) => (
                    <View style={styles.certificateCard}>
                        <Image source={{ uri: item.uri }} style={styles.certificateImage} />
                        <ThemedText>{item.name}</ThemedText>
                    </View>
                )}
            />

            {/* Course Selection Dropdown */}
            <ThemedText style={styles.sectionTitle}>Select a Course to upload a certificate:</ThemedText>
            <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedCourse ? selectedCourse.id : ""} 
                onValueChange={(itemValue) => {
                    const courseObj = courses.find((course) => course.id === itemValue); 
                    setSelectedCourse(courseObj); 
                }}
                >
                <Picker.Item label="Select..." value="" />
                {courses.map((course) => (
                    <Picker.Item key={course.id} label={course.name} value={course.id} />
                ))}
                </Picker>
            </View>

            {selectedCourse && (
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.uploadButtonText}>
                    Upload Certificate for {selectedCourse.name}
                    </Text>
                </TouchableOpacity>
            )}
        </UserSettingsBackground>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    certificateCard: {
        marginRight: 15,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    certificateImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginVertical: 10,
        backgroundColor: "#00000",
    },
    uploadButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    uploadButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});