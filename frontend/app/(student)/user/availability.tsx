import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { UserSettingsBackground } from "@/components/ui/SettingsBackground";
import { useSession } from "@/components/Context";
import { fetchUserData, updateUserData } from "@/util/Backend";
import { router } from 'expo-router';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
// TODO: Decide on hours to have
const hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00"];

function dayHourToUnixMillis(day, hour) {
  if (day < 1 || day > 7 || hour < 0 || hour > 23) {
      throw new Error('Invalid day or hour. Day should be 1-7 and hour should be 0-23.');
  }

  const date = new Date(2024, 0, day, hour, 0, 0, 0); // Months are zero-indexed
  return date.getTime();
}

export default function StudentAvailabilityScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { session } = useSession();
  const [user, setUserData] = useState([]);
  const [created, setCreated] = useState("");
  const [currentAvailability, setCurrentAvailability] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      let userData = await fetchUserData(session);
      setUserData(userData);
      setCreated(new Date(userData.created).toDateString());
    };
    getData();
  }, []);

  const handlePress = (day: string, hour: string) => {
    const availabilityString = `${day}_${hour}`;
    setCurrentAvailability((prev) => {
      if (prev.includes(availabilityString)) {
        return prev.filter((item) => item !== availabilityString);
      } else {
        return [...prev, availabilityString];
      }
    });
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
    updateUserData({ availability }, session);
  };

  const isAvailable = (day: string, hour: string) => {
    return currentAvailability.includes(`${day}_${hour}`);
  };

  return (
    <UserSettingsBackground title="Availability" >
        
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
                            styles.button,
                            isAvailable(day, hour) && styles.buttonActive,
                        ]}
                        onPress={() => handlePress(day, hour)}
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
        </ScrollView>
        <TouchableOpacity onPress={handleAvailabilitySubmit} style={styles.saveButton}>
          <ThemedText style={styles.buttonText}>Save</ThemedText>
        </TouchableOpacity>
        
    </UserSettingsBackground>
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
  button: {
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
  buttonText: {
    color: "white",
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
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});