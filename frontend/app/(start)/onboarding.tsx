import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image, TextInput, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { updateUserData, uploadDocument, uploadImage } from "@/util/Backend";
import { useSession } from "@/components/Context";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from 'expo-document-picker';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00"];

function dayHourToUnixMillis(day, hour) {
    if (day < 1 || day > 7 || hour < 0 || hour > 23) {
        throw new Error('Invalid day or hour. Day should be 1-7 and hour should be 0-23.');
    }

    const date = new Date(2024, 0, day, hour, 0, 0, 0); // Months are zero-indexed
    return date.getTime();
}

export default function Onboarding() {
    const { session } = useSession();
    const [step, setStep] = useState(1);
    const [currentAvailability, setCurrentAvailability] = useState<string[]>([]);
    const [role, setRole] = useState("");
    const [imageCertificate, setImageCertificate] = useState(null);
    const [documentCertificate, setDocumentCertificate] = useState(null);

    const handleRoleSubmit = (selectedRole = "") => {
        if (selectedRole != "") {
            updateUserData({ role: selectedRole }, session);
            setRole(selectedRole); // Used to move tutors to step 4
            setStep(2); // Move to Get Name
        }
    }

    const handleNameSubmit = (selectedName = "") => {
        if (selectedName != "") {
            updateUserData({ name: selectedName }, session);
            setStep(3); // Move to Get Availability
        }
    }

    const handleAvailabilityPress = (day: string, hour: string) => {
        const availabilityString = `${day}_${hour}`;
        setCurrentAvailability((prev) => {
            if (prev.includes(availabilityString)) {
                return prev.filter((item) => item !== availabilityString);
            } else {
                return [...prev, availabilityString];
            }
        });
    };
    
    const isAvailable = (day: string, hour: string) => {
        return currentAvailability.includes(`${day}_${hour}`);
    };
    
    const handleAvailabilitySubmit = () => {
        const availability = currentAvailability.map((availabilityString) => {
            const [day, hour] = availabilityString.split('_');
            const dayInt = daysOfWeek.indexOf(day) + 1; // Convert day to integer (1-7)
            const hourInt = parseInt(hour.split(':')[0], 10);
            return {
                iStartMillis: dayHourToUnixMillis(dayInt, hourInt),
                iEndMillis: dayHourToUnixMillis(dayInt, hourInt + 1),
            };
        });
        console.log(dayHourToUnixMillis(1, 12));
        updateUserData({ availability }, session);
        setStep(role === "TUTOR_PENDING" ? 4 : 5); // Move Tutor to Get Certificate, Student to Finish
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to upload images.");
            return;
        }

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            console.log("ImagePicker result:", result);

            if (!result.canceled) {
                setImageCertificate(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error launching ImagePicker:", error);
        }
    };

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: "*/*", // Accepts any file type
                copyToCacheDirectory: true,
                multiple: false, // Set to true if you want multiple file selection
            });

            console.log("DocumentPicker result:", result);

            if (result.canceled) {
                console.log("User canceled document picker");
                return;
            }

            setDocumentCertificate(result.assets[0].uri); // Save the document URI just like pickImage
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    const handleCertificateSubmit = () => {
        if (documentCertificate) uploadDocument(session, documentCertificate);
        if (imageCertificate) uploadImage(session, imageCertificate);
        setStep(5); // Move to Finish
    }

    const handleFinalSubmit = () => {
        if (role == "STUDENT") router.replace('/(student)/');
        else router.replace('/(tutor)/'); // Moves TUTOR_PENDING to TutorLayout
    }

    return (
        <ThemedView style={styles.container}>

            {/* Step 1: Get role */}
            {step === 1 && (
                <ThemedView style={styles.roleSelectionContainer}>
                    <ThemedText>Welcome to Lyrne!</ThemedText>
                    <ThemedText>We need you to complete a few steps before entering the app. Please select who you are:</ThemedText>
                    <View style={styles.roleButtonsContainer}>
                        <TouchableOpacity onPress={() => handleRoleSubmit("STUDENT")} style={styles.button}>
                            <ThemedText style={styles.buttonText}>I am a Student.</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRoleSubmit("TUTOR_PENDING")} style={styles.button}>
                            <ThemedText style={styles.buttonText}>I am a Tutor.</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            )}

            {/* Step 2: Get name */}
            {step === 2 && (
                <ThemedView>
                    <ThemedText>Great! Now we need to get your name.</ThemedText>
                    <ThemedView style={styles.infoRowEditable}>
                        <MaterialIcons name="alternate-email" size={20} color="gray" />
                        <TextInput
                            placeholder="First & Last Name"
                            placeholderTextColor="#000"
                            style={[styles.infoText]}
                            onSubmitEditing={value => handleNameSubmit(value.nativeEvent.text)}
                        />
                        <TouchableOpacity>
                            <MaterialIcons name="edit" size={20} color="black" />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            )}

            {/* Step 3: Get Availability */}
            {step === 3 && (
                <ThemedView>
                    <ThemedText style={{ marginTop: 50 }}>Here you can choose your Availability. Press on each box pertaining to an hour you are available. Then press Submit when you are finished</ThemedText>
                    <ScrollView>
                        <ThemedView style={styles.infoContainer}>
                            <ThemedView style={styles.row}>
                                <ThemedText style={styles.timeLabel}></ThemedText>
                                {daysOfWeek.map((day) => (
                                    <ThemedText key={day} style={styles.dayLabel}>{day}</ThemedText>
                                ))}
                                <ThemedText style={styles.timeLabel}></ThemedText>
                            </ThemedView>
                            {hours.map((hour, index) => (
                                <React.Fragment key={hour}>
                                    <View style={styles.row}>
                                        <ThemedText style={styles.timeLabel}>{hour}</ThemedText>
                                        {daysOfWeek.map((day) => (
                                            <TouchableOpacity
                                                key={`${day}_${hour}`}
                                                style={[
                                                    styles.buttonInactive,
                                                    isAvailable(day, hour) && styles.buttonActive,
                                                ]}
                                                onPress={() => handleAvailabilityPress(day, hour)}
                                            >
                                                <ThemedText style={styles.buttonText}></ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                        <ThemedText style={styles.timeLabel}>{hour}</ThemedText>
                                    </View>
                                    {index < hours.length - 1 && (
                                        <ThemedView style={styles.footer}></ThemedView>
                                    )}
                                </React.Fragment>
                            ))}
                            <ThemedView style={styles.row}>
                                <ThemedText style={styles.timeLabel}></ThemedText>
                                {daysOfWeek.map((day) => (
                                    <ThemedText key={day} style={styles.dayLabel}>{day}</ThemedText>
                                ))}
                                <ThemedText style={styles.timeLabel}></ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <TouchableOpacity onPress={handleAvailabilitySubmit} style={styles.button}>
                            <ThemedText style={styles.buttonText}>Submit</ThemedText>
                        </TouchableOpacity>
                    </ScrollView>
                </ThemedView>
            )}

            {/* Step 4: (tutor only) Get Certificate(s) */}
            {step === 4 && (
                <ThemedView>
                    <ThemedView style={styles.uploadContainer}>
                        <ThemedText style={{ marginTop: 50, marginBottom: 10 }}>Please upload your teaching certificate.</ThemedText>
                        <View style={styles.roleButtonsContainer}>
                            <TouchableOpacity onPress={pickImage} style={styles.buttonPlus}>
                                <IconSymbol name="plus" size={24} color="white" />
                                <ThemedText style={styles.buttonText}>Pick an Image</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickDocument} style={styles.buttonPlus}>
                                <IconSymbol name="plus" size={24} color="white" />
                                <ThemedText style={styles.buttonText}>Pick a Document</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.roleButtonsContainer}>
                            {imageCertificate && (
                                <Image source={{ uri: imageCertificate }} style={[styles.image, {margin: 10 }]} />
                            )}
                            {documentCertificate && (
                                <Image source={{ uri: documentCertificate }} style={[styles.image, {margin: 10 }]} />
                            )}
                        </View>
                        {(imageCertificate || documentCertificate) && (
                            <TouchableOpacity onPress={handleCertificateSubmit} style={styles.button}>
                                <ThemedText style={styles.buttonText}>Submit</ThemedText>
                            </TouchableOpacity>
                        )}
                    </ThemedView>
                </ThemedView>
            )}

                        {/* Step 5: Finish */}
            {step === 5 && (
                <ThemedView>
                    <ThemedText>We are finished! You can now open the app.</ThemedText>
                    {role == "TUTOR" && (
                        <ThemedText>Your certificate is now under review, you will have limited access until it is approved.</ThemedText>
                    )}
                    <ThemedText style={{ paddingBottom: 10 }}></ThemedText>
                    <TouchableOpacity onPress={handleFinalSubmit} style={styles.button}>
                        <ThemedText style={styles.buttonText}>Open</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            )}

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    roleSelectionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleButtonsContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        marginHorizontal: 8,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 50
    },
    buttonPlus: {
        backgroundColor: '#007AFF',
        marginHorizontal: 8,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: "row",
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    infoRowEditable: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#c7c8c9",
        padding: 16,
        borderRadius: 10,
        justifyContent: "space-between",
        marginVertical: 10,
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    infoContainer: {
        marginTop: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    dayLabel: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    timeLabel: {
        width: 50,
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonInactive: {
        flex: 1,
        margin: 2,
        padding: 10,
        backgroundColor: "#c7c8c9",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    },
    buttonActive: {
        backgroundColor: "green",
    },
    footer: {
        alignItems: "center",
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    footerText: {
        color: "gray",
        fontSize: 14,
        marginTop: 16,
    },
    uploadContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 10,
    },
});