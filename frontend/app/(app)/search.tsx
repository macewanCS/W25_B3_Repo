import React, { useState } from "react";
import { StyleSheet, Platform, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// import { StyledCalendar } from '@/components/Calendar';

export default function TabTwoScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const data = [
    { id: "1", name: "Alice Johnson" },
    { id: "2", name: "Lisa Davis" },
    { id: "3", name: "Chuck Brown" },
    { id: "4", name: "Jack Wilson" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredResults([]);
    } else {
      setFilteredResults(
        data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Search Results */}
      {filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => navigation.navigate("Profile", { userId: item.id })}
            >
              <ThemedText style={styles.resultText}>{item.name}</ThemedText>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText>No results found.</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};


    // <StyledCalendar />

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
