import React, {useEffect, useState} from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import PlaceholderPhoto from "@/assets/images/profile-picture-placeholder.png";
import {useSession} from "@/components/Context";
import {fetchTutors, fetchUserData, updateUserData} from "@/util/Backend";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { router } from 'expo-router';


export default function TabFourScreen () {
  // const colorScheme = useColorScheme();
  // const textColor = colorScheme === 'dark' ? 'white' : 'black';
  // const textColorInverse = colorScheme === 'dark' ? 'black' : 'white';
  const tabBarHeight = useBottomTabBarHeight();
  const { session } = useSession();
  const [user, setUserData] = useState([]);
  const [created, setCreated] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSave = () => {
    updateUserData(user, session).then();
  };

  // TODO: Note that Name and Phone number are just defaults, they can be overwritten by the user and saved properly
  const Name = "John Doe";
  const PhoneNumber = "+1 (780) 123-4567";

  useEffect(() => {
    const getData = async () => {
      let userData = await fetchUserData(session);
      setUserData(userData);
      if (userData.icon) {
        setImage({uri: userData.icon});
      } else {
        setImage(PlaceholderPhoto)
      }
      setCreated(new Date(userData.created).toDateString())
    }
    getData()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImage({uri: result.assets[0].uri});
      await updateUserData({icon: "data:image/png;base64," + base64}, session);
    }
  };

  return (
    <ThemedView style={styles.container}>
      
      <ThemedView style={[styles.card, { marginBottom: tabBarHeight }]}>
      
        <ThemedView style={styles.header} />
        
        <ThemedView style={styles.profileContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/settings')}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedView style={styles.profileWrapper} >
            <ThemedView style={styles.profileImageContainer} >
              <Image
                  source={image}
                  style={styles.profileImage}
              />
            </ThemedView>
            <TouchableOpacity style={styles.cameraOverlay} onPress={pickImage}>
              <MaterialIcons name="photo-camera" size={24} color="white" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.nameInput}>
            {user.role} {"\n"}
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
                  defaultValue={user.username ? user.username : Name}
                  style={[styles.infoText]}
                  onSubmitEditing={value => updateUserData({username: value.nativeEvent.text}, session)}
              />
              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color="black" />
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.infoRowEditable}>
              <MaterialIcons name="phone" size={20} color="gray" />
              <TextInput
                  defaultValue={user.phone ? user.phone : PhoneNumber}
                  style={[styles.infoText]}
                  // TODO: validate phone number before submitting
                  onSubmitEditing={value => updateUserData({phone: value.nativeEvent.text}, session)}
              />
              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color="black" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.footer}>
            <MaterialIcons name="calendar-today" size={20} color="gray" />
            <Text style={[styles.footerText]}>Account Created {created}</Text>
          </ThemedView>
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
    marginTop: 16
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  }
});
