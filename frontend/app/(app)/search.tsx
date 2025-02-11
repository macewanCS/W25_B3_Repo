import React, {useEffect, useState} from "react";
import { StyleSheet, Platform, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {useSession} from "@/components/Context";
import {fetchTutors} from "@/util/Backend";
import TutorCard from "@/components/TutorCard";

export default function TabTwoScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const { session } = useSession();
  const [data, setData] = useState([])

  useEffect(() => {
        const getData = async () => {
            let tutors = await fetchTutors(session);
            console.log(tutors);
            setData(tutors);
        }
        getData()
  }, [])

  // TODO: implement search filtering by tutor, availability, etc.
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredResults([]);
    } else {
      setFilteredResults(
        data.filter((item) =>
          item.username.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        Platform.OS === 'ios' && { bottom: 50, marginTop: 100 },
        Platform.OS === 'android' && { marginTop: 50 },
      ]}
    >
      {/* Search Bar */}
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.searchInput, { flex: 1 }]}
          placeholder="Search..."
          // Set placeholder text color here
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
        <TouchableOpacity
          onPress={() => handleSearch(searchQuery)}
        >
          <IconSymbol name="magnifyingglass" size={40} color={'white'} style={{ marginLeft: 10, marginTop: -10 }}/>
        </TouchableOpacity>
      </ThemedView>

              {/* Search Results */}
      {searchQuery.trim() !== "" && (
        filteredResults.length > 0 ? (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                // onPress={() => navigation.navigate("Profile", { userId: item.id })} // No navigation is set up right now
              >
                {/* TODO: Change hardcoding of search results */}
                <TutorCard user={item} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText>No results found.</ThemedText>
          </ThemedView>
        )
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: "white", // Set text color here
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 20,
  },
});
