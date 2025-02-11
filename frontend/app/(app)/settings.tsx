import React, {useEffect, useState} from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import PlaceholderPhoto from "@/assets/images/profile-picture-placeholder.png";
import {useSession} from "@/components/Context";
import {fetchTutors, fetchUserData, updateUserData} from "@/util/Backend";


export default function TabFourScreen () {
  // const colorScheme = useColorScheme();
  // const textColor = colorScheme === 'dark' ? 'white' : 'black';
  // const textColorInverse = colorScheme === 'dark' ? 'black' : 'white';
  const tabBarHeight = useBottomTabBarHeight();
  const { session } = useSession();
  const [user, setUserData] = useState([])

  const handleSave = () => {
    updateUserData(user, session).then();
  };

  // TODO: Replace with actual user data
  // Currently Hardcoded Data
  const Name = "John Doe";
  const Username = "@johndoe";
  const PhoneNumber = "+1 (780) 123-4567";
  const AccountCreated = "February 2025";

  useEffect(() => {
    const getData = async () => {
      let userData = await fetchUserData(session);
      setUserData(userData);
    }
    getData()
  }, [])

  return (
    <ThemedView style={styles.container}> 
      <ThemedView style={[styles.card, { marginBottom: tabBarHeight }]}>
        <ThemedView style={styles.header} />
        <ThemedView style={styles.profileContainer}>
          <ThemedView style={styles.profileWrapper}>
            <ThemedView style={styles.profileImageContainer}>
              <Image
                source={PlaceholderPhoto}
                style={styles.profileImage}
              />
            </ThemedView>
            <TouchableOpacity style={styles.cameraOverlay}>
              <MaterialIcons name="photo-camera" size={24} color="white" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.nameInput}>
            [ {user.role} ]{"\n"}
            {Name}
          </ThemedText>
          <ThemedView style={styles.infoContainer}>
            <ThemedView style={styles.infoRow}>
              <MaterialIcons name="mail" size={20} color="gray" />
              <TextInput
                defaultValue={user.email}
                style={[styles.infoText]}
                editable={false}
              />
            </ThemedView>
            <ThemedView style={styles.infoRowEditable}>
              <MaterialIcons name="alternate-email" size={20} color="gray" />
              <TextInput
                defaultValue={Username}
                style={[styles.infoText]}
              />
              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color="black" />
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.infoRowEditable}>
              <MaterialIcons name="phone" size={20} color="gray" />
              <TextInput
                defaultValue={PhoneNumber}
                style={[styles.infoText]}
              />
              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color="black" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.footer}>
            <MaterialIcons name="calendar-today" size={20} color="gray" />
            <Text style={[styles.footerText]}>Account Created {AccountCreated}</Text>
          </ThemedView>
          {/* 
          TODO:
          Correctly center Save Changes Button 
          */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};


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
    borderTopRightRadius: 10 
  },
  profileContainer: { 
    alignItems: "center", 
    marginTop: -50 
  },
  profileWrapper: { 
    position: "relative" 
  },
  profileImageContainer: { 
    width: 96, 
    height: 96, 
    borderRadius: 48, 
    backgroundColor: "#e5e7eb", 
    overflow: "hidden",
    marginTop: 16
  },
  profileImage: { 
    width: "100%", 
    height: "100%" 
  },
  cameraOverlay: { 
    position: "absolute", 
    top: 16, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "rgba(0,0,0,0.4)", 
    borderRadius: 48 
  },
  content: { 
    padding: 16,
    flex: 1
  },
  nameInput: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center", 
    borderBottomWidth: 1, 
    borderBottomColor: "transparent", 
    paddingVertical: 4 
  },
  infoContainer: { 
    marginTop: 16 
  },
  infoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#c7c8c9", 
    padding: 16, 
    borderRadius: 10,
    marginBottom: 10
  },
  infoRowEditable: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#c7c8c9", 
    padding: 16, 
    borderRadius: 10, 
    justifyContent: "space-between",
    marginBottom: 10
  },
  infoText: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 16 
  },
  footer: { 
    alignItems: "center", 
    marginTop: 16, 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderTopColor: "#e5e7eb" 
  },
  footerText: { 
    color: "gray", 
    fontSize: 14, 
  },
  buttonContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginBottom: 16
  },
  button: { 
    backgroundColor: "#a4becf", 
    paddingVertical: 12, 
    alignItems: "center", 
    borderRadius: 10,
    width: "75%"
  },
  buttonText: { 
    color: "black", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});
