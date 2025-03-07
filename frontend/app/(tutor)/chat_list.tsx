import { StyleSheet, Image, Platform, FlatList, TouchableOpacity } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function TutorChatsScreen() {

  // Example Chats
  const chats = [
    { id: "1", chatId: "123", name: "Jake T.", lastMessage: "Hey, can I talk to you about your math?" },
    { id: "2", chatId: "634", name: "Presley L.", lastMessage: "Can we do a session next week?" },
    // { id: "3", chatId: "802", name: "Mr. Chuck Brown", lastMessage: "Session at 3 PM work for you?" },
  ];

  const { push } = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Direct Messages</ThemedText>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem} onPress={() => push(`/chats/${item.chatId}/`)}
          >
            <IconSymbol name="person.fill" size={40} color="#007AFF" />
            <ThemedView style={styles.chatInfo}>
              <ThemedText style={styles.chatName}>{item.name}</ThemedText>
              <ThemedText style={styles.lastMessage}>{'> '}{item.lastMessage}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[
          styles.startChatButton,
          Platform.OS === 'ios' && { bottom: 100 }
        ]}
        // onPress={() => navigation.navigate("NewChatScreen")}
      >
        <IconSymbol name="plus" size={24} color="black" />
        <ThemedText style={styles.startChatText}>New Chat</ThemedText>
      </TouchableOpacity>
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
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chatInfo: {
    marginLeft: 10,
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
  },
  startChatButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#a4becf",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startChatText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
