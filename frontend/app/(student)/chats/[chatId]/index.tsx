import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
// import { useSession } from "@/components/Context";
// import { fetchUserData, updateUserData } from "@/util/Backend";
import { router, useLocalSearchParams } from 'expo-router';


import { FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"

// Message component
const Message = ({ text, isUser, timestamp }) => (
  <ThemedView style={[styles.messageContainer, isUser ? styles.userMessage : styles.otherMessage]}>
    <ThemedText style={isUser ? styles.userMessageText : styles.otherMessageText}>{text}</ThemedText>
    <ThemedText style={styles.timestamp}>{timestamp}</ThemedText>
  </ThemedView>
)

// Header component
const Header = ({ name, online }) => (
  <ThemedView style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={() => router.push('/chat_list')}>
      <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
    </TouchableOpacity>
    <ThemedView style={styles.headerInfo}>
      <ThemedText style={styles.headerName}>{name}</ThemedText>
      <ThemedText style={styles.headerStatus}>{online ? "Online" : "Offline"}</ThemedText>
    </ThemedView>
    <TouchableOpacity style={styles.headerAction}>
      <MaterialIcons name="call" size={22} color="#007AFF" />
    </TouchableOpacity>
  </ThemedView>
)

export default function MessagingScreen() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey there!", isUser: false, timestamp: "10:30 AM" },
    { id: "2", text: "Hi! How are you doing?", isUser: true, timestamp: "10:31 AM" },
    { id: "3", text: "I'm good, thanks for asking. What about you?", isUser: false, timestamp: "10:32 AM" },
    { id: "4", text: "I'm doing great! Just studying for my math test.", isUser: true, timestamp: "10:33 AM" },
    { id: "5", text: "Good idea!", isUser: false, timestamp: "10:35 AM" },
  ])

  const sendMessage = () => {
    if (message.trim() === "") return

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const tabBarHeight = useBottomTabBarHeight();
  const searchParams = useLocalSearchParams(); // Get the search parameters from the URL
  const chatId = searchParams.chatId; // Extract chatId from the search parameters

  const placeholderList = [
    {chatId: "123", name: "Alice Johnson"},
    {chatId: "634", name: "Lisa Davis"},
    {chatId: "802", name: "Chuck Brown"}
  ]

const chat = placeholderList.find((chat) => chat.chatId === chatId);
const chatName = chat ? chat.name : "Unknown";

return (
    <KeyboardAvoidingView
        style={[styles.container, { marginBottom: tabBarHeight }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? tabBarHeight : 0}
    >
        <StatusBar style="auto" />
        <Header name={chatName} online={true} />
        <ThemedView style={{ flex: 1 }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Message text={item.text} isUser={item.isUser} timestamp={item.timestamp} />}
                contentContainerStyle={styles.messagesList}
                inverted={false}
            />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
                <MaterialIcons name="attach-file" size={24} color="#007AFF" />
            </TouchableOpacity>
            <ThemedView style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Message"
                    placeholderTextColor="#8E8E93"
                    multiline
                />
            </ThemedView>
            <TouchableOpacity
                style={[styles.sendButton, message.trim() === "" ? styles.sendButtonDisabled : {}]}
                onPress={sendMessage}
                disabled={message.trim() === ""}
            >
                <MaterialIcons name="send" size={24} color={message.trim() === "" ? "#232323" : "#007AFF"} />
            </TouchableOpacity>
        </ThemedView>
    </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themedView: {
    backgroundColor: "#F2F2F7",
  },
  themedText: {
    color: "#000",
  },
  header: {
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerStatus: {
    fontSize: 13,
    color: "#8E8E93",
  },
  headerAction: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 12,
    borderRadius: 18,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#c7c8c9",
    borderBottomLeftRadius: 4,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
    color: "#8E8E93",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#c7c8c9",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#E5E5EA",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    color: "#000000",
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
})

