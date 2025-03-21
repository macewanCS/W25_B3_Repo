import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/components/Context";
import { fetchUserData, updateUserData } from "@/util/Backend";

// Helper function to simulate weekly sessions (just for demonstration)
// const getWeeklySessions = (sessions) => {
//     // Assuming we are just using the most recent 7 days for the "week"
//     const today = new Date();
//     const oneWeekAgo = new Date(today);
//     oneWeekAgo.setDate(today.getDate() - 7);

//     return sessions.filter(session => {
//         // Just for simplicity, assuming session has a `date` field
//         const sessionDate = new Date(session.date);
//         return sessionDate >= oneWeekAgo;
//     });
// };

export default function TutorInvoicesScreen() {
    const lightMode = useColorScheme() === 'light';
    const { session } = useSession();
    const [data, setData] = useState<{ weeklyEarnings?: number; weeklyHours?: number }>({})

    useEffect(() => {
        const getData = async () => {
            let user = await fetchUserData(session);
            setData(user);
        }
            getData();
        }, []);
    
    // Example data if empty data TODO: remove on final product
    useEffect(() => {
        if (data.weeklyEarnings == null || data.weeklyEarnings == 0) {
            setData(prevData => ({ ...prevData, weeklyEarnings: 30 }));
        }
        if (data.weeklyHours == null || data.weeklyHours == 0) {
            setData(prevData => ({ ...prevData, weeklyHours: 2 }));
        }
    }, [data]);

    // Example data for sessions and earnings
    // const [sessions, setSessions] = useState([
    //     { id: '1', course: 'Mathematics', sessionPrice: 50, duration: 60, date: '2025-03-01' }, // Last week
    //     { id: '2', course: 'Physics', sessionPrice: 60, duration: 90, date: '2025-03-02' },    // Last week
    //     { id: '3', course: 'Chemistry', sessionPrice: 55, duration: 45, date: '2025-03-05' },   // This week
    //     { id: '4', course: 'Biology', sessionPrice: 45, duration: 120, date: '2025-03-06' },   // This week
    // ]);

    // Get weekly sessions and all-time sessions
    // const weeklySessions = getWeeklySessions(sessions);
    // const allTimeSessions = sessions.length;

    // Calculate total earnings, number of weekly sessions, and average price per session
    // const totalEarnings = weeklySessions.reduce((sum, session) => sum + session.sessionPrice, 0);
    // const numWeeklySessions = weeklySessions.length;
    // const avgSessionPrice = numWeeklySessions > 0 ? (totalEarnings / numWeeklySessions).toFixed(2) : 0;

    // Example auto-deposit history
    const [autoDepositHistory, setAutoDepositHistory] = useState([
        { date: 'March 1, 2025', amount: 200 },
        { date: 'February 25, 2025', amount: 120 },
    ]);

    const [bankAccount, setBankAccount] = useState({
        accountNumber: '',
        routingNumber: '',
    });

    const [isBankFormVisible, setIsBankFormVisible] = useState(false);

    // Function to handle bank account form submission
    const handleBankAccountSubmit = () => {
        console.log('Bank account updated:', bankAccount);
        setIsBankFormVisible(false);
        alert('Bank account successfully updated!');
    };

    const handleCancelAccountSubmit = () => {
        setIsBankFormVisible(false);
        // TODO:
        // try{
        // check then fetch real details again
    }

    // Render auto-deposit item
    const renderAutoDepositItem = ({ item }) => (
        <View style={styles.depositItem}>
            <Text style={styles.depositDate}>Date: {item.date}</Text>
            <Text style={styles.depositAmount}>Amount: ${item.amount}</Text>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
              <ThemedText style={styles.header}>Finances:</ThemedText>
            <ThemedView style={styles.infoContainer}>
                {/* Earnings Section */}
                <ThemedView style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Weekly Statistics:</ThemedText>
                    <ThemedText style={styles.earningsAmount}>${data.weeklyEarnings}</ThemedText>
                    <ThemedText style={styles.statsText}>{data.weeklyHours} sessions completed.</ThemedText>
                </ThemedView>

                {/* Auto-Deposit Statements Section */}
                <ThemedView style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Auto-Deposit Statements</ThemedText>
                    <FlatList
                        data={autoDepositHistory}
                        renderItem={renderAutoDepositItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </ThemedView>

                <ThemedView style={styles.footer}></ThemedView>

                {/* Bank Account Setup */}
                <ThemedView style={styles.section}>
                    {isBankFormVisible ? (
                        <ThemedView style={styles.bankForm}>
                            <ThemedView style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Account Number"
                                placeholderTextColor="#888"
                                value={bankAccount.accountNumber}
                                onChangeText={(text) => setBankAccount({ ...bankAccount, accountNumber: text })}
                            />
                            </ThemedView>
                            <ThemedView style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Routing Number"
                                placeholderTextColor="#888"
                                value={bankAccount.routingNumber}
                                onChangeText={(text) => setBankAccount({ ...bankAccount, routingNumber: text })}
                            />
                            </ThemedView>
                            <ThemedView style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.inputButton, {backgroundColor: 'red'}]} title="Cancel" onPress={handleCancelAccountSubmit}>
                                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inputButton} title="Submit" onPress={handleBankAccountSubmit}>
                                <ThemedText style={styles.buttonText}>Submit</ThemedText>
                            </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    ) : (
                        <TouchableOpacity onPress={() => setIsBankFormVisible(true)} style={styles.button}>
                            <ThemedText style={styles.buttonText}>Link Bank Account</ThemedText>
                        </TouchableOpacity>
                    )}
                </ThemedView>
                
            </ThemedView>
        </ThemedView>
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
        textAlign: 'center',
    },
    infoContainer: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    earningsAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#32a852',
    },
    statsRow: {
        marginTop: 10,
    },
    statsText: {
        fontSize: 24,
    },
    depositItem: {
        backgroundColor: '#c7c8c9', // dark mode '#c7c8c9' | light mode '#f9f9f9'
        padding: 16,
        marginBottom: 10,
        borderRadius: 8,
    },
    depositDate: {
        fontSize: 14,
        color: '#555',
    },
    depositAmount: {
        fontSize: 16,
        color: '#007AFF',
    },
    bankForm: {
        marginTop: 16,
    },
    inputRow: {
        flexDirection: "column",          // Stack items vertically (one above the other)
        alignItems: "stretch",            // Ensure inputs take up full width of container
        backgroundColor: "#c7c8c9", 
        borderRadius: 10, 
        justifyContent: "flex-start",     // Align children at the top of the container
        marginBottom: 10,
    },
    input: {
        height: 40,                       // Set a fixed height for the inputs
        fontSize: 16,
        paddingHorizontal: 10,            // Adds padding inside the input field
        textColor: 'black',
    },
    buttonRow: {
        flexDirection: 'row',         // Aligns items in a horizontal row
        justifyContent: 'space-between',  // Adds space between the buttons
        alignItems: 'center',         // Centers the buttons vertically
        marginTop: 20,                // Optional: Adds some space above the buttons
    },
    inputButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,                      // Makes the button take up available space
        marginHorizontal: 5,          // Adds space between buttons
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    footer: { 
      alignItems: "center", 
      paddingVertical: 8, 
      borderTopWidth: 1, 
      borderTopColor: "#e5e7eb" 
    },
});
